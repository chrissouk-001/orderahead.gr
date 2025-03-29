
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <img 
            src="https://img.freepik.com/premium-vector/school-food-logo-design-template_145155-2789.jpg?w=826" 
            alt="Smart Canteen Atsoglou Logo" 
            className="h-10 w-auto mr-2 rounded-md" 
          />
          <span className="text-xl font-bold text-canteen-dark">
            Smart Canteen <span className="text-canteen-teal">Atsoglou</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-canteen-teal transition-colors">
            Αρχική
          </Link>
          <Link to="/menu" className="text-gray-700 hover:text-canteen-teal transition-colors">
            Κατάλογος
          </Link>
          <Link to="/order-status" className="text-gray-700 hover:text-canteen-teal transition-colors">
            Κατάσταση Παραγγελίας
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-canteen-teal transition-colors">
            Επικοινωνία
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link 
                to="/cart" 
                className="relative inline-flex items-center p-2 text-canteen-dark hover:text-canteen-teal"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-canteen-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Το προφίλ μου</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/order-history">Ιστορικό παραγγελιών</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-canteen-dark hover:text-canteen-teal">
                Σύνδεση
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
