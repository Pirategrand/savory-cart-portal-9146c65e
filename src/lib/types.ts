
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
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  popular?: boolean;
  options?: {
    name: string;
    choices: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
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
}
