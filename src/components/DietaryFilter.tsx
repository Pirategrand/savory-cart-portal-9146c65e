
import React from 'react';
import { Beef, Salad, Sprout } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';

interface DietaryFilterProps {
  selectedDiet: string | null;
  onChange: (diet: string | null) => void;
}

const DietaryFilter: React.FC<DietaryFilterProps> = ({ selectedDiet, onChange }) => {
  const handleClick = (diet: string) => {
    if (selectedDiet === diet) {
      onChange(null); // Toggle off if already selected
    } else {
      onChange(diet);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant={selectedDiet === 'vegetarian' ? 'default' : 'outline'}
        className={`cursor-pointer px-3 py-1 ${selectedDiet === 'vegetarian' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-100 dark:hover:bg-green-900/20'}`}
        onClick={() => handleClick('vegetarian')}
      >
        <Salad className="h-4 w-4 mr-1" />
        Vegetarian
      </Badge>
      
      <Badge 
        variant={selectedDiet === 'vegan' ? 'default' : 'outline'}
        className={`cursor-pointer px-3 py-1 ${selectedDiet === 'vegan' ? 'bg-green-700 hover:bg-green-800' : 'hover:bg-green-100 dark:hover:bg-green-900/20'}`}
        onClick={() => handleClick('vegan')}
      >
        <Sprout className="h-4 w-4 mr-1" />
        Vegan
      </Badge>
      
      <Badge 
        variant={selectedDiet === 'non-vegetarian' ? 'default' : 'outline'}
        className={`cursor-pointer px-3 py-1 ${selectedDiet === 'non-vegetarian' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-100 dark:hover:bg-red-900/20'}`}
        onClick={() => handleClick('non-vegetarian')}
      >
        <Beef className="h-4 w-4 mr-1" />
        Non-Vegetarian
      </Badge>
    </div>
  );
};

export default DietaryFilter;
