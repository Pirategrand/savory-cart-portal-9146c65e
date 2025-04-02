
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  cartItemsEmpty: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  tax,
  total,
  isProcessing,
  cartItemsEmpty,
  handleSubmit
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sticky top-24 subtle-shadow">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        type="submit"
        onClick={handleSubmit}
        disabled={isProcessing || cartItemsEmpty}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Processing...
          </div>
        ) : 'Place Order'}
      </Button>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        By placing your order, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
      </div>
    </div>
  );
};

export default OrderSummary;
