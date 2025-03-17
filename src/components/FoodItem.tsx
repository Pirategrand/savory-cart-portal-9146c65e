
import React from 'react';
import { FoodItem as FoodItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Plus } from 'lucide-react';
import NutritionalInfo from './NutritionalInfo';

interface FoodItemProps {
  item: FoodItemType;
  showDetails?: boolean;
}

const FoodItem: React.FC<FoodItemProps> = ({ item, showDetails = false }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(item, 1);
  };
  
  return (
    <div className="glass-card rounded-xl overflow-hidden card-hover">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          loading="lazy"
        />
        {item.popular && (
          <div className="absolute top-2 left-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-sm">
            Popular
          </div>
        )}
        
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
