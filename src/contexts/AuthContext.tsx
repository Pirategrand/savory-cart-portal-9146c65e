import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { toast } from "sonner";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, phone: string) => Promise<void>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_AUTH_LOADING_TIME = 5000; // 5 second safety timeout

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Fetching initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't await this - don't block app initialization on profile fetch
          fetchProfile(session.user.id).catch(err => {
            console.error('Error fetching initial profile, continuing anyway:', err);
          });
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        // Ensure loading state is set to false regardless of success/failure
        setLoading(false);
      }
    };

    getInitialSession();

    // Add safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, MAX_AUTH_LOADING_TIME);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Don't block UI on profile fetch
          fetchProfile(session.user.id).catch(err => {
            console.error('Error fetching profile on auth change, continuing anyway:', err);
          });
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as Profile);
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Don't throw - allow the app to continue without profile data
      return null;
    }
  };

  const sendWelcomeEmail = async (email: string, first_name?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('welcome-email', {
        body: { email, first_name },
      });

      if (error) throw error;
      console.log('Welcome email sent:', data);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const signUp = async (email: string, password: string, phone: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            phone
          }
        }
      });

      if (error) {
        throw error;
      }

      await sendWelcomeEmail(email);

      toast.success('Registration successful!', {
        description: 'Please check your email to verify your account.'
      });

      navigate('/auth/login');
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');
      setLoading(true);
      
      // Clear session state first to prevent UI issues
      setUser(null);
      setSession(null);
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged out successfully!');
      
      // Force navigation and reset after a short delay
      setTimeout(() => {
        navigate('/');
        console.log('Navigated to home after signout');
      }, 100);
    } catch (error: any) {
      console.error('Signout error:', error);
      toast.error('Logout failed', {
        description: error.message
      });
    } finally {
      // Ensure loading state is set to false regardless of success/failure
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent!', {
        description: 'Please check your email to reset your password.'
      });
    } catch (error: any) {
      toast.error('Password reset failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      toast.error('Password update failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      await fetchProfile(user.id);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error('Profile update failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
