
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/lib/types';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import OrdersTable from '@/components/restaurant-admin/OrdersTable';
import OrderDetailModal from '@/components/restaurant-admin/OrderDetailModal';
import { fetchRestaurantOrders, updateOrderStatus, subscribeToRestaurantOrders } from '@/lib/restaurantAdminService';
import { BarChart, ShoppingBag, DollarSign, Users, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const { restaurantProfile } = useRestaurantAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  
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
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'today') {
      // Simple check for demo purposes
      return true;
    } else if (activeTab === 'pending') {
      return ['pending', 'confirmed'].includes(order.status);
    } else if (activeTab === 'preparing') {
      return ['preparing', 'ready_for_pickup'].includes(order.status);
    } else if (activeTab === 'delivered') {
      return ['out_for_delivery', 'delivered'].includes(order.status);
    }
    return true;
  });
  
  // Calculate dashboard stats
  const pendingOrdersCount = orders.filter(order => 
    ['pending', 'confirmed'].includes(order.status)
  ).length;
  
  const completedOrdersCount = orders.filter(order => 
    order.status === 'delivered'
  ).length;
  
  const totalRevenue = orders.reduce((sum, order) => 
    order.status === 'delivered' ? sum + order.total : sum
  , 0);
  
  // Mock data for this demo
  const uniqueCustomers = 18;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your restaurant's performance and orders
          </p>
        </div>
        <Button>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrdersCount > 0 ? 'Orders requiring attention' : 'No pending orders'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrdersCount}</div>
            <p className="text-xs text-muted-foreground">
              +{completedOrdersCount > 10 ? 18 : 5}% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +{uniqueCustomers > 15 ? 12 : 3}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Orders Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="today">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="p-0">
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-8 text-center">No orders found</div>
                ) : (
                  <OrdersTable 
                    orders={filteredOrders} 
                    onViewOrder={handleViewOrder}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
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

export default Dashboard;
