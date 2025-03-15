import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, ShoppingBag, Package, Truck, Home, 
  CheckCircle, ArrowRight, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedOptions?: {
    optionName: string;
    choice: {
      id: string;
      name: string;
      price: number;
    }
  }[];
};

type DeliveryAddress = {
  name: string;
  phone: string;
  address: string;
};

type Order = {
  id: string;
  user_id: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_image: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  delivery_address: DeliveryAddress;
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  created_at: string;
};

const MAX_ORDERS_LOADING_TIME = 8000; // 8 second safety timeout

const OrderStatusIcon = ({ status }: { status: Order['status'] }) => {
  switch(status) {
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'confirmed':
      return <ShoppingBag className="h-5 w-5 text-blue-500" />;
    case 'preparing':
      return <Package className="h-5 w-5 text-purple-500" />;
    case 'out-for-delivery':
      return <Truck className="h-5 w-5 text-orange-500" />;
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'cancelled':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'preparing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500';
      case 'out-for-delivery': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-500';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      <OrderStatusIcon status={status} />
      {getStatusText(status)}
    </span>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const isMounted = useRef(true);
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && loading) {
        console.warn('Orders loading timeout reached, forcing loading state to false');
        setLoading(false);
        setFetchError('The server took too long to respond. Please try again later.');
      }
    }, MAX_ORDERS_LOADING_TIME);

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        
        console.log('Fetching orders for user:', user.id);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (isMounted.current) {
          setOrders(data as unknown as Order[]);
        }
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        if (isMounted.current) {
          setFetchError(error.message || 'Failed to load your orders');
          toast.error('Failed to load orders', {
            description: error.message
          });
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderErrorState = () => {
    if (!fetchError) return null;
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center border border-red-200 dark:border-red-800">
        <div className="h-20 w-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-medium mb-2 text-red-700 dark:text-red-400">Error Loading Orders</h2>
        <p className="text-red-600 dark:text-red-300 mb-6">
          {fetchError}
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : fetchError ? (
          renderErrorState()
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center subtle-shadow">
            <div className="h-20 w-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-blue-400 dark:text-blue-300" />
            </div>
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start exploring restaurants and place your first order!
            </p>
            <Button 
              onClick={() => navigate('/restaurants')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden subtle-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={order.restaurant_image || '/placeholder.svg'} 
                          alt={order.restaurant_name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{order.restaurant_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hidden md:flex"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="bg-gray-100 dark:bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                              {item.quantity}
                            </span>
                            <span className="flex-grow">{item.name}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Delivery Address</h4>
                      <div className="flex items-start gap-2 text-sm">
                        <Home className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-grow">
                          <p className="font-medium">{order.delivery_address.name}</p>
                          <p className="text-muted-foreground">{order.delivery_address.phone}</p>
                          <p className="text-muted-foreground">{order.delivery_address.address}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Fee:</span>
                          <span>${order.delivery_fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax:</span>
                          <span>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium mt-2">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full mt-4 md:hidden"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
