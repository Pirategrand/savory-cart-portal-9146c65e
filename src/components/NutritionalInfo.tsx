
import React from 'react';
import { FoodItem } from '@/lib/types';
import { Beef, Grain, Cookie, Droplet, Sprout } from 'lucide-react';

interface NutritionalInfoProps {
  item: FoodItem;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ item }) => {
  if (!item.nutritionalInfo) return null;

  const { calories, protein, carbs, fat, fiber } = item.nutritionalInfo;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <h4 className="font-medium text-sm mb-3">Nutritional Information</h4>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-4 h-4 text-orange-600 dark:text-orange-400"
            >
              <path d="M19.45 4.06a8.64 8.64 0 0 0-12.27.17l-.84.84a.1.1 0 0 0 0 .14l1.45 1.45a.1.1 0 0 0 .14 0l.84-.84a6.13 6.13 0 0 1 8.68-.17 6.13 6.13 0 0 1 .17 8.67l-.84.84a.1.1 0 0 0 0 .14l1.45 1.45a.1.1 0 0 0 .14 0l.84-.84a8.64 8.64 0 0 0 .17-12.27Z" />
              <path d="m8.31 10.7.84-.84a.1.1 0 0 0 0-.14L7.7 8.27a.1.1 0 0 0-.14 0l-.84.84a6.13 6.13 0 0 0-.17 8.67 6.13 6.13 0 0 0 8.67.17l.84-.84a.1.1 0 0 0 0-.14l-1.45-1.45a.1.1 0 0 0-.14 0l-.84.84a3.86 3.86 0 0 1-5.36.03 3.86 3.86 0 0 1 .03-5.36Z" />
            </svg>
          </div>
          <span className="text-sm text-muted-foreground">Calories</span>
          <span className="font-medium">{calories}</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-1">
            <Beef className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <span className="text-sm text-muted-foreground">Protein</span>
          <span className="font-medium">{protein}g</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mb-1">
            <Grain className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <span className="text-sm text-muted-foreground">Carbs</span>
          <span className="font-medium">{carbs}g</span>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-1">
            <Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-muted-foreground">Fat</span>
          <span className="font-medium">{fat}g</span>
        </div>
        
        {fiber !== undefined && (
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-1">
              <Sprout className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-muted-foreground">Fiber</span>
            <span className="font-medium">{fiber}g</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionalInfo;
