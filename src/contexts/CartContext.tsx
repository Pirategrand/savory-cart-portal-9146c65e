
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(3.99);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // Load cart from localStorage on initial render with error handling
  useEffect(() => {
    const loadCart = () => {
      setIsCartLoading(true);
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          
          // Ensure we have valid cart items
          if (Array.isArray(parsedCart)) {
            // Validate each cart item to ensure it has required properties
            const validCartItems = parsedCart.filter(item => 
              item && 
              item.id && 
              item.foodItem && 
              typeof item.quantity === 'number'
            );
            
            setCartItems(validCartItems);
          }
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // If there's an error, start with an empty cart
        setCartItems([]);
      } finally {
        setIsCartLoading(false);
      }
    };
    
    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
      toast.error('Failed to save your cart', {
        description: 'Your cart items may not be saved when you refresh the page.'
      });
    }
  }, [cartItems]);

  // Cached calculation of cart totals
  const calculateTotals = useCallback(() => {
    try {
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
    } catch (error) {
      console.error('Error calculating cart totals:', error);
    }
  }, [cartItems, deliveryFee]);

  // Recalculate totals whenever cart changes
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const addToCart = useCallback((foodItem: FoodItem, quantity = 1, selectedOptions: any[] = []) => {
    try {
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
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    try {
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      toast('Item removed', {
        description: 'Item has been removed from your cart',
        className: 'bg-white dark:bg-gray-800'
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    try {
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
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error('Failed to update item quantity');
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    try {
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, []);

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
      total,
      isCartLoading
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
