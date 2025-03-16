
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Button } from '@/components/ui/button';
import { ChefHat, LayoutDashboard, Menu, ShoppingBag, Settings, LogOut, User } from 'lucide-react';

const RestaurantAdminLayout = () => {
  const { restaurantProfile, signOut } = useRestaurantAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/restaurant-admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Menu', path: '/restaurant-admin/menu', icon: <Menu className="h-5 w-5" /> },
    { name: 'Orders', path: '/restaurant-admin/orders', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: 'Settings', path: '/restaurant-admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const isActivePath = (path: string) => {
    if (path === '/restaurant-admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-gray-800 p-4 border-b">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-semibold">
            {restaurantProfile?.name || 'Restaurant Portal'}
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold truncate">
              {restaurantProfile?.name || 'Restaurant Portal'}
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 pt-4 pb-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    isActivePath(item.path) 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
      
      {/* Mobile sidebar (shown/hidden based on state) */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={closeMobileMenu}>
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold truncate">
              {restaurantProfile?.name || 'Restaurant Portal'}
            </h1>
          </div>
          
          <nav className="flex-1 pt-4 pb-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                      isActivePath(item.path) 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={() => {
                closeMobileMenu();
                signOut();
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminLayout;
