
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";
import { RestaurantOwner } from '@/lib/types';

interface RestaurantAuthContextType {
  session: Session | null;
  user: User | null;
  restaurantProfile: RestaurantOwner | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const RestaurantAuthContext = createContext<RestaurantAuthContextType | undefined>(undefined);

const MAX_AUTH_LOADING_TIME = 5000; // 5 second safety timeout

export const RestaurantAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Fetching initial restaurant session...');
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await this - don't block app initialization on profile fetch
          fetchRestaurantProfile(session.user.id).catch(err => {
            console.error('Error fetching initial restaurant profile, continuing anyway:', err);
          });
        }
      } catch (error) {
        console.error('Error fetching initial restaurant session:', error);
      } finally {
        // Ensure loading state is set to false regardless of success/failure
        setLoading(false);
      }
    };

    getInitialSession();

    // Add safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Restaurant auth loading timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, MAX_AUTH_LOADING_TIME);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Restaurant auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't block UI on profile fetch
          fetchRestaurantProfile(session.user.id).catch(err => {
            console.error('Error fetching restaurant profile on auth change, continuing anyway:', err);
          });
        } else {
          setRestaurantProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const fetchRestaurantProfile = async (userId: string): Promise<RestaurantOwner | null> => {
    try {
      // For demo purposes, we'll use demo data since Supabase doesn't have a restaurant_owners table yet
      const demoRestaurants = [
        { id: '1', restaurantId: 'rest1', email: 'owner1@example.com', name: 'John\'s Pizza' },
        { id: '2', restaurantId: 'rest2', email: 'owner2@example.com', name: 'Tasty Thai' },
        { id: '3', restaurantId: 'rest3', email: 'owner3@example.com', name: 'Burger Palace' }
      ];
      
      // In a real implementation, we would fetch from Supabase
      // const { data, error } = await supabase
      //   .from('restaurant_owners')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();

      // if (error) throw error;
      
      // Simulate finding a restaurant by user ID
      // For demo purposes, just use the first restaurant
      const demoRestaurant = demoRestaurants[0];
      setRestaurantProfile(demoRestaurant);
      return demoRestaurant;
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Logged in to restaurant portal successfully!');
      navigate('/restaurant-admin');
    } catch (error: any) {
      toast.error('Restaurant login failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out of restaurant portal...');
      setLoading(true);
      
      // Clear session state first to prevent UI issues
      setUser(null);
      setSession(null);
      setRestaurantProfile(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged out of restaurant portal successfully!');
      
      // Force navigation and reset after a short delay
      setTimeout(() => {
        navigate('/restaurant-login');
        console.log('Navigated to restaurant login after signout');
      }, 100);
    } catch (error: any) {
      console.error('Restaurant signout error:', error);
      toast.error('Restaurant logout failed', {
        description: error.message
      });
    } finally {
      // Ensure loading state is set to false regardless of success/failure
      setLoading(false);
    }
  };

  return (
    <RestaurantAuthContext.Provider
      value={{
        session,
        user,
        restaurantProfile,
        loading,
        signIn,
        signOut
      }}
    >
      {children}
    </RestaurantAuthContext.Provider>
  );
};

export const useRestaurantAuth = () => {
  const context = useContext(RestaurantAuthContext);
  if (context === undefined) {
    throw new Error('useRestaurantAuth must be used within a RestaurantAuthProvider');
  }
  return context;
};
