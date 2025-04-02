import React from 'react';
import { FoodItem as FoodItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Plus, Flame } from 'lucide-react';
import NutritionalInfo from './NutritionalInfo';
import { useDietary } from '@/contexts/DietaryContext';
import { Badge } from '@/components/ui/badge';

interface FoodItemProps {
  item: FoodItemType;
  showDetails?: boolean;
}

const FoodItem: React.FC<FoodItemProps> = ({ item, showDetails = false }) => {
  const { addToCart } = useCart();
  const { preferences } = useDietary();
  
  const handleAddToCart = () => {
    addToCart(item, 1);
  };
  
  // Check if this item matches the dietary restrictions
  const matchesRestrictions = preferences.restrictions.length === 0 || 
    preferences.restrictions.every(restriction => {
      // This is simplified - in a real app, you'd have a proper mapping of food items to restrictions
      if (restriction === 'gluten-free' && item.dietaryType === 'vegan') return true;
      if (restriction === 'dairy-free' && item.dietaryType === 'vegan') return true;
      return false;
    });
  
  return (
    <div className="glass-card rounded-xl overflow-hidden card-hover">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {item.popular && (
            <div className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
              Popular
            </div>
          )}
          
          {/* Show calorie badge if nutritionalInfo available */}
          {item.nutritionalInfo && (
            <div className="flex items-center text-xs bg-gray-800/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full shadow-sm">
              <Flame className="h-3 w-3 mr-1" aria-hidden="true" />
              {item.nutritionalInfo.calories} cal
            </div>
          )}
        </div>
        
        {/* Dietary Badge */}
        <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full shadow-sm ${
          item.dietaryType === 'vegetarian' 
            ? 'bg-green-500 text-white' 
            : item.dietaryType === 'vegan' 
            ? 'bg-teal-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {item.dietaryType === 'vegetarian' 
            ? 'Veg' 
            : item.dietaryType === 'vegan' 
            ? 'Vegan' 
            : 'Non-Veg'}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{item.name}</h3>
          <div className="font-medium text-orange-600 dark:text-orange-400">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>
        
        {/* Health tags based on nutritional info */}
        {item.nutritionalInfo && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.nutritionalInfo.calories < 500 && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                Low Calorie
              </Badge>
            )}
            {item.nutritionalInfo.protein > 20 && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                High Protein
              </Badge>
            )}
            {(item.nutritionalInfo.fiber || 0) > 5 && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                High Fiber
              </Badge>
            )}
          </div>
        )}
        
        {showDetails && item.options && item.options.length > 0 && (
          <div className="mt-2 mb-4">
            <h4 className="text-sm font-medium mb-2">Options</h4>
            <div className="space-y-2">
              {item.options.map((option) => (
                <div key={option.name} className="text-sm">
                  <span className="text-muted-foreground">{option.name}: </span>
                  <span className="font-medium">
                    {option.choices.map(c => c.name).join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {showDetails && item.nutritionalInfo && <NutritionalInfo item={item} />}
        
        <Button 
          onClick={handleAddToCart}
          size="sm" 
          className="w-full mt-2 bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400 transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default FoodItem;
