import React, { useState, useEffect } from 'react';
import { Order, TrackingUpdate, DeliveryPartner } from '@/lib/types';
import { Check, ChefHat, ShoppingBag, Bike, Home, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderTrackingProps {
  order: Order;
}

const OrderTrackingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-2 w-full" />
    </div>
    
    <div className="border-t border-b py-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-4 w-24" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <OrderTrackingSkeleton />;
  }

  // Sample delivery partner and tracking updates if not provided in order
  const [deliveryPartner, setDeliveryPartner] = useState<DeliveryPartner>(
    order.deliveryPartner || {
      id: 'dp1',
      name: 'Alex Rivera',
      phone: '(555) 123-4567',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      deliveries_completed: 342
    }
  );
  
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>(
    order.trackingUpdates || [
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
      },
      {
        id: 'tu3',
        status: 'ready_for_pickup',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        description: 'Your order is ready and waiting for pickup'
      },
      {
        id: 'tu4',
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        description: 'Your order is on the way'
      }
    ]
  );
  
  // Calculate progress percentage based on tracking updates
  const getProgressPercentage = () => {
    const statusMap: Record<TrackingUpdate['status'], number> = {
      'order_received': 0,
      'preparing': 25,
      'ready_for_pickup': 50,
      'out_for_delivery': 75,
      'delivered': 100
    };
    
    const currentStatus = trackingUpdates[trackingUpdates.length - 1]?.status;
    return currentStatus ? statusMap[currentStatus] : 0;
  };
  
  // Format timestamp to readable time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get status icon
  const getStatusIcon = (status: TrackingUpdate['status']) => {
    switch (status) {
      case 'order_received':
        return <ShoppingBag className="h-5 w-5" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5" />;
      case 'ready_for_pickup':
        return <ShoppingBag className="h-5 w-5" />;
      case 'out_for_delivery':
        return <Bike className="h-5 w-5" />;
      case 'delivered':
        return <Home className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  // Simulate delivery progress for demo purposes
  useEffect(() => {
    if (getProgressPercentage() < 100) {
      const timer = setTimeout(() => {
        // Add delivered status if not already there
        if (!trackingUpdates.find(update => update.status === 'delivered')) {
          const newUpdate = {
            id: 'tu5',
            status: 'delivered' as const,
            timestamp: new Date().toISOString(),
            description: 'Your order has been delivered. Enjoy!'
          };
          setTrackingUpdates([...trackingUpdates, newUpdate]);
        }
      }, 30000); // Simulate delivery after 30 seconds
      
      return () => clearTimeout(timer);
    }
  }, [trackingUpdates]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Order Tracking</h3>
        <Progress value={getProgressPercentage()} className="h-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>Order Placed</span>
          <span>Delivered</span>
        </div>
      </div>
      
      {/* Delivery Partner Info */}
      {getProgressPercentage() >= 75 && getProgressPercentage() < 100 && (
        <div className="flex items-center gap-4 border-t border-b py-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={deliveryPartner.photo} alt={deliveryPartner.name} />
            <AvatarFallback>{deliveryPartner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex justify-between">
              <h4 className="font-medium">{deliveryPartner.name}</h4>
              <div className="flex items-center text-sm">
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
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {deliveryPartner.deliveries_completed}+ deliveries
            </p>
            <div className="flex gap-2 mt-2">
              <a
                href={`tel:${deliveryPartner.phone}`}
                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1 rounded-full"
              >
                Call
              </a>
              <button className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                Message
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tracking Timeline */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Delivery Updates</h4>
        <div className="space-y-4">
          {trackingUpdates.map((update, index) => (
            <div key={update.id} className="flex gap-3">
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === trackingUpdates.length - 1
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {index === trackingUpdates.length - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    getStatusIcon(update.status)
                  )}
                </div>
                {index < trackingUpdates.length - 1 && (
                  <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700 absolute top-8"></div>
                )}
              </div>
              
              <div className="pb-6">
                <p className="font-medium text-sm">
                  {update.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatTime(update.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Estimated delivery time: {order.estimatedDeliveryTime}</p>
      </div>
    </div>
  );
};

export default OrderTracking;
