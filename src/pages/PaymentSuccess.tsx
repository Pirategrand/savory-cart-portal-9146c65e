
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const PaymentSuccess = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulated order details
  const orderDetails = {
    orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    estimatedDelivery: '30-45 minutes',
    deliveryAddress: '123 Main St, Apt 4B, City, State, ZIP'
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col items-center">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center subtle-shadow relative overflow-hidden">
            {/* Success Animation */}
            <div className="mb-6 relative">
              <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-14 w-14 text-green-500 animate-bounce-in" />
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-4 border-green-500 animate-ping opacity-20"></div>
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
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse-subtle"></div>
                <div className="h-[2px] w-16 bg-blue-200 dark:bg-blue-700"></div>
                <div className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-700"></div>
                <div className="h-[2px] w-16 bg-blue-200 dark:bg-blue-700"></div>
                <div className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-700"></div>
                <div className="h-[2px] w-16 bg-blue-200 dark:bg-blue-700"></div>
                <div className="h-3 w-3 rounded-full bg-blue-200 dark:bg-blue-700"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Order Placed</span>
                <span>Preparing</span>
                <span>On the Way</span>
                <span>Delivered</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                <Clock className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
