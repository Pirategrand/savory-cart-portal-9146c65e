
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FoodItem, Order } from './types';
import { withErrorHandling } from './supabaseHelpers';

// Sample data for demo purposes
const demoMenuItems: FoodItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=3540&auto=format&fit=crop',
    category: 'Pizza',
    restaurantId: 'rest1',
    popular: true
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=3540&auto=format&fit=crop',
    category: 'Pizza',
    restaurantId: 'rest1'
  },
  {
    id: '3',
    name: 'Greek Salad',
    description: 'Fresh salad with tomatoes, cucumbers, olives, and feta cheese',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=3540&auto=format&fit=crop',
    category: 'Salads',
    restaurantId: 'rest1'
  }
];

// Demo orders for the restaurant
const demoOrders: Order[] = [
  {
    id: 'order1',
    items: [
      {
        id: 'item1',
        foodItem: demoMenuItems[0],
        quantity: 2
      },
      {
        id: 'item2',
        foodItem: demoMenuItems[2],
        quantity: 1
      }
    ],
    restaurant: {
      id: 'rest1',
      name: 'John\'s Pizza',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3774&auto=format&fit=crop',
      cuisine: 'Italian',
      rating: 4.7,
      deliveryTime: '30-45 min',
      deliveryFee: '$2.99',
      minimumOrder: '$10'
    },
    status: 'confirmed',
    deliveryAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    paymentMethod: {
      id: 'card1',
      type: 'credit'
    },
    subtotal: 34.97,
    deliveryFee: 2.99,
    tax: 3.50,
    total: 41.46,
    estimatedDeliveryTime: '30-45 min'
  },
  {
    id: 'order2',
    items: [
      {
        id: 'item3',
        foodItem: demoMenuItems[1],
        quantity: 1
      }
    ],
    restaurant: {
      id: 'rest1',
      name: 'John\'s Pizza',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3774&auto=format&fit=crop',
      cuisine: 'Italian',
      rating: 4.7,
      deliveryTime: '30-45 min',
      deliveryFee: '$2.99',
      minimumOrder: '$10'
    },
    status: 'pending',
    deliveryAddress: {
      street: '456 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10002'
    },
    paymentMethod: {
      id: 'card2',
      type: 'credit'
    },
    subtotal: 14.99,
    deliveryFee: 2.99,
    tax: 1.50,
    total: 19.48,
    estimatedDeliveryTime: '30-45 min'
  }
];

/**
 * Fetch menu items for a restaurant
 */
export const fetchRestaurantMenuItems = async (restaurantId: string): Promise<FoodItem[]> => {
  // In a real implementation, we would fetch from Supabase
  // return withErrorHandling(async () => {
  //   const { data, error } = await supabase
  //     .from('food_items')
  //     .select('*')
  //     .eq('restaurant_id', restaurantId);
  //     
  //   if (error) throw error;
  //   return data as FoodItem[];
  // }, 'Failed to fetch menu items');

  // For demo purposes, return demo data
  return Promise.resolve(demoMenuItems);
};

/**
 * Add a new menu item
 */
export const addMenuItem = async (item: Omit<FoodItem, 'id'>): Promise<FoodItem | null> => {
  try {
    // In a real implementation, we would add to Supabase
    // const { data, error } = await supabase
    //   .from('food_items')
    //   .insert(item)
    //   .select()
    //   .single();
    //
    // if (error) throw error;
    // return data as FoodItem;

    // For demo purposes, create a new item with a random ID
    const newItem: FoodItem = {
      ...item,
      id: `item-${Math.floor(Math.random() * 1000)}`
    };
    
    // Add to our demo items
    demoMenuItems.push(newItem);
    
    toast.success('Menu item added successfully');
    return newItem;
  } catch (error) {
    console.error('Error adding menu item:', error);
    toast.error('Failed to add menu item');
    return null;
  }
};

/**
 * Update an existing menu item
 */
export const updateMenuItem = async (id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> => {
  try {
    // In a real implementation, we would update in Supabase
    // const { data, error } = await supabase
    //   .from('food_items')
    //   .update(updates)
    //   .eq('id', id)
    //   .select()
    //   .single();
    //
    // if (error) throw error;
    // return data as FoodItem;

    // For demo purposes, update the item in our demo data
    const itemIndex = demoMenuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      toast.error('Menu item not found');
      return null;
    }
    
    const updatedItem = { ...demoMenuItems[itemIndex], ...updates };
    demoMenuItems[itemIndex] = updatedItem;
    
    toast.success('Menu item updated successfully');
    return updatedItem;
  } catch (error) {
    console.error('Error updating menu item:', error);
    toast.error('Failed to update menu item');
    return null;
  }
};

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, we would delete from Supabase
    // const { error } = await supabase
    //   .from('food_items')
    //   .delete()
    //   .eq('id', id);
    //
    // if (error) throw error;

    // For demo purposes, remove from our demo data
    const itemIndex = demoMenuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      toast.error('Menu item not found');
      return false;
    }
    
    demoMenuItems.splice(itemIndex, 1);
    
    toast.success('Menu item deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    toast.error('Failed to delete menu item');
    return false;
  }
};

/**
 * Fetch orders for a restaurant
 */
export const fetchRestaurantOrders = async (restaurantId: string): Promise<Order[]> => {
  // In a real implementation, we would fetch from Supabase
  // return withErrorHandling(async () => {
  //   const { data, error } = await supabase
  //     .from('orders')
  //     .select('*')
  //     .eq('restaurant_id', restaurantId)
  //     .order('created_at', { ascending: false });
  //     
  //   if (error) throw error;
  //   return data as Order[];
  // }, 'Failed to fetch orders');

  // For demo purposes, return demo data
  return Promise.resolve(demoOrders);
};

/**
 * Update an order status
 */
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order | null> => {
  try {
    // In a real implementation, we would update in Supabase
    // const { data, error } = await supabase
    //   .from('orders')
    //   .update({ status })
    //   .eq('id', orderId)
    //   .select()
    //   .single();
    //
    // if (error) throw error;
    // return data as Order;

    // For demo purposes, update the order in our demo data
    const orderIndex = demoOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      toast.error('Order not found');
      return null;
    }
    
    const updatedOrder = { ...demoOrders[orderIndex], status };
    demoOrders[orderIndex] = updatedOrder;
    
    toast.success(`Order status updated to: ${status}`);
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return null;
  }
};

/**
 * Subscribe to real-time order updates
 */
export const subscribeToRestaurantOrders = (
  restaurantId: string,
  onUpdate: (order: Order) => void
) => {
  // In a real implementation, we would use Supabase realtime
  // const channel = supabase
  //   .channel(`restaurant-${restaurantId}`)
  //   .on(
  //     'postgres_changes',
  //     {
  //       event: '*',
  //       schema: 'public',
  //       table: 'orders',
  //       filter: `restaurant_id=eq.${restaurantId}`
  //     },
  //     (payload) => {
  //       console.log('Order update received:', payload);
  //       // Fetch the full order details
  //       fetchOrderById(payload.new.id).then(order => {
  //         if (order) onUpdate(order);
  //       });
  //     }
  //   )
  //   .subscribe();
  
  // For demo purposes, simulate periodic updates
  const timerId = setInterval(() => {
    // Simulate a new order coming in every 30 seconds
    if (Math.random() > 0.7) {
      const newOrderId = `order-${Math.floor(Math.random() * 1000)}`;
      const newOrder: Order = {
        id: newOrderId,
        items: [
          {
            id: `item-${Math.floor(Math.random() * 1000)}`,
            foodItem: demoMenuItems[Math.floor(Math.random() * demoMenuItems.length)],
            quantity: Math.floor(Math.random() * 3) + 1
          }
        ],
        restaurant: {
          id: restaurantId,
          name: 'John\'s Pizza',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3774&auto=format&fit=crop',
          cuisine: 'Italian',
          rating: 4.7,
          deliveryTime: '30-45 min',
          deliveryFee: '$2.99',
          minimumOrder: '$10'
        },
        status: 'pending',
        deliveryAddress: {
          street: `${Math.floor(Math.random() * 999) + 100} Main St`,
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        paymentMethod: {
          id: 'card1',
          type: 'credit'
        },
        subtotal: parseFloat((Math.random() * 30 + 10).toFixed(2)),
        deliveryFee: 2.99,
        tax: parseFloat((Math.random() * 5).toFixed(2)),
        total: parseFloat((Math.random() * 50 + 15).toFixed(2)),
        estimatedDeliveryTime: '30-45 min'
      };
      
      demoOrders.unshift(newOrder);
      onUpdate(newOrder);
      toast.info('New order received!');
    }
  }, 30000);
  
  // Return cleanup function
  return () => {
    clearInterval(timerId);
    // In a real implementation: supabase.removeChannel(channel);
  };
};
