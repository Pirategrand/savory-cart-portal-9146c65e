
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Flame, Beef, Cookie, Droplet, ChevronDown, ChevronUp, GanttChart } from 'lucide-react';
import { FoodItem } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NutritionalInfoProps {
  item: FoodItem;
}

// Function to determine color based on nutritional values
const getValueColor = (type: 'calories' | 'protein' | 'carbs' | 'fat', value: number): string => {
  switch(type) {
    case 'calories':
      return value > 700 ? 'text-red-500' : value > 400 ? 'text-amber-500' : 'text-green-500';
    case 'protein':
      return value > 30 ? 'text-green-500' : value > 15 ? 'text-amber-500' : 'text-gray-500';
    case 'carbs':
      return value > 60 ? 'text-red-500' : value > 30 ? 'text-amber-500' : 'text-green-500';
    case 'fat':
      return value > 25 ? 'text-red-500' : value > 15 ? 'text-amber-500' : 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

const NutrientItem = ({ 
  icon: Icon, 
  label, 
  value, 
  unit = 'g',
  colorType,
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number; 
  unit?: string;
  colorType: 'calories' | 'protein' | 'carbs' | 'fat';
}) => {
  const valueColor = getValueColor(colorType, value);
  
  return (
    <div className="flex flex-col items-center justify-center p-1">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 mb-1">
        <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
      </div>
      <span className={cn("font-semibold text-lg", valueColor)}>
        {value}{colorType !== 'calories' ? unit : ''}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ item }) => {
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(false);
  
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
    <Card className="mt-4 overflow-hidden">
      <CardContent className="p-0">
        {/* Basic Nutritional Info - Always visible */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold">Nutrition Facts</h4>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
              {item.dietaryType === 'vegetarian' 
                ? 'Vegetarian' 
                : item.dietaryType === 'vegan' 
                ? 'Vegan' 
                : 'Non-Vegetarian'}
            </span>
          </div>
          
          {/* Main nutrition grid - always visible */}
          <div className="grid grid-cols-4 gap-2 border rounded-md p-2 bg-gray-50 dark:bg-gray-900/30">
            <NutrientItem 
              icon={Flame} 
              label="Calories" 
              value={calories} 
              unit="" 
              colorType="calories"
            />
            <NutrientItem 
              icon={Beef} 
              label="Protein" 
              value={protein} 
              colorType="protein"
            />
            <NutrientItem 
              icon={Cookie} 
              label="Carbs" 
              value={carbs} 
              colorType="carbs"
            />
            <NutrientItem 
              icon={Droplet} 
              label="Fat" 
              value={fat} 
              colorType="fat"
            />
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full border-t">
          <AccordionItem value="details" className="border-0">
            <AccordionTrigger className="py-2 px-4 text-sm">
              <span className="flex items-center text-blue-500">
                Detailed Nutrition Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {/* Detailed Nutrition Breakdown */}
              {fiber !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Dietary Fiber</span>
                    <span className="font-medium">{fiber}g</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${Math.min(fiber * 10, 100)}%` }} 
                      title={`${fiber}g fiber`}
                    ></div>
                  </div>
                  <div className="text-xs text-right mt-1 text-muted-foreground">
                    {fiber >= 5 ? 'High in fiber' : fiber >= 3 ? 'Good source of fiber' : 'Low in fiber'}
                  </div>
                </div>
              )}
              
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default NutritionalInfo;
