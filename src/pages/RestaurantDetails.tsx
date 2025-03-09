
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantById, getFoodItemsByRestaurantId } from '@/lib/data';
import Navbar from '@/components/Navbar';
import FoodItem from '@/components/FoodItem';
import CartButton from '@/components/CartButton';
import { Star, Clock, DollarSign, ArrowLeft } from 'lucide-react';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState(id ? getRestaurantById(id) : null);
  const [foodItems, setFoodItems] = useState(id ? getFoodItemsByRestaurantId(id) : []);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    if (id) {
      const restaurantData = getRestaurantById(id);
      const items = getFoodItemsByRestaurantId(id);
      
      setRestaurant(restaurantData);
      setFoodItems(items);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
      setCategories(uniqueCategories);
      
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerThreshold = 300; // Adjust this value as needed
      
      setIsHeaderVisible(scrollPosition > headerThreshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Restaurant not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[40vh] md:h-[50vh] w-full relative">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end z-20">
            <div className="container mx-auto px-4 pb-8 md:pb-16">
              <Link to="/" className="inline-flex items-center text-white mb-4 opacity-80 hover:opacity-100">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to restaurants
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                  {restaurant.rating}
                </span>
                <span>{restaurant.cuisine}</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {restaurant.deliveryFee} delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Header */}
      <div className={`sticky top-16 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-xl">{restaurant.name}</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                {restaurant.rating}
              </span>
              <span className="hidden md:inline-block">•</span>
              <span className="hidden md:flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {restaurant.deliveryTime}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors 
                  ${activeCategory === category 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        <div>
          {categories.map((category) => (
            <div 
              key={category} 
              className={`mb-12 ${activeCategory && activeCategory !== category ? 'hidden' : ''}`}
              id={category.toLowerCase().replace(' ', '-')}
            >
              <h3 className="text-2xl font-medium mb-6">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foodItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <FoodItem key={item.id} item={item} showDetails={true} />
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CartButton />
    </div>
  );
};

export default RestaurantDetails;
