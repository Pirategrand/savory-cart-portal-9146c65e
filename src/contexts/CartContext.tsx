
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem } from '@/lib/types';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (foodItem: FoodItem, quantity?: number, selectedOptions?: any[]) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(3.99);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Recalculate totals whenever cart changes
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => {
      const itemPrice = item.foodItem.price;
      let optionsPrice = 0;
      
      if (item.selectedOptions) {
        optionsPrice = item.selectedOptions.reduce(
          (sum, option) => sum + option.choice.price, 0
        );
      }
      
      return sum + (itemPrice + optionsPrice) * item.quantity;
    }, 0);
    
    const newTax = newSubtotal * 0.08; // 8% tax
    const newTotal = newSubtotal + deliveryFee + newTax;
    
    setSubtotal(Number(newSubtotal.toFixed(2)));
    setTax(Number(newTax.toFixed(2)));
    setTotal(Number(newTotal.toFixed(2)));
  }, [cartItems, deliveryFee]);

  const addToCart = (foodItem: FoodItem, quantity = 1, selectedOptions: any[] = []) => {
    const newItem: CartItem = {
      id: `${foodItem.id}_${Date.now()}`,
      foodItem,
      quantity,
      selectedOptions
    };
    
    setCartItems(prevItems => [...prevItems, newItem]);
    toast(`${foodItem.name} added to cart!`, {
      description: `${quantity} item${quantity > 1 ? 's' : ''} added`,
      className: 'bg-white dark:bg-gray-800'
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    toast('Item removed', {
      description: 'Item has been removed from your cart',
      className: 'bg-white dark:bg-gray-800'
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      deliveryFee,
      tax,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
