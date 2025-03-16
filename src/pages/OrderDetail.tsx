
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import OrderTracking from '@/components/OrderTracking';
import { Order } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { fetchOrderById } from '@/lib/orderTrackingService';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);
  const loadingTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!orderId) {
      setError('Order ID is missing');
      setIsLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const orderData = await fetchOrderById(orderId);
        if (isMounted.current) {
          if (orderData) {
            setOrder(orderData);
          } else {
            setError('Order not found');
          }
        }
      } catch (err) {
        console.error('Error loading order:', err);
        if (isMounted.current) {
          setError('Failed to load order details');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    // Set a safety timeout to prevent infinite loading
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isMounted.current && isLoading) {
        setIsLoading(false);
        setError('Loading order timed out. Please try again.');
      }
    }, 10000);

    return () => {
      isMounted.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [orderId, user, navigate]);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center border border-red-200 dark:border-red-800">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2 text-red-700 dark:text-red-400">
              {error || 'Order not found'}
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/orders">
                <Button variant="outline">View All Orders</Button>
              </Link>
              <Link to="/">
                <Button>
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Order Details</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{order.id.substring(0, 8).toUpperCase()}</p>
                </div>
                
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                  {order.status === 'pending' ? 'Pending' : 
                   order.status === 'confirmed' ? 'Confirmed' : 
                   order.status === 'preparing' ? 'Preparing' : 
                   order.status === 'ready_for_pickup' ? 'Ready for Pickup' : 
                   order.status === 'out_for_delivery' ? 'Out for Delivery' : 
                   order.status === 'delivered' ? 'Delivered' : 'Processing'}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Restaurant</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <img 
                        src={order.restaurant.image || '/placeholder.svg'} 
                        alt={order.restaurant.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{order.restaurant.name}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <ul className="space-y-3">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 dark:bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {item.quantity || 1}
                          </span>
                          <span>{item.foodItem?.name || 'Item ' + (index + 1)}</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            (item.foodItem?.price || 0) * (item.quantity || 1)
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Delivery Address</h3>
                  <p>{order.deliveryAddress.street}</p>
                  <p>
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg mt-2">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h2 className="text-lg font-medium mb-4">Track Your Order</h2>
            <OrderTracking order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
