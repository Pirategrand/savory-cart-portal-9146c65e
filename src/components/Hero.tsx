
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const parallaxFactor = 0.5;
      
      // Apply parallax effect to background
      heroRef.current.style.backgroundPositionY = `${scrollY * parallaxFactor}px`;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[35%] w-48 h-48 bg-blue-200/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block animate-fade-in px-4 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            Free delivery on your first order
          </div>
          <h1 className="animate-slide-up text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Delicious Food
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent"> Delivered</span> To Your Doorstep
          </h1>
          <p className="animate-slide-up animation-delay-200 text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Satisfy your cravings with a few taps. Order from your favorite local restaurants with fast delivery and exceptional service.
          </p>
          
          {/* Search Bar */}
          <div className="animate-slide-up animation-delay-300 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-12">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Enter your address or zip code" 
                className="pl-10 pr-4 py-6 w-full rounded-lg border border-border shadow-sm"
              />
            </div>
            <Link to="/restaurants">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Find Food
              </Button>
            </Link>
          </div>
          
          {/* Browse Categories */}
          <Link 
            to="/restaurants" 
            className="animate-slide-up animation-delay-400 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mt-6 group transition-all duration-300"
          >
            Browse all restaurants
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Decorative Image - Restaurant Dishes */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
