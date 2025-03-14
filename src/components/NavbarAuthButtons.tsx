
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const NavbarAuthButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
      // Additional navigation as a fallback
      setTimeout(() => navigate('/'), 200);
    } catch (error) {
      console.error('Error during sign out:', error);
      toast.error('Sign out failed. Please try again.');
    }
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer">
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/auth/login">
        <Button variant="ghost" size="sm">
          Sign in
        </Button>
      </Link>
      <Link to="/auth/register">
        <Button className="bg-orange-500 hover:bg-orange-600" size="sm">
          Sign up
        </Button>
      </Link>
    </div>
  );
};

export default NavbarAuthButtons;
