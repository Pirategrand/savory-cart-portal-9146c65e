
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantById, getFoodItemsByRestaurantId } from '@/lib/data';
import Navbar from '@/components/Navbar';
import FoodItem from '@/components/FoodItem';
import CartButton from '@/components/CartButton';
import { Star, Clock, DollarSign, ArrowLeft, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewList from '@/components/reviews/ReviewList';
import { useDietary } from '@/contexts/DietaryContext';
import { Badge } from '@/components/ui/badge';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState(id ? getRestaurantById(id) : null);
  const [foodItems, setFoodItems] = useState(id ? getFoodItemsByRestaurantId(id) : []);
  const [filteredItems, setFilteredItems] = useState(foodItems);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const { preferences } = useDietary();
  
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

  // Apply dietary filters whenever the preferences or food items change
  useEffect(() => {
    let filtered = [...foodItems];
    
    // Apply dietary mode filter
    if (preferences.dietaryMode !== 'all') {
      filtered = filtered.filter(item => {
        if (preferences.dietaryMode === 'vegetarian') {
          return item.dietaryType === 'vegetarian' || item.dietaryType === 'vegan';
        } else if (preferences.dietaryMode === 'vegan') {
          return item.dietaryType === 'vegan';
        } else if (preferences.dietaryMode === 'non-vegetarian') {
          return item.dietaryType === 'non-vegetarian';
        }
        return true;
      });
    }
    
    // Apply calorie range filter
    if (preferences.calorieRange[0] > 0 || preferences.calorieRange[1] < 1000) {
      filtered = filtered.filter(item => 
        item.nutritionalInfo && 
        item.nutritionalInfo.calories >= preferences.calorieRange[0] && 
        item.nutritionalInfo.calories <= preferences.calorieRange[1]
      );
    }
    
    // Apply healthy only filter
    if (preferences.showHealthyOnly) {
      filtered = filtered.filter(item => {
        if (!item.nutritionalInfo) return false;
        
        // Simple health criteria - you could expand this
        const isHealthy = 
          item.nutritionalInfo.calories < 600 &&
          (item.nutritionalInfo.fiber || 0) >= 3;
        return isHealthy;
      });
    }
    
    setFilteredItems(filtered);
  }, [preferences, foodItems]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const headerThreshold = 300;
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
              <div className="flex flex-wrap items-center gap-4 text-white mb-3">
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
              
              {/* Dietary tags */}
              {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {restaurant.dietaryOptions.map(option => (
                    <Badge 
                      key={option} 
                      variant="secondary" 
                      className="bg-white/30 hover:bg-white/40"
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              )}
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
        {/* Tabs Navigation */}
        <Tabs defaultValue="menu" value={activeTab} onValueChange={(val) => setActiveTab(val as 'menu' | 'reviews')} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            {/* Active Filters Display */}
            {(preferences.dietaryMode !== 'all' || 
             preferences.calorieRange[0] > 0 || 
             preferences.calorieRange[1] < 1000 ||
             preferences.showHealthyOnly ||
             preferences.restrictions.length > 0) && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.dietaryMode !== 'all' && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800">
                      {preferences.dietaryMode === 'vegetarian' 
                        ? 'Vegetarian Only' 
                        : preferences.dietaryMode === 'vegan' 
                        ? 'Vegan Only' 
                        : 'Non-Vegetarian Only'}
                    </Badge>
                  )}
                  
                  {(preferences.calorieRange[0] > 0 || preferences.calorieRange[1] < 1000) && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800">
                      {preferences.calorieRange[0]}-{preferences.calorieRange[1]} calories
                    </Badge>
                  )}
                  
                  {preferences.showHealthyOnly && (
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800">
                      Healthy Options Only
                    </Badge>
                  )}
                  
                  {preferences.restrictions.map(restriction => (
                    <Badge key={restriction} variant="secondary" className="bg-blue-100 dark:bg-blue-800">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          
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
              {categories.map((category) => {
                const itemsInCategory = filteredItems.filter(item => item.category === category);
                
                // Skip categories with no matching items after filtering
                if (itemsInCategory.length === 0) return null;
                
                return (
                  <div 
                    key={category} 
                    className={`mb-12 ${activeCategory && activeCategory !== category ? 'hidden' : ''}`}
                    id={category.toLowerCase().replace(' ', '-')}
                  >
                    <h3 className="text-2xl font-medium mb-6">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {itemsInCategory.map(item => (
                        <FoodItem key={item.id} item={item} showDetails={true} />
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">No menu items match your dietary preferences</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="max-w-4xl mx-auto">
              <ReviewList restaurantId={id || ''} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <CartButton />
    </div>
  );
};

export default RestaurantDetails;
