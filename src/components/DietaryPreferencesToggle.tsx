
import React from 'react';
import { useDietary } from '@/contexts/DietaryContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Leaf, Beef, Utensils, Salad, FilterX, Fish } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const DietaryPreferencesToggle: React.FC = () => {
  const { preferences, updateMode, updateCalorieRange, toggleRestriction, toggleHealthyOnly, clearPreferences } = useDietary();

  const dietaryRestrictions = [
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'dairy-free', label: 'Dairy Free' },
    { id: 'nut-free', label: 'Nut Free' },
    { id: 'organic', label: 'Organic' },
    { id: 'low-sodium', label: 'Low Sodium' },
    { id: 'keto', label: 'Keto Friendly' },
    { id: 'shellfish-free', label: 'Shellfish Free' },
    { id: 'halal', label: 'Halal' },
  ];

  // Count active filters
  const activeFilterCount = (
    (preferences.dietaryMode !== 'all' ? 1 : 0) +
    preferences.restrictions.length +
    (preferences.showHealthyOnly ? 1 : 0) +
    (preferences.calorieRange[0] > 0 || preferences.calorieRange[1] < 1000 ? 1 : 0)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {preferences.dietaryMode === 'vegetarian' ? (
            <Salad className="h-4 w-4 text-green-500" />
          ) : preferences.dietaryMode === 'vegan' ? (
            <Leaf className="h-4 w-4 text-teal-500" />
          ) : preferences.dietaryMode === 'non-vegetarian' ? (
            <Beef className="h-4 w-4 text-red-500" />
          ) : (
            <Utensils className="h-4 w-4" />
          )}
          <span>Dietary</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Dietary Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground mt-2">Food Type</DropdownMenuLabel>
          <div className="grid grid-cols-2 gap-1 p-2">
            <Button 
              size="sm" 
              variant={preferences.dietaryMode === 'all' ? 'default' : 'outline'}
              className="flex items-center gap-1 justify-start"
              onClick={() => updateMode('all')}
            >
              <Utensils className="h-3.5 w-3.5" />
              <span>All</span>
            </Button>
            <Button 
              size="sm" 
              variant={preferences.dietaryMode === 'vegetarian' ? 'default' : 'outline'}
              className="flex items-center gap-1 justify-start"
              onClick={() => updateMode('vegetarian')}
            >
              <Salad className="h-3.5 w-3.5 text-green-500" />
              <span>Vegetarian</span>
            </Button>
            <Button 
              size="sm" 
              variant={preferences.dietaryMode === 'vegan' ? 'default' : 'outline'}
              className="flex items-center gap-1 justify-start"
              onClick={() => updateMode('vegan')}
            >
              <Leaf className="h-3.5 w-3.5 text-teal-500" />
              <span>Vegan</span>
            </Button>
            <Button 
              size="sm" 
              variant={preferences.dietaryMode === 'non-vegetarian' ? 'default' : 'outline'}
              className="flex items-center gap-1 justify-start"
              onClick={() => updateMode('non-vegetarian')}
            >
              <Beef className="h-3.5 w-3.5 text-red-500" />
              <span>Non-Vegetarian</span>
            </Button>
          </div>
          
          <div className="px-2 pb-2">
            <div className="flex items-center gap-2 mt-2">
              <Button 
                size="sm" 
                variant={preferences.dietaryMode === 'seafood' ? 'default' : 'outline'}
                className="flex items-center gap-1 justify-start w-full"
                onClick={() => updateMode('seafood')}
              >
                <Fish className="h-3.5 w-3.5 text-blue-500" />
                <span>Seafood</span>
              </Button>
            </div>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Calorie Range</DropdownMenuLabel>
          <div className="px-4 py-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{preferences.calorieRange[0]} cal</span>
              <span>{preferences.calorieRange[1]} cal</span>
            </div>
            <Slider 
              value={preferences.calorieRange}
              min={0}
              max={1000}
              step={50}
              onValueChange={(value) => updateCalorieRange(value as [number, number])}
              className="my-2"
            />
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Dietary Restrictions</DropdownMenuLabel>
          <div className="grid grid-cols-2 gap-y-2 p-2">
            {dietaryRestrictions.map((restriction) => (
              <div key={restriction.id} className="flex items-center space-x-2 text-sm">
                <Checkbox 
                  id={restriction.id} 
                  checked={preferences.restrictions.includes(restriction.id)} 
                  onCheckedChange={() => toggleRestriction(restriction.id)}
                />
                <Label htmlFor={restriction.id} className="text-sm cursor-pointer">
                  {restriction.label}
                </Label>
              </div>
            ))}
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <div className="px-4 py-2 flex items-center justify-between">
            <Label htmlFor="healthy-toggle" className="text-sm cursor-pointer">
              Healthy Options Only
            </Label>
            <Switch 
              id="healthy-toggle" 
              checked={preferences.showHealthyOnly} 
              onCheckedChange={toggleHealthyOnly}
            />
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="flex items-center justify-center text-center cursor-pointer"
          onClick={clearPreferences}
        >
          <FilterX className="h-3.5 w-3.5 mr-2" />
          Clear All Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DietaryPreferencesToggle;
