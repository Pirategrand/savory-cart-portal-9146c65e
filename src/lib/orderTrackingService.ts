
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order, TrackingUpdate } from './types';

/**
 * Subscribe to real-time order updates from Supabase
 * @param orderId The ID of the order to track
 * @param onUpdate Callback function to handle order updates
 * @returns Cleanup function to unsubscribe
 */
export const subscribeToOrderUpdates = (
  orderId: string,
  onUpdate: (updates: TrackingUpdate) => void
) => {
  // Create a channel for order updates
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        console.log('Order update received:', payload);
        // Convert the payload to a tracking update
        if (payload.new && payload.new.status) {
          const update: TrackingUpdate = {
            id: `update-${Date.now()}`,
            status: payload.new.status as any,
            timestamp: new Date().toISOString(),
            description: getStatusDescription(payload.new.status)
          };
          
          onUpdate(update);
          
          // Show a toast notification for the update
          toast.info(`Order Status Update: ${update.description}`);
        }
      }
    )
    .subscribe();
  
  // Return a cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Get a human-readable description for an order status
 */
const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Your order is pending confirmation';
    case 'confirmed':
      return 'Your order has been confirmed';
    case 'preparing':
      return 'The restaurant is preparing your food';
    case 'ready_for_pickup':
      return 'Your order is ready for pickup';
    case 'out_for_delivery':
      return 'Your order is on the way';
    case 'delivered':
      return 'Your order has been delivered';
    default:
      return `Order status updated to: ${status}`;
  }
};

/**
 * Simulate periodic order status updates for demo/testing purposes
 * This is a fallback when real-time updates aren't available
 */
export const simulateOrderUpdates = (
  currentStatus: string,
  onUpdate: (updates: TrackingUpdate) => void
): (() => void) => {
  // Simulated progression of order statuses
  const statusProgression = [
    'pending',
    'confirmed', 
    'preparing', 
    'ready_for_pickup', 
    'out_for_delivery', 
    'delivered'
  ];
  
  // Find current index in progression
  let currentIndex = statusProgression.indexOf(currentStatus);
  if (currentIndex === -1) currentIndex = 0;
  
  // Don't start simulation if order is already delivered
  if (currentIndex >= statusProgression.length - 1) {
    return () => {}; // Return empty cleanup function
  }
  
  // Set random intervals for updates (between 10-30 seconds)
  const timers: number[] = [];
  
  for (let i = currentIndex + 1; i < statusProgression.length; i++) {
    const delay = (i - currentIndex) * (10000 + Math.random() * 20000);
    
    const timer = window.setTimeout(() => {
      const status = statusProgression[i];
      const update: TrackingUpdate = {
        id: `sim-${Date.now()}`,
        status: status as any,
        timestamp: new Date().toISOString(),
        description: getStatusDescription(status)
      };
      
      onUpdate(update);
      
      // Show a toast notification for the simulated update
      toast.info(`Order Status Update: ${update.description}`);
    }, delay);
    
    timers.push(timer);
  }
  
  // Return cleanup function to clear all timers
  return () => {
    timers.forEach(timer => clearTimeout(timer));
  };
};

/**
 * Fetch order by ID from Supabase with error handling
 */
export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Transform database record to Order object
    return {
      id: data.id,
      items: (data.items || []) as any[],
      restaurant: {
        id: data.restaurant_id,
        name: data.restaurant_name,
        image: data.restaurant_image || '',
        cuisine: '',
        rating: 0,
        deliveryTime: data.status === 'delivered' ? 'Delivered' : '30-45 minutes',
        deliveryFee: '0',
        minimumOrder: '0'
      },
      status: data.status || 'pending',
      deliveryAddress: {
        street: typeof data.delivery_address === 'object' ? data.delivery_address?.address || '' : '',
        city: typeof data.delivery_address === 'object' ? data.delivery_address?.city || '' : '',
        state: typeof data.delivery_address === 'object' ? data.delivery_address?.state || '' : '',
        zipCode: typeof data.delivery_address === 'object' ? data.delivery_address?.zip_code || '' : ''
      },
      paymentMethod: {
        id: 'card1',
        type: 'credit',
      },
      subtotal: data.subtotal || 0,
      deliveryFee: data.delivery_fee || 0,
      tax: data.tax || 0,
      total: data.total || 0,
      estimatedDeliveryTime: '30-45 minutes',
    } as Order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};
