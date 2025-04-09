import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

/**
 * Mobile bottom navigation bar component 
 * Shows on smaller screens to provide easy access to key app functions
 */
const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-card border-t border-gray-200 dark:border-muted/30 px-1 pb-safe shadow-md">
      <div className="flex items-center justify-between py-2">
        {/* Home */}
        <NavItem 
          to="/" 
          label="Αρχική"
          isActive={isActive('/')}
          icon={<Home size={20} />}
        />
        
        {/* Menu/Catalog */}
        <NavItem 
          to="/menu" 
          label="Κατάλογος"
          isActive={isActive('/menu')}
          icon={<Search size={20} />}
        />
        
        {/* Cart */}
        <NavItem 
          to="/cart" 
          label="Καλάθι"
          isActive={isActive('/cart')}
          icon={
            <div className="relative">
              <ShoppingBag size={20} />
              {isAuthenticated && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-canteen-coral dark:bg-canteen-coral text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          }
        />
        
        {/* Account */}
        <NavItem 
          to={isAuthenticated ? "/profile" : "/login"} 
          label={isAuthenticated ? "Προφίλ" : "Σύνδεση"}
          isActive={isActive('/profile') || isActive('/login')}
          icon={<User size={20} />}
        />
        
        {/* More */}
        <NavItem 
          to="/more" 
          label="Περισσότερα"
          isActive={isActive('/more')}
          icon={<Menu size={20} />}
        />
      </div>
    </div>
  );
};

type NavItemProps = {
  to: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
};

const NavItem: React.FC<NavItemProps> = ({ to, label, isActive, icon }) => {
  return (
    <Link 
      to={to} 
      className="relative flex flex-col items-center justify-center w-full min-h-[56px] px-1 py-2 touch-manipulation"
      aria-label={label}
      role="button"
    >
      <span className={`
        flex items-center justify-center mb-1 relative
        ${isActive 
          ? 'text-canteen-teal dark:text-primary' 
          : 'text-gray-500 dark:text-gray-400'
        }
      `}>
        {icon}
        {isActive && (
          <motion.div
            layoutId="bottomNavIndicator"
            className="absolute -bottom-1 w-1 h-1 rounded-full bg-canteen-teal dark:bg-primary"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </span>
      <span className={`
        text-xs text-center
        ${isActive 
          ? 'font-medium text-canteen-teal dark:text-primary' 
          : 'text-gray-500 dark:text-gray-400'
        }
      `}>
        {label}
      </span>
    </Link>
  );
};

export default MobileBottomNav; 