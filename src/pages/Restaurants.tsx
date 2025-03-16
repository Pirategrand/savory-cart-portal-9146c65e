
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CartButton from '@/components/CartButton';
import { restaurants } from '@/lib/data';
import { Star, Clock, DollarSign, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DietaryFilter from '@/components/DietaryFilter';

const Restaurants = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);

  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === '' || restaurant.cuisine === selectedCuisine;
    
    // Filter by dietary preference
    const matchesDiet = !selectedDiet || 
      (restaurant.dietaryOptions && restaurant.dietaryOptions[selectedDiet as keyof typeof restaurant.dietaryOptions]);
    
    return matchesSearch && matchesCuisine && matchesDiet;
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
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
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
            
            {/* Dietary Preferences Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Dietary Preferences:</span>
              <DietaryFilter 
                selectedDiet={selectedDiet} 
                onChange={setSelectedDiet} 
              />
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
                    
                    {/* Dietary options */}
                    {restaurant.dietaryOptions && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {restaurant.dietaryOptions.vegetarian && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center">
                            <Salad className="h-3 w-3 mr-1" />
                            Veg
                          </span>
                        )}
                        {restaurant.dietaryOptions.vegan && (
                          <span className="text-xs bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center">
                            <Sprout className="h-3 w-3 mr-1" />
                            Vegan
                          </span>
                        )}
                        {restaurant.dietaryOptions.nonVegetarian && (
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center">
                            <Beef className="h-3 w-3 mr-1" />
                            Non-Veg
                          </span>
                        )}
                      </div>
                    )}
                    
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
              <p className="text-lg text-muted-foreground mb-4">No restaurants found matching your search or dietary preferences</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCuisine('');
                  setSelectedDiet(null);
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
