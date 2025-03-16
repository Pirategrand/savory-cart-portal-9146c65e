
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { Link } from 'react-router-dom';
import { ChefHat, ArrowLeft } from 'lucide-react';

const RestaurantLogin = () => {
  const [email, setEmail] = useState('demo@restaurant.com');
  const [password, setPassword] = useState('password');
  const { signIn, loading } = useRestaurantAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link to="/" className="absolute top-4 left-4 flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to main site
      </Link>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <ChefHat className="h-8 w-8" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Restaurant Partner Portal</CardTitle>
            <CardDescription>
              Sign in to manage your restaurant, menu, and orders
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                For demo purposes, use: <span className="font-semibold">demo@restaurant.com</span> / <span className="font-semibold">password</span>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
            Contact us to become a partner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
