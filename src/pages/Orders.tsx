
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CartButton from '@/components/CartButton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, CheckCircle, ShoppingBag } from 'lucide-react';

const Orders = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      date: 'Today, 2:30 PM',
      restaurant: 'Burger Haven',
      items: [
        { name: 'Classic Cheeseburger', quantity: 1, price: 8.99 },
        { name: 'Loaded Fries', quantity: 1, price: 5.99 }
      ],
      total: 14.98,
      status: 'delivered',
      deliveryTime: '30 min'
    },
    {
      id: 'ORD-002',
      date: 'Yesterday, 7:15 PM',
      restaurant: 'Pasta Paradise',
      items: [
        { name: 'Spaghetti Carbonara', quantity: 1, price: 12.99 },
        { name: 'Tiramisu', quantity: 1, price: 6.99 }
      ],
      total: 19.98,
      status: 'delivered',
      deliveryTime: '45 min'
    },
    {
      id: 'ORD-003',
      date: 'Today, 1:05 PM',
      restaurant: 'Taco Temple',
      items: [
        { name: 'Street Tacos', quantity: 2, price: 9.99 }
      ],
      total: 19.98,
      status: 'in-progress',
      deliveryTime: '20 min'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-20 bg-orange-50 dark:bg-orange-900/5">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">Your Orders</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Track your current and past food delivery orders
          </p>
        </div>
      </div>
      
      {/* Orders List */}
      <div className="container mx-auto px-4 py-12">
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="glass-card rounded-xl overflow-hidden subtle-shadow"
              >
                <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">
                        {order.status === 'in-progress' ? 'On the way' : order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{order.date}</p>
                    <p className="font-medium mb-3">{order.restaurant}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{order.deliveryTime}</span>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Order #{order.id}</div>
                      <div className="text-xl font-bold mb-4">${order.total.toFixed(2)}</div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="justify-start">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        Reorder
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders yet. Browse restaurants and order your favorite meals!
            </p>
            <Link to="/restaurants">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <CartButton />
    </div>
  );
};

export default Orders;
