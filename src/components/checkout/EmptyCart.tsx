
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
        <Trash2 className="h-12 w-12 text-blue-400 dark:text-blue-300" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link to="/">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Browse Restaurants
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
