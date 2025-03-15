
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, CheckCircle, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import OrderTracking from '@/components/OrderTracking';

const PaymentSuccess = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock delivery partner information
  const [deliveryPartner, setDeliveryPartner] = useState({
    name: 'Alex Rivera',
    phone: '(555) 123-4567',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    deliveries: 342
  });

  // Simulated order details
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

  // Mock order for tracking
  const mockOrder = {
    id: orderDetails.orderId,
    status: 'preparing',
    estimatedDeliveryTime: orderDetails.estimatedDelivery,
    deliveryPartner: {
      id: 'dp1',
      name: deliveryPartner.name,
      phone: deliveryPartner.phone,
      photo: deliveryPartner.photo,
      rating: deliveryPartner.rating,
      deliveries_completed: deliveryPartner.deliveries
    },
    trackingUpdates: [
      {
        id: 'tu1',
        status: 'order_received',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        description: 'Your order has been received by the restaurant'
      },
      {
        id: 'tu2',
        status: 'preparing',
        timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
        description: 'The restaurant is preparing your food'
      }
    ]
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

          {/* Delivery Partner Info */}
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
                          ({deliveryPartner.deliveries}+ deliveries)
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
              <OrderTracking order={mockOrder} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
