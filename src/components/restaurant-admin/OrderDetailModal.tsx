
import React from 'react';
import { Order } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MapPin, Calendar, CreditCard, Clock, CheckCircle, ArrowRightCircle } from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  open, 
  onClose,
  onUpdateStatus
}) => {
  if (!order) return null;

  // Helper function to get appropriate status badge color
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Confirmed</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Preparing</Badge>;
      case 'ready_for_pickup':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ready for Pickup</Badge>;
      case 'out_for_delivery':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get next status options based on current status
  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Order['status'][] = [
      'pending', 
      'confirmed', 
      'preparing', 
      'ready_for_pickup', 
      'out_for_delivery', 
      'delivered'
    ];
    
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= statusFlow.length - 1) {
      return null;
    }
    
    return statusFlow[currentIndex + 1];
  };

  const nextStatus = getNextStatus(order.status);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order #{order.id.substring(0, 8)}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Order Date</p>
                <p className="text-gray-600">{formatDate(order.trackingUpdates?.[0]?.timestamp)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-gray-600">{order.estimatedDeliveryTime}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-gray-600">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-gray-600 capitalize">
                  {order.paymentMethod.type}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-2">Order Items</h3>
            <div className="border rounded-md divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center text-sm font-medium">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-medium">{item.foodItem.name}</p>
                      <p className="text-xs text-gray-500">{item.foodItem.description.substring(0, 50)}{item.foodItem.description.length > 50 ? '...' : ''}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.foodItem.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <h3 className="text-sm font-medium mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p>${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Delivery Fee</p>
                <p>${order.deliveryFee.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Tax</p>
                <p>${order.tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <p>Total</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2 justify-end">
          {nextStatus && (
            <Button 
              className="gap-2"
              onClick={() => onUpdateStatus(order.id, nextStatus)}
            >
              {order.status === 'pending' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Order
                </>
              ) : (
                <>
                  <ArrowRightCircle className="h-4 w-4" />
                  Update to {nextStatus.replace('_', ' ')}
                </>
              )}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
