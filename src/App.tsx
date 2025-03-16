
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import UpdatePassword from './pages/auth/UpdatePassword';
import NotFound from './pages/NotFound';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { RestaurantAuthProvider } from './contexts/RestaurantAuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantAdminLayout from './components/restaurant-admin/RestaurantAdminLayout';
import Dashboard from './pages/restaurant-admin/Dashboard';
import Menu from './pages/restaurant-admin/Menu';
import RestaurantOrders from './pages/restaurant-admin/Orders';
import Settings from './pages/restaurant-admin/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <RestaurantAuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/update-password" element={<UpdatePassword />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                
                {/* Restaurant Admin Portal Routes */}
                <Route path="/restaurant-login" element={<RestaurantLogin />} />
                <Route path="/restaurant-admin" element={<RestaurantAdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="orders" element={<RestaurantOrders />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" />} />
              </Routes>
              <Toaster />
              <SonnerToaster position="top-right" expand={true} richColors closeButton />
            </CartProvider>
          </RestaurantAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
