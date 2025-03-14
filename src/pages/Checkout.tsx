
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckSquare, Minus, Plus, Trash2, ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
        <Trash2 className="h-12 w-12 text-blue-400 dark:text-blue-300" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link to="/">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Browse Restaurants
        </Button>
      </Link>
    </div>
  );
};

const CheckoutSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 subtle-shadow">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
      ]);

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
            
            {!isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
                <h2 className="text-lg font-medium mb-4">Your Order</h2>
                <div className="space-y-4 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.foodItem.image} 
                          alt={item.foodItem.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.foodItem.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.foodItem.description.substring(0, 60)}...</p>
                        
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {item.selectedOptions.map((option, index) => (
                              <span key={index}>
                                {option.optionName}: {option.choice.name}
                                {index < item.selectedOptions!.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="font-medium">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display error message with retry option if submission failed */}
            {submitError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
                <div className="flex flex-col items-center text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                  <h3 className="text-lg font-medium text-red-700 dark:text-red-400">Order Submission Failed</h3>
                  <p className="text-red-600 dark:text-red-300 mb-4">{submitError}</p>
                  <Button 
                    onClick={handleRetry}
                    variant="outline" 
                    className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-400"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
                <h2 className="text-lg font-medium mb-4">Delivery Details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main St, Apt 4B, City, State, ZIP"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <RadioGroup 
                  defaultValue="credit-card" 
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
                        Credit / Debit Card
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-grow cursor-pointer">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                        Cash on Delivery
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'credit-card' && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-24 subtle-shadow">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </div>
                ) : 'Place Order'}
              </Button>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                By placing your order, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
