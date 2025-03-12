
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '@/lib/types';
import { restaurants } from '@/lib/data';
import { Star, Clock, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <Link 
      to={`/restaurant/${restaurant.id}`}
      className="group"
    >
      <div className="glass-card rounded-xl overflow-hidden card-hover h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{restaurant.name}</h3>
            <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-3">{restaurant.cuisine}</p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {restaurant.deliveryTime}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {restaurant.deliveryFee}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const RestaurantList = () => {
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollAmount = direction === 'left' ? -400 : 400;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    setScrollX(container.scrollLeft);
    
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium mb-2">Popular Restaurants</h2>
            <p className="text-muted-foreground">Discover the most loved restaurants in your area</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full subtle-shadow ${
                canScrollLeft 
                  ? 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full subtle-shadow ${
                canScrollRight 
                  ? 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              } transition-all duration-200`}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div 
          ref={containerRef}
          className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="flex-shrink-0 w-full sm:w-[340px]">
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/restaurants" 
            className="inline-block px-6 py-3 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 transition-colors duration-300"
          >
            View All Restaurants
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RestaurantList;
