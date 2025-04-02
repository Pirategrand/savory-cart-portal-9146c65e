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
      calories: 650,
      protein: 35,
      carbs: 40,
      fat: 35
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
      calories: 550,
      protein: 28,
      carbs: 48,
      fat: 26
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
      calories: 480,
      protein: 12,
      carbs: 56,
      fat: 24
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
      calories: 720,
      protein: 26,
      carbs: 68,
      fat: 32
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
      carbs: 64,
      fat: 26,
      fiber: 4
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
      calories: 420,
      protein: 6,
      carbs: 45,
      fat: 22
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
      calories: 350,
      protein: 9,
      carbs: 38,
      fat: 19
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
      protein: 11,
      carbs: 36,
      fat: 8
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
      calories: 120,
      protein: 6,
      carbs: 12,
      fat: 4,
      fiber: 2
    }
  },
  
  // Additional restaurant items
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
      protein: 24,
      carbs: 45,
      fat: 18
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
      protein: 28,
      carbs: 72,
      fat: 36
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
      calories: 520,
      protein: 16,
      carbs: 64,
      fat: 18,
      fiber: 3
    }
  },
  
  // Additional dietary-specific items
  {
    id: 'f13',
    restaurantId: 'r7',
    name: 'Buddha Bowl',
    description: 'Quinoa, roasted sweet potatoes, chickpeas, avocado, and tahini dressing',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 13.99,
    category: 'Bowls',
    popular: true,
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 520,
      protein: 15,
      carbs: 68,
      fat: 22,
      fiber: 12
    }
  },
  {
    id: 'f14',
    restaurantId: 'r7',
    name: 'Green Goddess Salad',
    description: 'Mixed greens, avocado, cucumber, broccoli, and hemp seeds with green goddess dressing',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 10.99,
    category: 'Salads',
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 320,
      protein: 8,
      carbs: 22,
      fat: 24,
      fiber: 8
    }
  },
  {
    id: 'f15',
    restaurantId: 'r8',
    name: 'Ribeye Steak',
    description: '12oz ribeye steak, perfectly marbled and grilled to your preference',
    image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb908c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 29.99,
    category: 'Steaks',
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 720,
      protein: 58,
      carbs: 0,
      fat: 54
    }
  },
  {
    id: 'f16',
    restaurantId: 'r4',
    name: 'Veggie Fajitas',
    description: 'Sizzling platter of bell peppers, onions, zucchini, and portobello mushrooms',
    image: 'https://images.unsplash.com/photo-1600891965050-f0c1c0483e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 14.99,
    category: 'Main Dishes',
    dietaryType: 'vegan',
    nutritionalInfo: {
      calories: 380,
      protein: 9,
      carbs: 48,
      fat: 18,
      fiber: 9
    }
  },

  // New non-vegetarian food items
  {
    id: 'f17',
    restaurantId: 'r9',
    name: 'BBQ Ribs Platter',
    description: 'Slow-cooked pork ribs with our signature BBQ sauce, served with coleslaw and fries',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 19.99,
    category: 'BBQ',
    popular: true,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 850,
      protein: 48,
      carbs: 52,
      fat: 46
    }
  },
  {
    id: 'f18',
    restaurantId: 'r9',
    name: 'Pulled Pork Sandwich',
    description: 'Tender pulled pork with BBQ sauce on a brioche bun, served with pickles',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 12.99,
    category: 'Sandwiches',
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 720,
      protein: 38,
      carbs: 56,
      fat: 32
    }
  },
  {
    id: 'f19',
    restaurantId: 'r9',
    name: 'Brisket Plate',
    description: 'Smoked beef brisket with two sides of your choice and cornbread',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 17.99,
    category: 'BBQ',
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 780,
      protein: 52,
      carbs: 48,
      fat: 38
    }
  },

  // Seafood items
  {
    id: 'f20',
    restaurantId: 'r10',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection with lemon butter sauce',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 16.99,
    category: 'Seafood',
    popular: true,
    dietaryType: 'seafood',
    nutritionalInfo: {
      calories: 420,
      protein: 46,
      carbs: 2,
      fat: 28
    }
  },
  {
    id: 'f21',
    restaurantId: 'r10',
    name: 'Shrimp Scampi',
    description: 'Garlic butter shrimp served over linguine pasta with white wine sauce',
    image: 'https://images.unsplash.com/photo-1633896949673-1eb9d131a9b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 18.99,
    category: 'Seafood',
    dietaryType: 'seafood',
    nutritionalInfo: {
      calories: 580,
      protein: 32,
      carbs: 48,
      fat: 28
    }
  },
  {
    id: 'f22',
    restaurantId: 'r10',
    name: 'Lobster Roll',
    description: 'Chunky lobster meat tossed in light mayo on a buttery toasted roll',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 24.99,
    category: 'Sandwiches',
    popular: true,
    dietaryType: 'seafood',
    nutritionalInfo: {
      calories: 520,
      protein: 28,
      carbs: 38,
      fat: 24
    }
  },
  {
    id: 'f23',
    restaurantId: 'r10',
    name: 'Seafood Paella',
    description: 'Spanish rice dish with mussels, clams, shrimp, and fish in saffron broth',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    price: 22.99,
    category: 'Spanish',
    dietaryType: 'seafood',
    nutritionalInfo: {
      calories: 680,
      protein: 38,
      carbs: 64,
      fat: 26,
      fiber: 4
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
