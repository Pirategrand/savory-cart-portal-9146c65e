
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center bg-orange-50/30 dark:bg-orange-900/5 overflow-hidden pt-16">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left mb-10 md:mb-0">
            <div className="inline-block px-4 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
              Now serving in your area
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Delicious food,<br />
              delivered to<br />
              your doorstep
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Discover local restaurants, order your favorite dishes, and enjoy fast delivery right to your door.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search for restaurants or cuisines" 
                  className="pl-10 pr-4 py-6 w-full rounded-lg border border-border shadow-sm"
                />
              </div>
              <div className="relative">
                <Button 
                  variant="outline"
                  className="py-6 px-4 w-full flex items-center justify-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Current Location</span>
                </Button>
              </div>
              <Link to="/restaurants">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white py-6 px-8 rounded-lg"
                >
                  Search
                </Button>
              </Link>
            </div>
            
            <div className="flex gap-4">
              <Link 
                to="/restaurants" 
                className="py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Explore Restaurants
              </Link>
              <Link
                to="#"
                className="py-3 px-6 border border-gray-300 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Partner with Us
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full">
              <img 
                src="public/lovable-uploads/2482804e-12df-4f10-bd86-7cdcc030098f.png" 
                alt="Delicious burger" 
                className="w-full rounded-lg shadow-xl"
              />
              
              {/* Stats Card */}
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-xl p-4 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="text-orange-500 font-bold">30</span>
                    </div>
                    <div>
                      <p className="font-medium">Fast Delivery</p>
                      <p className="text-xs text-muted-foreground">Average delivery time: 30 minutes</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="text-sm font-medium">Restaurants</p>
                        <p className="text-xl font-bold">500+</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Cities</p>
                        <p className="text-xl font-bold">20+</p>
                      </div>
                    </div>
                  </div>
                </div>
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
