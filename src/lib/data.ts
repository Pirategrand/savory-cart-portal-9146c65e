
import { Restaurant, FoodItem } from './types';

// Restaurant data
export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Haven',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'American',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99',
    minimumOrder: '$10.00',
    dietaryOptions: ['non-vegetarian', 'gluten-free']
  },
  {
    id: 'r2',
    name: 'Pasta Paradise',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    deliveryFee: '$2.99',
    minimumOrder: '$15.00',
    dietaryOptions: ['vegetarian', 'non-vegetarian']
  },
  {
    id: 'r3',
    name: 'Sushi Supreme',
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: '$3.99',
    minimumOrder: '$20.00',
    dietaryOptions: ['vegetarian', 'non-vegetarian', 'gluten-free']
  },
  {
    id: 'r4',
    name: 'Taco Temple',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Mexican',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99',
    minimumOrder: '$10.00',
    dietaryOptions: ['vegetarian', 'vegan', 'non-vegetarian', 'keto']
  },
  {
    id: 'r5',
    name: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Italian',
    rating: 4.4,
    deliveryTime: '20-35 min',
    deliveryFee: '$2.49',
    minimumOrder: '$12.00',
    dietaryOptions: ['vegetarian', 'non-vegetarian']
  },
  {
    id: 'r6',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Asian Fusion',
    rating: 4.6,
    deliveryTime: '25-40 min',
    deliveryFee: '$2.99',
    minimumOrder: '$15.00',
    dietaryOptions: ['vegetarian', 'vegan', 'non-vegetarian', 'gluten-free']
  },
  {
    id: 'r7',
    name: 'Healthy Harvest',
    image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Health Food',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: '$3.49',
    minimumOrder: '$15.00',
    dietaryOptions: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'organic', 'low-sodium']
  },
  {
    id: 'r8',
    name: 'Carnivore Corner',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    cuisine: 'Steakhouse',
    rating: 4.7,
    deliveryTime: '25-40 min',
    deliveryFee: '$4.99',
    minimumOrder: '$20.00',
    dietaryOptions: ['non-vegetarian', 'keto']
  }
];

// Import food item data from a separate file
import { foodItems } from './foodData';
export { foodItems };

// Helper functions for data access
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const getFoodItemsByRestaurantId = (restaurantId: string): FoodItem[] => {
  return foodItems.filter(item => item.restaurantId === restaurantId);
};

export const getFoodItemById = (id: string): FoodItem | undefined => {
  return foodItems.find(item => item.id === id);
};

export const getPopularFoodItems = (): FoodItem[] => {
  return foodItems.filter(item => item.popular);
};
