
import React from 'react';
import { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewOrder, onUpdateStatus }) => {
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
  const getNextStatusOptions = (currentStatus: Order['status']) => {
    const allStatuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered'];
    const currentIndex = allStatuses.indexOf(currentStatus);
    
    // If current status is delivered or not found, no next status
    if (currentIndex === -1 || currentStatus === 'delivered') {
      return [];
    }
    
    // Return next possible statuses (up to 2)
    return allStatuses.slice(currentIndex + 1, currentIndex + 3);
  };

  // Format the timestamp for display
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Items</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No orders available
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const nextStatusOptions = getNextStatusOptions(order.status);
              
              return (
                <tr 
                  key={order.id} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <td className="px-4 py-4 text-sm font-medium">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col">
                      <span>{order.deliveryAddress.street}</span>
                      <span className="text-xs text-gray-500">
                        {order.deliveryAddress.city}, {order.deliveryAddress.state}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(order.status)}
                      <span className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {formatTimestamp(order.trackingUpdates?.[0]?.timestamp)}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-2">
                      {nextStatusOptions.length > 0 ? (
                        nextStatusOptions.map((status) => (
                          <Button 
                            key={status}
                            size="sm" 
                            variant="outline"
                            onClick={() => onUpdateStatus(order.id, status)}
                          >
                            Mark as {status.replace('_', ' ')}
                          </Button>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No actions available</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewOrder(order)}
                    >
                      <span className="sr-only">View details</span>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
