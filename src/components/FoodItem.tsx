
import React, { useState } from 'react';
import { FoodItem as FoodItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Plus, Salad, Beef, Sprout } from 'lucide-react';
import NutritionalInfo from './NutritionalInfo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

interface FoodItemProps {
  item: FoodItemType;
  showDetails?: boolean;
}

const FoodItem: React.FC<FoodItemProps> = ({ item, showDetails = false }) => {
  const { addToCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(item, 1);
  };

  const getDietaryIcon = () => {
    switch (item.dietaryType) {
      case 'vegetarian':
        return <Salad className="h-4 w-4 text-green-600" />;
      case 'vegan':
        return <Sprout className="h-4 w-4 text-green-700" />;
      case 'non-vegetarian':
        return <Beef className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getDietaryLabel = () => {
    switch (item.dietaryType) {
      case 'vegetarian':
        return (
          <div className="absolute top-2 right-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Salad className="h-3 w-3 mr-1" />
            Vegetarian
          </div>
        );
      case 'vegan':
        return (
          <div className="absolute top-2 right-2 text-xs bg-green-700 text-white px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Sprout className="h-3 w-3 mr-1" />
            Vegan
          </div>
        );
      case 'non-vegetarian':
        return (
          <div className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full shadow-sm flex items-center">
            <Beef className="h-3 w-3 mr-1" />
            Non-Vegetarian
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <>
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
          {getDietaryLabel()}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-lg line-clamp-1">{item.name}</h3>
            <div className="font-medium text-orange-600 dark:text-orange-400">
              ${item.price.toFixed(2)}
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{item.description}</p>
          
          <div className="flex space-x-2 mb-3">
            <div className="flex items-center text-xs text-muted-foreground">
              {getDietaryIcon()}
              <span className="ml-1">{item.dietaryType.replace('-', ' ')}</span>
            </div>
            {item.nutritionalInfo && (
              <div className="text-xs text-muted-foreground">
                {item.nutritionalInfo.calories} cal
              </div>
            )}
          </div>
          
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
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAddToCart}
              size="sm" 
              className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to cart
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              className="px-3"
            >
              Details
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {item.name}
              {getDietaryIcon()}
            </DialogTitle>
            <DialogDescription>
              {item.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-md">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <NutritionalInfo item={item} />
            
            {item.options && item.options.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Options:</h4>
                <div className="space-y-3">
                  {item.options.map((option) => (
                    <div key={option.name}>
                      <h5 className="text-sm font-medium">{option.name} {option.required && <span className="text-red-500">*</span>}</h5>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {option.choices.map((choice) => (
                          <div key={choice.id} className="text-sm flex justify-between">
                            <span>{choice.name}</span>
                            {choice.price > 0 && <span>+${choice.price.toFixed(2)}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              onClick={() => {
                handleAddToCart();
                setIsDialogOpen(false);
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              Add to Cart - ${item.price.toFixed(2)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodItem;
