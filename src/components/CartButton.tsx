
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartButton = () => {
  const { cartItems, subtotal } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevItemsCount, setPrevItemsCount] = useState(0);
  
  useEffect(() => {
    const currentCount = cartItems.length;
    if (currentCount > prevItemsCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setPrevItemsCount(currentCount);
  }, [cartItems, prevItemsCount]);
  
  if (cartItems.length === 0) return null;
  
  return (
    <Link
      to="/checkout"
      className={`fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
        isAnimating ? 'animate-bounce-in' : ''
      }`}
    >
      <div className="relative">
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-white text-blue-600 text-xs font-bold rounded-full">
          {cartItems.length}
        </span>
      </div>
      <span className="font-medium">
        ${subtotal.toFixed(2)}
      </span>
    </Link>
  );
};

export default CartButton;
