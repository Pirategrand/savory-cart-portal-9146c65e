
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodItem } from '@/lib/types';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import MenuItemCard from '@/components/restaurant-admin/MenuItemCard';
import MenuItemForm from '@/components/restaurant-admin/MenuItemForm';
import { fetchRestaurantMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/restaurantAdminService';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Menu = () => {
  const { restaurantProfile } = useRestaurantAuth();
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (restaurantProfile) {
      setLoading(true);
      fetchRestaurantMenuItems(restaurantProfile.restaurantId)
        .then(data => {
          setMenuItems(data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
          setCategories(uniqueCategories);
        })
        .catch(error => {
          console.error('Error fetching menu items:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [restaurantProfile]);
  
  const handleAddItemSubmit = async (itemData: Omit<FoodItem, 'id'>) => {
    setIsSubmitting(true);
    
    // Add restaurant ID to the item data
    const itemWithRestaurantId = {
      ...itemData,
      restaurantId: restaurantProfile?.restaurantId || ''
    };
    
    try {
      const newItem = await addMenuItem(itemWithRestaurantId);
      if (newItem) {
        setMenuItems(prev => [...prev, newItem]);
        
        // Check if we need to add a new category
        if (!categories.includes(newItem.category)) {
          setCategories(prev => [...prev, newItem.category]);
        }
        
        setIsAddDialogOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditItemSubmit = async (itemData: Omit<FoodItem, 'id'>) => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedItem = await updateMenuItem(selectedItem.id, itemData);
      if (updatedItem) {
        setMenuItems(prev => 
          prev.map(item => item.id === selectedItem.id ? updatedItem : item)
        );
        
        // Check if we need to add a new category
        if (!categories.includes(updatedItem.category)) {
          setCategories(prev => [...prev, updatedItem.category]);
        }
        
        setIsEditDialogOpen(false);
        setSelectedItem(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await deleteMenuItem(selectedItem.id);
      if (success) {
        setMenuItems(prev => prev.filter(item => item.id !== selectedItem.id));
        setIsDeleteDialogOpen(false);
        setSelectedItem(null);
        
        // Recalculate categories in case we deleted the last item of a category
        const remainingItems = menuItems.filter(item => item.id !== selectedItem.id);
        const remainingCategories = Array.from(new Set(remainingItems.map(item => item.category)));
        setCategories(remainingCategories);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter items based on active category and search query
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Add, edit, or remove items from your restaurant's menu
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search menu items..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          value={activeCategory} 
          onValueChange={setActiveCategory}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto overflow-x-auto flex sm:inline-flex whitespace-nowrap">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Menu Items Grid */}
      <div>
        <TabsContent value={activeCategory} className="p-0">
          {loading ? (
            <div className="text-center p-8">Loading menu items...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-8">
              {searchQuery ? 'No items match your search' : 'No menu items found in this category'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuItemCard 
                  key={item.id} 
                  item={item} 
                  onEdit={(item) => {
                    setSelectedItem(item);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={(id) => {
                    setSelectedItem(menuItems.find(item => item.id === id) || null);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </div>
      
      {/* Add Menu Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm 
            onSubmit={handleAddItemSubmit} 
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <MenuItemForm 
            initialData={selectedItem || undefined}
            onSubmit={handleEditItemSubmit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedItem(null);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setSelectedItem(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Menu;
