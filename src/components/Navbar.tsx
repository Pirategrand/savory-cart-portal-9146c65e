
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  
  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">Savour</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-orange-500 ${
                isActive('/') ? 'text-orange-500' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`font-medium transition-colors hover:text-orange-500 ${
                isActive('/restaurants') ? 'text-orange-500' : ''
              }`}
            >
              Restaurants
            </Link>
            <Link 
              to="/orders" 
              className={`font-medium transition-colors hover:text-orange-500 ${
                isActive('/orders') ? 'text-orange-500' : ''
              }`}
            >
              Orders
            </Link>
          </div>
          
          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/checkout" className="relative">
              <ShoppingCart className={`h-6 w-6 transition-colors ${cartItems.length > 0 ? 'text-orange-500' : ''}`} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            <div className="flex items-center justify-center bg-purple-500 text-white rounded-full h-8 w-8">
              <span className="text-sm font-medium">AN</span>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/" 
              className={`block font-medium py-2 ${
                isActive('/') ? 'text-orange-500' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/restaurants" 
              className={`block font-medium py-2 ${
                isActive('/restaurants') ? 'text-orange-500' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Restaurants
            </Link>
            <Link 
              to="/orders" 
              className={`block font-medium py-2 ${
                isActive('/orders') ? 'text-orange-500' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Orders
            </Link>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/checkout" 
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({cartItems.length})</span>
              </Link>
              
              <div className="flex items-center justify-center bg-purple-500 text-white rounded-full h-8 w-8">
                <span className="text-sm font-medium">AN</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
