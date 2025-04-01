
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CartButton from '@/components/CartButton';
import { restaurants } from '@/lib/data';
import { Star, Clock, DollarSign, Search, Filter, Utensils, Leaf, Beef } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDietary } from '@/contexts/DietaryContext';

const Restaurants = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const { preferences } = useDietary();
  
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === '' || restaurant.cuisine === selectedCuisine;
    
    // Dietary filtering (this would use the dietaryOptions property in real implementation)
    const matchesDietary = dietaryFilter === 'all' || 
      (restaurant.dietaryOptions && restaurant.dietaryOptions.includes(dietaryFilter));
    
    // Filter based on dietary preferences from context
    const matchesDietaryPreferences = 
      preferences.dietaryMode === 'all' ||
      (restaurant.dietaryOptions && restaurant.dietaryOptions.includes(preferences.dietaryMode));
    
    // Filter based on restrictions from context
    const matchesRestrictions = preferences.restrictions.length === 0 ||
      (restaurant.dietaryOptions && 
       preferences.restrictions.every(restriction => restaurant.dietaryOptions.includes(restriction)));
    
    return matchesSearch && matchesCuisine && matchesDietary && matchesDietaryPreferences && matchesRestrictions;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-20 bg-orange-50 dark:bg-orange-900/5">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Restaurants</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Discover the best restaurants in your area and order your favorite meals
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search restaurants or cuisines"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="">All Cuisines</option>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Dietary Preference Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Dietary Preferences</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={dietaryFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setDietaryFilter('all')}
              >
                <Utensils className="h-4 w-4" />
                All
              </Button>
              <Button 
                variant={dietaryFilter === 'vegetarian' ? 'default' : 'outline'} 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setDietaryFilter('vegetarian')}
              >
                <Utensils className="h-4 w-4 text-green-500" />
                Vegetarian
              </Button>
              <Button 
                variant={dietaryFilter === 'vegan' ? 'default' : 'outline'} 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setDietaryFilter('vegan')}
              >
                <Leaf className="h-4 w-4 text-teal-500" />
                Vegan
              </Button>
              <Button 
                variant={dietaryFilter === 'non-vegetarian' ? 'default' : 'outline'} 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setDietaryFilter('non-vegetarian')}
              >
                <Beef className="h-4 w-4 text-red-500" />
                Non-Vegetarian
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Restaurant List */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <Link 
                to={`/restaurant/${restaurant.id}`} 
                key={restaurant.id}
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
                    
                    {/* Dietary badges */}
                    {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        {restaurant.dietaryOptions.includes('vegetarian') && (
                          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Veg</span>
                        )}
                        {restaurant.dietaryOptions.includes('vegan') && (
                          <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">Vegan</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded text-orange-700 dark:text-orange-300">
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No restaurants found matching your search</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('');
                  setDietaryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <CartButton />
    </div>
  );
};

export default Restaurants;
