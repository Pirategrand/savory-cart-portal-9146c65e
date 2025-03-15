
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CartItem, FoodItem } from '@/lib/types';
import { toast } from 'sonner';
import { isOnline } from '@/lib/supabaseHelpers';

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

const CART_STORAGE_KEY = 'food-delivery-cart';
const DELIVERY_FEE_STORAGE_KEY = 'food-delivery-fee';
const MAX_LOADING_TIME = 2000; // 2 second safety timeout

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(3.99);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Load cart from localStorage on initial render with error handling
  useEffect(() => {
    const loadCart = () => {
      setIsCartLoading(true);
      try {
        // Load cart items
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          
          // Ensure we have valid cart items
          if (Array.isArray(parsedCart)) {
            // Validate each cart item to ensure it has required properties
            const validCartItems = parsedCart.filter(item => 
              item && 
              item.id && 
              item.foodItem && 
              typeof item.quantity === 'number' &&
              item.foodItem.price
            );
            
            setCartItems(validCartItems);
          }
        }
        
        // Load delivery fee (may be customized in some cases)
        const savedDeliveryFee = localStorage.getItem(DELIVERY_FEE_STORAGE_KEY);
        if (savedDeliveryFee) {
          const parsedFee = parseFloat(savedDeliveryFee);
          if (!isNaN(parsedFee) && parsedFee >= 0) {
            setDeliveryFee(parsedFee);
          }
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        // If there's an error, start with an empty cart
        setCartItems([]);
      } finally {
        // Add a small delay when setting loading state to false to ensure proper state updates
        setTimeout(() => {
          setIsCartLoading(false);
        }, 100);
      }
    };
    
    loadCart();
    
    // Set up a periodic check for cart expiration (24 hours)
    const checkCartExpiration = () => {
      try {
        const cartTimestamp = localStorage.getItem('cart-timestamp');
        if (cartTimestamp) {
          const timestamp = parseInt(cartTimestamp, 10);
          const now = Date.now();
          
          // If cart is older than 24 hours (86400000 ms), clear it
          if (now - timestamp > 86400000) {
            localStorage.removeItem(CART_STORAGE_KEY);
            localStorage.removeItem('cart-timestamp');
            setCartItems([]);
            toast('Cart has been cleared', { 
              description: 'Your saved cart was older than 24 hours'
            });
          }
        }
      } catch (error) {
        console.error('Error checking cart expiration:', error);
      }
    };
    
    checkCartExpiration();
    
    // Add a maximum timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      if (isCartLoading) {
        setIsCartLoading(false);
        console.warn('Cart loading state was forcibly cleared after safety timeout');
      }
    }, MAX_LOADING_TIME); // 2 second max loading time
    
    return () => clearTimeout(loadingTimeout);
  }, []);

  // Save cart to localStorage whenever it changes with error handling
  useEffect(() => {
    // Don't try to save the cart while it's still loading
    if (isCartLoading) return;
    
    if (cartItems.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        localStorage.setItem('cart-timestamp', Date.now().toString());
        setLastUpdateTime(Date.now());
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
        toast.error('Failed to save your cart', {
          description: 'Your cart items may not be saved when you refresh the page.'
        });
      }
    } else if (cartItems.length === 0 && lastUpdateTime > 0) {
      // Cart was cleared, remove from storage
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        localStorage.removeItem('cart-timestamp');
      } catch (error) {
        console.error('Failed to remove cart from localStorage:', error);
      }
    }
  }, [cartItems, lastUpdateTime, isCartLoading]);

  // Save delivery fee to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(DELIVERY_FEE_STORAGE_KEY, deliveryFee.toString());
    } catch (error) {
      console.error('Failed to save delivery fee to localStorage:', error);
    }
  }, [deliveryFee]);

  // Cached calculation of cart totals
  const calculateTotals = useCallback(() => {
    try {
      const newSubtotal = cartItems.reduce((sum, item) => {
        const itemPrice = item.foodItem.price || 0;
        let optionsPrice = 0;
        
        if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
          optionsPrice = item.selectedOptions.reduce(
            (sum, option) => {
              if (option && option.choice && typeof option.choice.price === 'number') {
                return sum + option.choice.price;
              }
              return sum;
            }, 0
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
      if (!foodItem || !foodItem.name || typeof foodItem.price !== 'number') {
        console.error('Invalid food item:', foodItem);
        toast.error('Could not add item to cart', {
          description: 'The item information is incomplete.'
        });
        return;
      }
      
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
      
      // Update timestamp when cart changes
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    try {
      setCartItems(prevItems => {
        const itemToRemove = prevItems.find(item => item.id === cartItemId);
        const newItems = prevItems.filter(item => item.id !== cartItemId);
        
        if (itemToRemove) {
          toast('Item removed', {
            description: `${itemToRemove.foodItem.name} has been removed from your cart`,
            className: 'bg-white dark:bg-gray-800'
          });
        }
        
        return newItems;
      });
      
      // Update timestamp when cart changes
      setLastUpdateTime(Date.now());
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
      
      // Update timestamp when cart changes
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error('Failed to update item quantity');
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    try {
      setCartItems([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem('cart-timestamp');
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, []);

  // Create a stable context value with useMemo
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <CartContext.Provider value={contextValue}>
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
