
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Apple, Beef, Flame, Heart } from 'lucide-react';
import { FoodItem } from '@/lib/types';

interface NutritionalInfoProps {
  item: FoodItem;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ item }) => {
  if (!item.nutritionalInfo) return null;
  
  const { calories, protein, carbs, fat, fiber } = item.nutritionalInfo;
  
  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <h4 className="text-sm font-semibold mb-3">Nutritional Information</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center">
            <Flame className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-sm text-muted-foreground">Calories</span>
            <span className="font-medium">{calories}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Beef className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-sm text-muted-foreground">Protein</span>
            <span className="font-medium">{protein}g</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Apple className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-sm text-muted-foreground">Carbs</span>
            <span className="font-medium">{carbs}g</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Heart className="h-5 w-5 text-yellow-500 mb-1" />
            <span className="text-sm text-muted-foreground">Fat</span>
            <span className="font-medium">{fat}g</span>
          </div>
          
          {fiber !== undefined && (
            <div className="flex flex-col items-center">
              <span className="font-mono font-semibold text-green-600">F</span>
              <span className="text-sm text-muted-foreground">Fiber</span>
              <span className="font-medium">{fiber}g</span>
            </div>
          )}
        </div>
        
        {/* Dietary Type Badge */}
        <Separator className="my-3" />
        <div className="flex justify-center">
          <span 
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              item.dietaryType === 'vegetarian' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : item.dietaryType === 'vegan'
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {item.dietaryType === 'vegetarian' 
              ? 'Vegetarian' 
              : item.dietaryType === 'vegan' 
              ? 'Vegan' 
              : 'Non-Vegetarian'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionalInfo;
