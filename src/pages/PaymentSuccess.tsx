
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, CheckCircle, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import OrderTracking from '@/components/OrderTracking';
import { supabase } from '@/integrations/supabase/client';
import { withErrorHandling } from '@/lib/supabaseHelpers';
import { Order, FoodItem, CartItem, TrackingUpdate, DeliveryPartner } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  // Delivery partner information
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartner>({
    id: 'dp1',
    name: 'Alex Rivera',
    phone: '(555) 123-4567',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    deliveries_completed: 342
  });

  // Order details
  const [orderDetails, setOrderDetails] = useState({
    orderId: 'ORD-301402',
    estimatedDelivery: '30-45 minutes',
    deliveryAddress: '123 Main St, Apt 4B, City, State, ZIP'
  });

  // Handle notification subscription
  const handleNotificationSubscribe = () => {
    setTimeout(() => {
      toast.success('Notifications enabled!', {
        description: 'You will receive updates about your order.'
      });
    }, 500);
  };

  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    
    return () => {
      isMounted.current = false;
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  // Helper function to safely access delivery_address properties
  const getDeliveryAddressProperty = (
    address: any, 
    property: string, 
    defaultValue: string = ''
  ): string => {
    if (!address) return defaultValue;
    if (typeof address !== 'object') return defaultValue;
    return typeof address[property] === 'string' ? address[property] : defaultValue;
  };

  // Fetch the most recent order when component mounts
  useEffect(() => {
    const fetchRecentOrder = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await withErrorHandling(async () => {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) throw error;
          return data && data.length > 0 ? data[0] : null;
        }, 'Failed to fetch order details');

        if (result) {
          // Create a properly formatted Order object from the database result
          const orderData: Order = {
            id: result.id,
            items: Array.isArray(result.items) ? result.items as any[] : [],
            restaurant: {
              id: result.restaurant_id,
              name: result.restaurant_name,
              image: result.restaurant_image || '',
              cuisine: '',
              rating: 0,
              deliveryTime: '30-45 minutes',
              deliveryFee: '0',
              minimumOrder: '0'
            },
            status: (result.status as any) || 'pending',
            deliveryAddress: {
              street: getDeliveryAddressProperty(result.delivery_address, 'address', ''),
              city: getDeliveryAddressProperty(result.delivery_address, 'city', ''),
              state: getDeliveryAddressProperty(result.delivery_address, 'state', ''),
              zipCode: getDeliveryAddressProperty(result.delivery_address, 'zip_code', '')
            },
            paymentMethod: {
              id: 'card1',
              type: 'credit',
              last4: '1234',
              expiryDate: '12/25',
              name: getDeliveryAddressProperty(result.delivery_address, 'name', 'Card Holder')
            },
            subtotal: result.subtotal || 0,
            deliveryFee: result.delivery_fee || 0,
            tax: result.tax || 0,
            total: result.total || 0,
            estimatedDeliveryTime: '30-45 minutes',
            deliveryPartner: deliveryPartner,
            trackingUpdates: generateTrackingUpdates(result.status)
          };
          
          setOrder(orderData);
          
          // Update order details from the fetched data
          setOrderDetails({
            orderId: result.id.substring(0, 8).toUpperCase(),
            estimatedDelivery: '30-45 minutes',
            deliveryAddress: formatDeliveryAddress(result.delivery_address)
          });
        } else {
          // Use the mock data if no order is found
          createMockOrder();
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoadError(error instanceof Error ? error.message : 'Unknown error');
        // Fallback to mock data on error
        createMockOrder();
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    };

    // Set a safety timeout to prevent infinite loading
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && isLoading) {
        setIsLoading(false);
        // Fallback to mock data if loading takes too long
        if (!order) createMockOrder();
      }
    }, 5000);

    fetchRecentOrder();

    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, [user]);

  // Format delivery address from the Supabase order data
  const formatDeliveryAddress = (addressData: any) => {
    if (!addressData) return 'Address not available';
    
    if (typeof addressData !== 'object') {
      return 'Address not available';
    }
    
    const parts = [
      getDeliveryAddressProperty(addressData, 'address', ''),
      getDeliveryAddressProperty(addressData, 'city', ''),
      getDeliveryAddressProperty(addressData, 'state', ''),
      getDeliveryAddressProperty(addressData, 'zip_code', '')
    ];
    
    return parts.filter(Boolean).join(', ');
  };

  // Generate tracking updates based on order status
  const generateTrackingUpdates = (status: string): TrackingUpdate[] => {
    const now = new Date();
    
    const updates: TrackingUpdate[] = [
      {
        id: 'tu1',
        status: 'order_received',
        timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
        description: 'Your order has been received by the restaurant'
      }
    ];
    
    if (status === 'pending' || status === 'confirmed' || status === 'preparing' || 
        status === 'ready_for_pickup' || status === 'out_for_delivery' || status === 'delivered') {
      updates.push({
        id: 'tu2',
        status: 'preparing',
        timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
        description: 'The restaurant is preparing your food'
      });
    }
    
    if (status === 'ready_for_pickup' || status === 'out_for_delivery' || status === 'delivered') {
      updates.push({
        id: 'tu3',
        status: 'ready_for_pickup',
        timestamp: new Date(now.getTime() - 15 * 60000).toISOString(),
        description: 'Your order is ready and waiting for pickup'
      });
    }
    
    if (status === 'out_for_delivery' || status === 'delivered') {
      updates.push({
        id: 'tu4',
        status: 'out_for_delivery',
        timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
        description: 'Your order is on the way'
      });
    }
    
    if (status === 'delivered') {
      updates.push({
        id: 'tu5',
        status: 'delivered',
        timestamp: new Date().toISOString(),
        description: 'Your order has been delivered. Enjoy!'
      });
    }
    
    return updates;
  };

  // Create a mock order if Supabase fetch fails or returns no data
  const createMockOrder = () => {
    if (order) return; // Don't create a mock if we already have an order
    
    const mockOrder: Order = {
      id: orderDetails.orderId,
      items: [],
      restaurant: {
        id: 'rest123',
        name: 'Restaurant',
        image: '/placeholder.svg',
        cuisine: 'Various',
        rating: 4.5,
        deliveryTime: orderDetails.estimatedDelivery,
        deliveryFee: '$2.99',
        minimumOrder: '$15.00'
      },
      status: 'preparing',
      deliveryAddress: {
        street: orderDetails.deliveryAddress.split(',')[0] || '',
        city: orderDetails.deliveryAddress.split(',')[1] || '',
        state: orderDetails.deliveryAddress.split(',')[2] || '',
        zipCode: orderDetails.deliveryAddress.split(',')[3] || ''
      },
      paymentMethod: {
        id: 'card1',
        type: 'credit',
        last4: '1234',
        expiryDate: '12/25',
        name: 'Card Holder'
      },
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      estimatedDeliveryTime: orderDetails.estimatedDelivery,
      deliveryPartner: deliveryPartner,
      trackingUpdates: generateTrackingUpdates('preparing')
    };
    
    setOrder(mockOrder);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center subtle-shadow relative overflow-hidden mb-8">
            {/* Success Animation */}
            <div className="mb-6 relative">
              <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                <CheckCircle className="h-14 w-14 text-green-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-medium mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been received and is being prepared.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Estimated Delivery:</span>
                <span className="font-medium">{orderDetails.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Delivery Address:</span>
                <span className="font-medium text-right">{orderDetails.deliveryAddress}</span>
              </div>
            </div>

            {/* Notification subscription */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <p className="text-blue-700 dark:text-blue-300 mb-3">Get real-time updates on your order</p>
              <Button 
                onClick={handleNotificationSubscribe}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Enable Notifications
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/orders" className="flex-1">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Clock className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </Link>
            </div>
          </div>

          {/* Delivery Partner Info and Order Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <h2 className="text-lg font-medium mb-4">Delivery Partner</h2>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={deliveryPartner.photo} alt={deliveryPartner.name} />
                        <AvatarFallback>{deliveryPartner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <h3 className="text-lg font-medium">{deliveryPartner.name}</h3>
                      <div className="flex items-center mt-1 mb-2">
                        <span className="flex items-center text-yellow-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 mr-1"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {deliveryPartner.rating}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({deliveryPartner.deliveries_completed}+ deliveries)
                        </span>
                      </div>
                      
                      <div className="flex gap-2 w-full mt-4">
                        <Button variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Tracking */}
            <div className="md:col-span-2">
              {order ? (
                <OrderTracking order={order} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-muted-foreground">Loading order tracking...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
