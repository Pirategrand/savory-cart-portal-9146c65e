import React, { useState, useEffect, useRef } from 'react';
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
const MAX_LOADING_TIME = 10000; // 10 seconds max loading time
const PROFILE_LOADING_FALLBACK = 3000; // 3 seconds fallback for profile loading

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, deliveryFee, tax, total, clearCart, isCartLoading } = useCart();
  const { user, profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const navigate = useNavigate();
  
  const isMounted = useRef(true);
  const loadingTimeoutRef = useRef<number | null>(null);
  const processingTimeoutRef = useRef<number | null>(null);
  const profileTimeoutRef = useRef<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const clearAllTimeouts = () => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      clearAllTimeouts();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && isLoading) {
        console.warn('Forcing checkout loading state to false after timeout');
        setIsLoading(false);
      }
    }, MAX_LOADING_TIME);

    profileTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && isLoading && !profile) {
        console.warn('Profile data not available after timeout, continuing anyway');
        setIsLoading(false);
      }
    }, PROFILE_LOADING_FALLBACK);

    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        phone: profile.phone || '',
        address: profile.address ? `${profile.address}, ${profile.city || ''}, ${profile.state || ''}, ${profile.zip_code || ''}`.trim() : ''
      }));
      setIsLoading(false); // Profile data loaded
    }

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
    };
  }, [profile, user, navigate, isLoading]);

  useEffect(() => {
    if (!isCartLoading && isLoading) {
      const timer = setTimeout(() => {
        if (isMounted.current) {
          console.log('Cart loading complete, updating checkout loading state');
          setIsLoading(false);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isCartLoading, isLoading]);

  useEffect(() => {
    if (isProcessing) {
      processingTimeoutRef.current = window.setTimeout(() => {
        if (isMounted.current) {
          console.warn('Order processing timeout reached, resetting state');
          setIsProcessing(false);
          if (!submitError) {
            setSubmitError('The order is taking longer than expected. Please try again.');
          }
        }
      }, 15000); // 15 seconds max processing time
      
      return () => {
        if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
      };
    }
  }, [isProcessing, submitError]);

  const getRestaurantDetails = () => {
    if (cartItems.length === 0) return {
      id: '',
      name: 'Restaurant',
      image: '/placeholder.svg'
    };
    
    const firstItem = cartItems[0];
    return {
      id: firstItem.foodItem.restaurantId || '',
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
    
    if (paymentMethod === 'credit-card' && !isPaymentComplete) {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill out all payment details');
        return false;
      }
    }
    
    return true;
  };

  const handlePaymentComplete = () => {
    setIsPaymentComplete(true);
    toast.success('Payment successful', {
      description: 'Your payment has been processed'
    });
  };

  const handlePaymentError = (error: string) => {
    toast.error('Payment failed', {
      description: error
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (paymentMethod === 'cashapp' && !isPaymentComplete) {
      toast.error('Please complete the Cash App payment first');
      return;
    }
    
    if (isOffline) {
      toast.error('You are currently offline', {
        description: 'Please check your internet connection and try again.'
      });
      return;
    }
    
    if (isProcessing) {
      console.log('Order submission already in progress');
      return;
    }
    
    if (isMounted.current) setIsProcessing(true);
    if (isMounted.current) setSubmitError(null);
    
    try {
      if (!user) {
        toast.error('You must be logged in to place an order');
        navigate('/auth/login');
        return;
      }

      const restaurant = getRestaurantDetails();

      if (!restaurant || !restaurant.id) {
        toast.error('No restaurant information found');
        setIsProcessing(false);
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
            payment_method: paymentMethod
          })
          .select();
        
        if (error) throw error;
        return data;
      }, 'Failed to process order', 10000); // 10-second timeout for order processing
      
      if (result) {
        clearCart();
        setIsPaymentComplete(false);
        navigate('/payment-success');
      } else {
        throw new Error('Failed to process order');
      }
    } catch (error: any) {
      console.error('Error saving order:', error);
      if (isMounted.current) setSubmitError(error.message || 'Failed to process order');
      
      if (retryAttempts < ATTEMPT_LIMIT) {
        const nextAttempt = retryAttempts + 1;
        setRetryAttempts(nextAttempt);
        
        toast.error(`Order submission failed (Attempt ${nextAttempt}/${ATTEMPT_LIMIT})`, {
          description: 'Automatically retrying...'
        });
        
        setTimeout(() => {
          if (isMounted.current && !isProcessing) {
            handleSubmit(new Event('submit') as unknown as React.FormEvent);
          }
        }, 2000);
      } else {
        toast.error('Failed to process order', {
          description: error.message
        });
      }
    } finally {
      setTimeout(() => {
        if (isMounted.current && isProcessing) {
          setIsProcessing(false);
        }
      }, 500);
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    setRetryAttempts(0);
    toast.info('Please try submitting your order again', {
      description: 'We have reset the error state'
    });
  };

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
                  amount={total}
                  onPaymentComplete={handlePaymentComplete}
                  onPaymentError={handlePaymentError}
                  customerEmail={user?.email}
                  isPaymentComplete={isPaymentComplete}
                  setIsPaymentComplete={setIsPaymentComplete}
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
