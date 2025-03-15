
import React, { useState, useEffect, useRef } from 'react';
import { Order, TrackingUpdate, DeliveryPartner } from '@/lib/types';
import { Check, ChefHat, ShoppingBag, Bike, Home, Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { subscribeToOrderUpdates, simulateOrderUpdates } from '@/lib/orderTrackingService';

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

const OrderTrackingError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 space-y-6">
    <div className="flex flex-col items-center text-center py-6">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Unable to load tracking information</h3>
      <p className="text-muted-foreground mb-4">
        We're having trouble retrieving the latest tracking information for your order.
      </p>
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    </div>
  </div>
);

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>(order.trackingUpdates || []);
  const isMounted = useRef(true);
  const loadingTimeoutRef = useRef<number | null>(null);
  const simulationRef = useRef<(() => void) | null>(null);
  
  // Default delivery partner if not provided
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
  
  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      if (isMounted.current) setIsLoading(false);
    }, 1000);
    
    // Set a timeout in case loading takes too long
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && isLoading) {
        setLoadingTimeout(true);
        setIsLoading(false);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  // Subscribe to real-time updates and fallback to simulation
  useEffect(() => {
    // If we already have tracking updates, use them as initial state
    if (order.trackingUpdates && order.trackingUpdates.length > 0) {
      setTrackingUpdates(order.trackingUpdates);
    }
    
    // Handle new tracking updates
    const handleUpdate = (update: TrackingUpdate) => {
      if (isMounted.current) {
        setTrackingUpdates(prev => {
          // Don't add duplicate updates
          if (prev.some(item => item.status === update.status)) {
            return prev;
          }
          return [...prev, update];
        });
      }
    };

    // Try to subscribe to real-time updates
    let cleanup: (() => void) | null = null;
    
    try {
      // First try real-time subscription
      cleanup = subscribeToOrderUpdates(order.id, handleUpdate);
      console.log('Subscribed to real-time updates for order:', order.id);
    } catch (error) {
      console.error('Error subscribing to real-time updates:', error);
      // On error, fallback to simulation
      const currentStatus = trackingUpdates.length > 0 
        ? trackingUpdates[trackingUpdates.length - 1].status 
        : 'pending';
        
      simulationRef.current = simulateOrderUpdates(currentStatus as string, handleUpdate);
      cleanup = simulationRef.current;
    }
    
    // Always set up simulation as fallback if no updates are received
    const fallbackTimer = setTimeout(() => {
      // If we have fewer than 2 updates after 10 seconds, start simulation
      if (trackingUpdates.length < 2 && isMounted.current && !simulationRef.current) {
        console.log('No real-time updates received, starting simulation');
        const currentStatus = trackingUpdates.length > 0 
          ? trackingUpdates[trackingUpdates.length - 1].status 
          : 'pending';
          
        simulationRef.current = simulateOrderUpdates(currentStatus as string, handleUpdate);
      }
    }, 10000);
    
    return () => {
      isMounted.current = false;
      if (cleanup) cleanup();
      if (simulationRef.current) simulationRef.current();
      clearTimeout(fallbackTimer);
    };
  }, [order.id]);
  
  // Calculate progress percentage based on tracking updates
  const getProgressPercentage = () => {
    const statusMap: Record<string, number> = {
      'order_received': 0,
      'pending': 0,
      'confirmed': 20,
      'preparing': 30,
      'ready_for_pickup': 50,
      'out_for_delivery': 75,
      'delivered': 100
    };
    
    const currentStatus = trackingUpdates.length > 0 
      ? trackingUpdates[trackingUpdates.length - 1].status 
      : 'pending';
      
    return typeof currentStatus === 'string' && statusMap[currentStatus] !== undefined 
      ? statusMap[currentStatus] 
      : 0;
  };
  
  // Format timestamp to readable time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'order_received':
      case 'pending':
      case 'confirmed':
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
  
  // Function to retry loading data
  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(null);
    
    // Simulate fetching updated data
    setTimeout(() => {
      if (isMounted.current) setIsLoading(false);
    }, 1000);
  };
  
  if (isLoading) {
    return <OrderTrackingSkeleton />;
  }

  if (loadError) {
    return <OrderTrackingError onRetry={handleRetry} />;
  }

  // Show a fallback notice if loading took too long but we have sample data
  const showTimeoutMessage = loadingTimeout && !loadError;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-5 space-y-6">
      {showTimeoutMessage && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
            Showing estimated tracking information while we connect to the server.
          </p>
        </div>
      )}

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
                    getStatusIcon(update.status as string)
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
        <p>Estimated delivery time: {order.estimatedDeliveryTime || '30-45 minutes'}</p>
      </div>
    </div>
  );
};

export default OrderTracking;
