
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
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 550,
      protein: 25,
      carbs: 45,
      fat: 28,
      fiber: 3
    },
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
    category: 'Sandwiches',
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 480,
      protein: 28,
      carbs: 42,
      fat: 22,
      fiber: 2
    }
  },
  {
    id: 'f3',
    restaurantId: 'r1',
    name: 'Loaded Fries',
    description: 'Crispy fries topped with cheese sauce, bacon bits, and green onions',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 5.99,
    category: 'Sides',
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 450,
      protein: 12,
      carbs: 48,
      fat: 25,
      fiber: 4
    }
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
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 680,
      protein: 24,
      carbs: 80,
      fat: 30,
      fiber: 3
    }
  },
  {
    id: 'f5',
    restaurantId: 'r2',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, fresh mozzarella, and basil',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 10.99,
    category: 'Pizza',
    dietaryType: 'vegetarian',
    nutritionalInfo: {
      calories: 580,
      protein: 22,
      carbs: 74,
      fat: 24,
      fiber: 3
    }
  },
  {
    id: 'f6',
    restaurantId: 'r2',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 6.99,
    category: 'Desserts',
    dietaryType: 'vegetarian',
    nutritionalInfo: {
      calories: 350,
      protein: 7,
      carbs: 40,
      fat: 18,
      fiber: 1
    }
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
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 320,
      protein: 10,
      carbs: 50,
      fat: 11,
      fiber: 2
    }
  },
  {
    id: 'f8',
    restaurantId: 'r3',
    name: 'Salmon Nigiri',
    description: 'Fresh salmon over pressed vinegared rice',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 9.99,
    category: 'Nigiri',
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 280,
      protein: 15,
      carbs: 38,
      fat: 8,
      fiber: 0
    }
  },
  {
    id: 'f9',
    restaurantId: 'r3',
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu, seaweed, and green onions',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88110?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 3.99,
    category: 'Appetizers',
    dietaryType: 'vegetarian',
    nutritionalInfo: {
      calories: 110,
      protein: 6,
      carbs: 12,
      fat: 3,
      fiber: 2
    }
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
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 480,
      protein: 28,
      carbs: 45,
      fat: 22,
      fiber: 6
    }
  },
  {
    id: 'f11',
    restaurantId: 'r5',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni pizza with mozzarella and tomato sauce',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 14.99,
    category: 'Pizza',
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 720,
      protein: 30,
      carbs: 85,
      fat: 36,
      fiber: 4
    }
  },
  {
    id: 'f12',
    restaurantId: 'r6',
    name: 'Pad Thai',
    description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts, and peanuts',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 11.99,
    category: 'Noodles',
    popular: true,
    dietaryType: 'vegetarian',
    nutritionalInfo: {
      calories: 550,
      protein: 18,
      carbs: 78,
      fat: 20,
      fiber: 5
    }
  },
  // Add some vegan options
  {
    id: 'f13',
    restaurantId: 'r2',
    name: 'Vegan Pesto Pasta',
    description: 'Fresh pasta with basil pesto, cherry tomatoes, and pine nuts',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 13.99,
    category: 'Pasta',
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 520,
      protein: 15,
      carbs: 70,
      fat: 22,
      fiber: 8
    }
  },
  {
    id: 'f14',
    restaurantId: 'r4',
    name: 'Veggie Fajitas',
    description: 'Sizzling plate of bell peppers, onions, and mushrooms with warm tortillas',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 10.99,
    category: 'Main Courses',
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 380,
      protein: 10,
      carbs: 65,
      fat: 8,
      fiber: 12
    }
  },
  {
    id: 'f15',
    restaurantId: 'r6',
    name: 'Vegetarian Spring Rolls',
    description: 'Fresh rice paper rolls with vegetables and tofu, served with peanut sauce',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 7.99,
    category: 'Appetizers',
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 220,
      protein: 8,
      carbs: 40,
      fat: 5,
      fiber: 6
    }
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
