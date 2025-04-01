
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Apple, Beef, Flame, Heart, Leaf, ChevronDown, ChevronUp, GanttChart } from 'lucide-react';
import { FoodItem } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NutritionalInfoProps {
  item: FoodItem;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!item.nutritionalInfo) return null;
  
  const { calories, protein, carbs, fat, fiber } = item.nutritionalInfo;
  
  // Calculate macronutrient percentages
  const totalMacros = protein * 4 + carbs * 4 + fat * 9; // in calories
  const proteinPercentage = Math.round((protein * 4 / totalMacros) * 100);
  const carbsPercentage = Math.round((carbs * 4 / totalMacros) * 100);
  const fatPercentage = Math.round((fat * 9 / totalMacros) * 100);
  
  // Health assessment based on macronutrient balance
  const isBalanced = 
    proteinPercentage >= 15 && 
    proteinPercentage <= 35 && 
    carbsPercentage >= 45 && 
    carbsPercentage <= 65 && 
    fatPercentage >= 20 && 
    fatPercentage <= 35;
  
  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold mb-2">Nutritional Information</h4>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center text-xs text-blue-500 hover:underline">
              {isOpen ? (
                <>Less <ChevronUp className="h-3 w-3 ml-1" /></>
              ) : (
                <>More <ChevronDown className="h-3 w-3 ml-1" /></>
              )}
            </CollapsibleTrigger>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                  <GanttChart className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-sm text-muted-foreground">Fiber</span>
                  <span className="font-medium">{fiber}g</span>
                </div>
              )}
            </div>
            
            <CollapsibleContent>
              <Separator className="my-3" />
              
              <h5 className="text-xs font-medium mb-2">Macronutrient Distribution</h5>
              <div className="h-4 w-full rounded-full overflow-hidden flex mb-2">
                <div 
                  className="bg-red-400 h-full" 
                  style={{ width: `${proteinPercentage}%` }} 
                  title={`Protein: ${proteinPercentage}%`}
                ></div>
                <div 
                  className="bg-green-400 h-full" 
                  style={{ width: `${carbsPercentage}%` }} 
                  title={`Carbs: ${carbsPercentage}%`}
                ></div>
                <div 
                  className="bg-yellow-400 h-full" 
                  style={{ width: `${fatPercentage}%` }} 
                  title={`Fat: ${fatPercentage}%`}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div>
                  Protein {proteinPercentage}%
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
                  Carbs {carbsPercentage}%
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                  Fat {fatPercentage}%
                </div>
              </div>
              
              {isBalanced ? (
                <div className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-md flex items-center">
                  <span className="font-medium">Nutritionally balanced</span>
                </div>
              ) : (
                <div className="text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-md">
                  <span className="font-medium">Nutritional balance could be improved</span>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
        
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
