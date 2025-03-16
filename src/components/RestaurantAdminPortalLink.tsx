
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface RestaurantAdminPortalLinkProps {
  className?: string;
}

const RestaurantAdminPortalLink: React.FC<RestaurantAdminPortalLinkProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  
  return (
    <Link to="/restaurant-login" className={className}>
      <Button variant="outline" size="sm" className="gap-2">
        <ChefHat className="h-4 w-4" />
        {t('common.restaurantPortal')}
      </Button>
    </Link>
  );
};

export default RestaurantAdminPortalLink;
