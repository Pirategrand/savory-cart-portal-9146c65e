
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import RestaurantList from '@/components/RestaurantList';
import CartButton from '@/components/CartButton';
import Navbar from '@/components/Navbar';
import { getFoodItemsByRestaurantId, getPopularFoodItems } from '@/lib/data';
import FoodItem from '@/components/FoodItem';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();
  
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
      <section className="py-16 bg-orange-50/50 dark:bg-orange-900/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium mb-2">{t('home.topRatedDishes')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.exploreMostLoved')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <FoodItem key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/restaurants">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                {t('home.browseAllDishes')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium mb-2">{t('home.howItWorks')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.experienceConvenience')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: t('home.browseRestaurants'),
                description: t('home.browseRestaurantsDesc'),
                icon: "🔍",
                delay: 100
              },
              {
                title: t('home.placeYourOrder'),
                description: t('home.placeYourOrderDesc'),
                icon: "🛒",
                delay: 200
              },
              {
                title: t('home.enjoyYourFood'),
                description: t('home.enjoyYourFoodDesc'),
                icon: "🍽️",
                delay: 300
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`animate-enter text-center p-6 rounded-xl bg-white dark:bg-gray-800 subtle-shadow`}
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-3xl bg-orange-50 dark:bg-orange-900/20 rounded-full">
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
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-medium mb-4">{t('home.readyToOrder')}</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            {t('home.satisfyCravings')}
          </p>
          <Link to="/restaurants">
            <Button className="bg-white text-orange-600 hover:bg-gray-100">
              {t('home.orderNow')}
            </Button>
          </Link>
        </div>
      </section>
      
      <CartButton />
    </div>
  );
};

export default Index;
