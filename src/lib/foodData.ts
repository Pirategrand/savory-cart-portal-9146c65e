
import { FoodItem } from './types';

export const foodItems: FoodItem[] = [
  // Burger Haven menu items
  {
    id: 'f1',
    restaurantId: 'r1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 8.99,
    category: 'Burgers',
    popular: true,
    options: [
      {
        name: 'Size',
        required: true,
        choices: [
          { id: 's1', name: 'Regular', price: 0 },
          { id: 's2', name: 'Double Patty', price: 3.5 }
        ]
      },
      {
        name: 'Add-ons',
        required: false,
        choices: [
          { id: 'a1', name: 'Bacon', price: 1.5 },
          { id: 'a2', name: 'Avocado', price: 2 },
          { id: 'a3', name: 'Extra Cheese', price: 1 }
        ]
      }
    ]
  },
  {
    id: 'f2',
    restaurantId: 'r1',
    name: 'Crispy Chicken Sandwich',
    description: 'Crispy fried chicken breast with lettuce, pickles, and mayo on a toasted bun',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 7.99,
    category: 'Sandwiches'
  },
  {
    id: 'f3',
    restaurantId: 'r1',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese sauce, bacon bits, and green onions',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 5.99,
    category: 'Sides',
    popular: true
  },
  
  // Pasta Paradise menu items
  {
    id: 'f4',
    restaurantId: 'r2',
    name: 'Spaghetti Carbonara',
    description: 'Classic carbonara with pancetta, egg, parmesan, and black pepper',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 12.99,
    category: 'Pasta',
    popular: true
  },
  {
    id: 'f5',
    restaurantId: 'r2',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, fresh mozzarella, and basil',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 10.99,
    category: 'Pizza'
  },
  {
    id: 'f6',
    restaurantId: 'r2',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 6.99,
    category: 'Desserts'
  },
  
  // Sushi Supreme menu items
  {
    id: 'f7',
    restaurantId: 'r3',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber roll with toasted sesame seeds',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 8.99,
    category: 'Rolls',
    popular: true
  },
  {
    id: 'f8',
    restaurantId: 'r3',
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over pressed vinegared rice',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 9.99,
    category: 'Nigiri'
  },
  {
    id: 'f9',
    restaurantId: 'r3',
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu, seaweed, and green onions',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 3.99,
    category: 'Appetizers'
  },
  
  // Add more food items for other restaurants...
  {
    id: 'f10',
    restaurantId: 'r4',
    name: 'Street Tacos',
    description: 'Three corn tortillas with your choice of meat, onions, cilantro, and salsa',
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 9.99,
    category: 'Tacos',
    popular: true
  },
  {
    id: 'f11',
    restaurantId: 'r5',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza with mozzarella and tomato sauce',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 14.99,
    category: 'Pizza',
    popular: true
  },
  {
    id: 'f12',
    restaurantId: 'r6',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 11.99,
    category: 'Noodles',
    popular: true
  }
];

export const getFoodOptions = () => [
  {
    name: "Spice Level",
    required: true,
    choices: [
      { id: "mild", name: "Mild", price: 0 },
      { id: "medium", name: "Medium", price: 0 },
      { id: "spicy", name: "Spicy", price: 0 },
      { id: "extra-spicy", name: "Extra Spicy", price: 0.50 }
    ]
  },
  {
    name: "Add-ons",
    required: false,
    choices: [
      { id: "extra-cheese", name: "Extra Cheese", price: 1.50 },
      { id: "bacon", name: "Bacon", price: 2.00 },
      { id: "avocado", name: "Avocado", price: 1.50 },
      { id: "gluten-free", name: "Gluten-Free Option", price: 2.50 }
    ]
  }
];
