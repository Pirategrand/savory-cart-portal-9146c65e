
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  minimumOrder: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
  popular?: boolean;
  options?: Array<{
    name: string;
    required: boolean;
    choices: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }>;
  restaurant?: {
    name: string;
    image: string;
  }
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  selectedOptions?: {
    optionName: string;
    choice: {
      id: string;
      name: string;
      price: number;
    };
  }[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  last4?: string;
  expiryDate?: string;
  name?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  restaurant: Restaurant;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  estimatedDeliveryTime: string;
  deliveryPartner?: DeliveryPartner;
  trackingUpdates?: TrackingUpdate[];
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    first_name: string | null;
    last_name: string | null;
  };
  helpful_count?: number;
  is_helpful?: boolean;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  deliveries_completed: number;
}

export interface TrackingUpdate {
  id: string;
  status: 'order_received' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered';
  timestamp: string;
  description: string;
}
