
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types for our dietary preferences
export interface DietaryPreferences {
  dietaryMode: 'all' | 'vegetarian' | 'vegan' | 'non-vegetarian';
  calorieRange: [number, number]; // [min, max]
  restrictions: string[];
  showHealthyOnly: boolean;
}

// Default dietary preferences
const defaultPreferences: DietaryPreferences = {
  dietaryMode: 'all',
  calorieRange: [0, 1000],
  restrictions: [],
  showHealthyOnly: false
};

// Create the context
interface DietaryContextType {
  preferences: DietaryPreferences;
  updateMode: (mode: DietaryPreferences['dietaryMode']) => void;
  updateCalorieRange: (range: [number, number]) => void;
  toggleRestriction: (restriction: string) => void;
  toggleHealthyOnly: () => void;
  clearPreferences: () => void;
}

const DietaryContext = createContext<DietaryContextType | undefined>(undefined);

export const DietaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or default values
  const [preferences, setPreferences] = useState<DietaryPreferences>(() => {
    const savedPreferences = localStorage.getItem('dietaryPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dietaryPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Update dietary mode
  const updateMode = (mode: DietaryPreferences['dietaryMode']) => {
    setPreferences(prev => ({ ...prev, dietaryMode: mode }));
  };

  // Update calorie range
  const updateCalorieRange = (range: [number, number]) => {
    setPreferences(prev => ({ ...prev, calorieRange: range }));
  };

  // Toggle a dietary restriction
  const toggleRestriction = (restriction: string) => {
    setPreferences(prev => {
      const restrictions = [...prev.restrictions];
      const index = restrictions.indexOf(restriction);
      
      if (index === -1) {
        restrictions.push(restriction);
      } else {
        restrictions.splice(index, 1);
      }
      
      return { ...prev, restrictions };
    });
  };

  // Toggle healthy options only
  const toggleHealthyOnly = () => {
    setPreferences(prev => ({ ...prev, showHealthyOnly: !prev.showHealthyOnly }));
  };

  // Clear all preferences
  const clearPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <DietaryContext.Provider 
      value={{ 
        preferences, 
        updateMode, 
        updateCalorieRange, 
        toggleRestriction, 
        toggleHealthyOnly, 
        clearPreferences 
      }}
    >
      {children}
    </DietaryContext.Provider>
  );
};

export const useDietary = () => {
  const context = useContext(DietaryContext);
  if (context === undefined) {
    throw new Error('useDietary must be used within a DietaryProvider');
  }
  return context;
};
