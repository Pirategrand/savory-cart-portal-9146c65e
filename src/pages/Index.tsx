
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import RestaurantList from '@/components/RestaurantList';
import CartButton from '@/components/CartButton';
import Navbar from '@/components/Navbar';
import { getFoodItemsByRestaurantId, getPopularFoodItems } from '@/lib/data';
import FoodItem from '@/components/FoodItem';

const Index = () => {
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const popularItems = getPopularFoodItems().slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      <RestaurantList />

      {/* Popular Dishes Section */}
      <section className="py-16 bg-blue-50/50 dark:bg-blue-900/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium mb-2">Top-Rated Dishes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the most loved dishes from our partner restaurants
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium mb-2">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the convenience of food delivery in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Browse Restaurants",
                description: "Explore a variety of restaurants and cuisines near you.",
                icon: "🔍",
                delay: 100
              },
              {
                title: "Place Your Order",
                description: "Select your favorite dishes and add them to your cart.",
                icon: "🛒",
                delay: 200
              },
              {
                title: "Enjoy Your Food",
                description: "Track your order in real-time and enjoy your meal when it arrives.",
                icon: "🍽️",
                delay: 300
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`animate-enter stagger-${index + 1} text-center p-6 rounded-xl bg-white dark:bg-gray-800 subtle-shadow`}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-3xl bg-blue-50 dark:bg-blue-900/20 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">Ready to order?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Satisfy your cravings with just a few clicks. Fast delivery, amazing food.
          </p>
          <a 
            href="/restaurants"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Order Now
          </a>
        </div>
      </section>
      
      <CartButton />
    </div>
  );
};

export default Index;
