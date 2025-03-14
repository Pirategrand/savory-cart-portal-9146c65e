
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20">
      <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="h-12 w-12 text-blue-400 dark:text-blue-300" />
      </div>
      <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Looks like you haven't added any items to your cart yet. Browse our restaurants to find something delicious!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Browse Restaurants
          </Button>
        </Link>
        <Link to="/orders">
          <Button variant="outline" className="border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Your Orders
          </Button>
        </Link>
      </div>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>Need help? <a href="/" className="text-blue-500 hover:underline">Contact our support team</a></p>
      </div>
    </div>
  );
};

export default EmptyCart;
