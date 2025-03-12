
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[10%] right-[5%] w-72 h-72 bg-orange-400/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-orange-300/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[35%] w-48 h-48 bg-orange-200/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <div className="inline-block animate-fade-in px-4 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              Free delivery on your first order
            </div>
            <h1 className="animate-slide-up text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              The Fastest
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Food Delivery</span> Service
            </h1>
            <p className="animate-slide-up animation-delay-200 text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Order your favorite meals from the best restaurants in town and get them delivered to your doorstep in minutes.
            </p>
            
            {/* Search Bar */}
            <div className="animate-slide-up animation-delay-300 flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Enter your address" 
                  className="pl-10 pr-4 py-6 w-full rounded-lg border border-border shadow-sm"
                />
              </div>
              <Link to="/restaurants">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Find Food
                </Button>
              </Link>
            </div>
            
            {/* Browse Categories */}
            <Link 
              to="/restaurants" 
              className="animate-slide-up animation-delay-400 inline-flex items-center text-orange-600 dark:text-orange-400 hover:underline group transition-all duration-300"
            >
              View all restaurants
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Hero Image */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Delicious Food" 
                className="w-full h-full object-cover rounded-full shadow-2xl animate-float"
                style={{ animationDuration: '6s' }}
              />
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-slide-up animation-delay-500 w-32">
                <div className="text-sm font-medium">Delivery Time</div>
                <div className="text-xl font-bold text-orange-600">25 min</div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 animate-slide-up animation-delay-600 w-32">
                <div className="text-sm font-medium">Free Delivery</div>
                <div className="text-xl font-bold text-orange-600">$0.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
