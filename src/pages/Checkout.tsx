
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { withErrorHandling } from '@/lib/supabaseHelpers';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import EmptyCart from '@/components/checkout/EmptyCart';
import CartItemsList from '@/components/checkout/CartItemsList';
import DeliveryDetailsForm from '@/components/checkout/DeliveryDetailsForm';
import PaymentMethodForm from '@/components/checkout/PaymentMethodForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import ErrorDisplay from '@/components/checkout/ErrorDisplay';
import ErrorBoundary from '@/components/ErrorBoundary';

const ATTEMPT_LIMIT = 3; // Maximum number of automatic retries

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, deliveryFee, tax, total, clearCart, isCartLoading } = useCart();
  const { user, profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial state
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // If user not logged in, redirect to login
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Add a timeout to ensure loading state doesn't get stuck
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000); // 5 second max loading time

    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        phone: profile.phone || '',
        address: profile.address ? `${profile.address}, ${profile.city || ''}, ${profile.state || ''}, ${profile.zip_code || ''}`.trim() : ''
      }));
      setIsLoading(false); // Profile data loaded
    }

    return () => clearTimeout(timer);
  }, [profile, user, navigate, isLoading]);

  // Helper function to extract restaurant details from cart items
  const getRestaurantDetails = () => {
    if (cartItems.length === 0) return {
      id: '',
      name: 'Restaurant',
      image: '/placeholder.svg'
    };
    
    const firstItem = cartItems[0];
    return {
      id: firstItem.foodItem.restaurantId || '',
      // Use optional chaining to safely access potential undefined properties
      name: firstItem.foodItem.restaurant?.name || 'Restaurant',
      image: firstItem.foodItem.restaurant?.image || '/placeholder.svg'
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCreditCard = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCreditCard(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setFormData(prev => ({ ...prev, expiryDate: formattedValue }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill out all delivery details');
      return false;
    }
    
    if (paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill out all payment details');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isOffline) {
      toast.error('You are currently offline', {
        description: 'Please check your internet connection and try again.'
      });
      return;
    }
    
    setIsProcessing(true);
    setSubmitError(null);
    
    try {
      if (!user) {
        toast.error('You must be logged in to place an order');
        navigate('/auth/login');
        return;
      }

      const restaurant = getRestaurantDetails();

      if (!restaurant) {
        toast.error('No items in cart');
        return;
      }

      const result = await withErrorHandling(async () => {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            restaurant_id: restaurant.id,
            restaurant_name: restaurant.name,
            restaurant_image: restaurant.image,
            status: 'pending',
            items: cartItems.map(item => ({
              id: item.id,
              name: item.foodItem.name,
              price: item.foodItem.price,
              quantity: item.quantity,
              image: item.foodItem.image,
              selectedOptions: item.selectedOptions || []
            })),
            delivery_address: {
              name: formData.name,
              phone: formData.phone,
              address: formData.address
            },
            subtotal,
            delivery_fee: deliveryFee,
            tax,
            total,
            estimated_delivery_time: '30-45 minutes'
          })
          .select();
        
        if (error) throw error;
        return data;
      }, 'Failed to process order', 10000); // 10-second timeout for order processing
      
      if (result) {
        // Success! Clear cart and navigate to success page
        clearCart();
        navigate('/payment-success');
      } else {
        // Something went wrong, but we've already shown a toast in withErrorHandling
        throw new Error('Failed to process order');
      }
    } catch (error: any) {
      console.error('Error saving order:', error);
      setSubmitError(error.message || 'Failed to process order');
      
      // Auto-retry if under the attempt limit
      if (retryAttempts < ATTEMPT_LIMIT) {
        const nextAttempt = retryAttempts + 1;
        setRetryAttempts(nextAttempt);
        
        toast.error(`Order submission failed (Attempt ${nextAttempt}/${ATTEMPT_LIMIT})`, {
          description: 'Automatically retrying...'
        });
        
        // Wait and retry
        setTimeout(() => {
          if (!isProcessing) { // Don't retry if user already manually retried
            handleSubmit(new Event('submit') as unknown as React.FormEvent);
          }
        }, 2000);
      } else {
        toast.error('Failed to process order', {
          description: error.message
        });
      }
    } finally {
      // Even if there's an error, we need to end the processing state
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    setRetryAttempts(0);
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  // Show offline warning
  if (isOffline) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
            <h2 className="text-xl font-medium text-yellow-800 dark:text-yellow-300 mb-2">You're currently offline</h2>
            <p className="text-yellow-700 dark:text-yellow-400 mb-4">
              Please check your internet connection to continue with checkout.
            </p>
            <button
              onClick={() => setIsOffline(!navigator.onLine)}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:hover:bg-yellow-700 dark:text-yellow-100 px-4 py-2 rounded-md"
            >
              Check Connection
            </button>
          </div>
          
          <div className="mt-8">
            <EmptyCart />
          </div>
        </div>
      </div>
    );
  }

  // Show loading skeleton
  if (isLoading || isCartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <CheckoutSkeleton />
        </div>
      </div>
    );
  }

  // Show empty cart
  if (cartItems.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <EmptyCart />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>
        
        <div className="md:grid md:grid-cols-3 md:gap-10">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-medium mb-6">Checkout</h1>
            
            <ErrorBoundary>
              {!isProcessing && <CartItemsList cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
              
              {/* Display error message with retry option if submission failed */}
              {submitError && <ErrorDisplay errorMessage={submitError} onRetry={handleRetry} />}
              
              <form onSubmit={handleSubmit}>
                <DeliveryDetailsForm formData={formData} handleInputChange={handleInputChange} />
                
                <PaymentMethodForm 
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  formData={formData}
                  handleCardNumberChange={handleCardNumberChange}
                  handleExpiryDateChange={handleExpiryDateChange}
                  handleInputChange={handleInputChange}
                />
              </form>
            </ErrorBoundary>
          </div>
          
          <div className="md:col-span-1">
            <OrderSummary 
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
              isProcessing={isProcessing}
              cartItemsEmpty={cartItems.length === 0}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
