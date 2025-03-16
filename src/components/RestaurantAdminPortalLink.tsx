
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestaurantAdminPortalLinkProps {
  className?: string;
}

const RestaurantAdminPortalLink: React.FC<RestaurantAdminPortalLinkProps> = ({ className = '' }) => {
  return (
    <Link to="/restaurant-login" className={className}>
      <Button variant="outline" size="sm" className="gap-2">
        <ChefHat className="h-4 w-4" />
        Restaurant Portal
      </Button>
    </Link>
  );
};

export default RestaurantAdminPortalLink;
