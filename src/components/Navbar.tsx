
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Search, Menu, X, Home } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80">
            <span className="font-bold text-xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              FoodDelivery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/restaurants" className="text-foreground/80 hover:text-foreground transition-colors">
              Restaurants
            </Link>
            <Link to="/checkout" className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground/80 hover:text-foreground transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full animate-bounce-in">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/checkout" className="relative mr-6">
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-orange-500 text-white text-xs rounded-full animate-bounce-in">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 inset-x-0 transition-all duration-300 ease-in-out transform ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        } bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg`}
      >
        <div className="container mx-auto px-4 py-2">
          <nav className="flex flex-col py-4 space-y-4">
            <Link to="/" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/restaurants" className="px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Restaurants
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
