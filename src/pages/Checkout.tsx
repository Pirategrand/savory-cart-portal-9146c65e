
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
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

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // Add a timeout to ensure loading state doesn't get stuck
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        phone: profile.phone || '',
        address: profile.address ? `${profile.address}, ${profile.city || ''}, ${profile.state || ''}, ${profile.zip_code || ''}`.trim() : ''
      }));
    }

    return () => clearTimeout(timer);
  }, [profile, user, navigate]);

  // Helper function to extract restaurant details from cart items
  const getRestaurantDetails = () => {
    if (cartItems.length === 0) return null;
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill out all delivery details');
      return;
    }
    
    if (paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast.error('Please fill out all payment details');
        return;
      }
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

      // Set a timeout to prevent the operation from hanging indefinitely
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database operation timed out')), 10000);
      });

      // Race between the actual operation and the timeout
      const result = await Promise.race([
        supabase
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
          }),
        timeoutPromise
      ]) as any;

      if ('error' in result && result.error) {
        throw result.error;
      }

      clearCart();
      navigate('/payment-success');
    } catch (error: any) {
      console.error('Error saving order:', error);
      setSubmitError(error.message || 'Failed to process order');
      toast.error('Failed to process order', {
        description: error.message
      });
    } finally {
      // Even if there's an error, we need to end the processing state
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  if (isLoading) {
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
