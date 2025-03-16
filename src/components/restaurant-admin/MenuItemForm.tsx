
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { FoodItem } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MenuItemFormProps {
  initialData?: Partial<FoodItem>;
  onSubmit: (data: Omit<FoodItem, 'id'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    popular: false,
    dietaryType: 'non-vegetarian',
    nutritionalInfo: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNutritionalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [name]: parseFloat(value)
      }
    }));
  };

  const handleDietaryChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      dietaryType: value as 'vegetarian' | 'vegan' | 'non-vegetarian' 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert('Please fill out all required fields');
      return;
    }
    
    onSubmit(formData as Omit<FoodItem, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Dietary Type *</Label>
        <RadioGroup 
          value={formData.dietaryType} 
          onValueChange={handleDietaryChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegetarian" id="vegetarian" />
            <Label htmlFor="vegetarian" className="font-normal">Vegetarian</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vegan" id="vegan" />
            <Label htmlFor="vegan" className="font-normal">Vegan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-vegetarian" id="non-vegetarian" />
            <Label htmlFor="non-vegetarian" className="font-normal">Non-Vegetarian</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-3">
        <Label>Nutritional Information</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="calories" className="text-xs">Calories</Label>
            <Input
              id="calories"
              name="calories"
              type="number"
              min="0"
              value={formData.nutritionalInfo?.calories}
              onChange={handleNutritionalInfoChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
            <Input
              id="protein"
              name="protein"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo?.protein}
              onChange={handleNutritionalInfoChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
            <Input
              id="carbs"
              name="carbs"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo?.carbs}
              onChange={handleNutritionalInfoChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
            <Input
              id="fat"
              name="fat"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo?.fat}
              onChange={handleNutritionalInfoChange}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="fiber" className="text-xs">Fiber (g)</Label>
            <Input
              id="fiber"
              name="fiber"
              type="number"
              min="0"
              step="0.1"
              value={formData.nutritionalInfo?.fiber}
              onChange={handleNutritionalInfoChange}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="popular"
          checked={formData.popular || false}
          onCheckedChange={(checked) => {
            setFormData(prev => ({ ...prev, popular: checked === true }));
          }}
        />
        <Label htmlFor="popular" className="text-sm font-normal">
          Mark as popular item
        </Label>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Item' : 'Add Item'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MenuItemForm;
