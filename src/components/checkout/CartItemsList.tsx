
import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartItemsListProps {
  cartItems: CartItem[];
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
      <h2 className="text-lg font-medium mb-4">Your Order</h2>
      <div className="space-y-4 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={item.foodItem.image} 
                alt={item.foodItem.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-medium">{item.foodItem.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item.foodItem.description.substring(0, 60)}...</p>
              
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className="text-xs text-muted-foreground mb-1">
                  {item.selectedOptions.map((option, index) => (
                    <span key={index}>
                      {option.optionName}: {option.choice.name}
                      {index < item.selectedOptions!.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="font-medium">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItemsList;
