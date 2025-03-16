
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Order } from '@/lib/types';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import OrdersTable from '@/components/restaurant-admin/OrdersTable';
import OrderDetailModal from '@/components/restaurant-admin/OrderDetailModal';
import { fetchRestaurantOrders, updateOrderStatus, subscribeToRestaurantOrders } from '@/lib/restaurantAdminService';
import { Search, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orders = () => {
  const { restaurantProfile } = useRestaurantAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    if (restaurantProfile) {
      setLoading(true);
      fetchRestaurantOrders(restaurantProfile.restaurantId)
        .then(data => {
          setOrders(data);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        })
        .finally(() => {
          setLoading(false);
        });
        
      // Subscribe to real-time order updates
      const unsubscribe = subscribeToRestaurantOrders(
        restaurantProfile.restaurantId,
        (updatedOrder) => {
          setOrders(prev => {
            // Check if this order already exists
            const existingOrderIndex = prev.findIndex(o => o.id === updatedOrder.id);
            if (existingOrderIndex !== -1) {
              // Update existing order
              const newOrders = [...prev];
              newOrders[existingOrderIndex] = updatedOrder;
              return newOrders;
            } else {
              // Add new order
              return [updatedOrder, ...prev];
            }
          });
        }
      );
      
      return () => {
        unsubscribe();
      };
    }
  }, [restaurantProfile]);
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };
  
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const updatedOrder = await updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      
      // Update selectedOrder if it's currently being viewed
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    }
  };
  
  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryAddress.street.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage all customer orders
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search orders by ID or address"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-60">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready_for_pickup">Ready for Pickup</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              {searchQuery || statusFilter !== 'all' 
                ? 'No orders match your search criteria' 
                : 'No orders found'}
            </div>
          ) : (
            <OrdersTable 
              orders={filteredOrders} 
              onViewOrder={handleViewOrder}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default Orders;
