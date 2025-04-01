import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-background shadow-sm border-b border-gray-100 dark:border-primary/10 backdrop-blur-md bg-white/90 dark:bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint rounded-full p-1.5 overflow-hidden transform transition-all duration-300 group-hover:scale-105 shadow-md">
              <img 
                src="/OrderAhead-logo.svg" 
                alt="OrderAhead.gr Logo" 
                className="h-6 w-6 rounded-full" 
              />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-canteen-dark to-canteen-teal dark:from-white dark:to-primary transition-colors duration-300">
              OrderAhead.gr
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive('/')} isDark={isDarkMode}>
              Αρχική
            </NavLink>
            <NavLink to="/menu" isActive={isActive('/menu')} isDark={isDarkMode}>
              Κατάλογος
            </NavLink>
            <NavLink to="/order-status" isActive={isActive('/order-status')} isDark={isDarkMode}>
              Κατάσταση
            </NavLink>
            <NavLink to="/contact" isActive={isActive('/contact')} isDark={isDarkMode}>
              Επικοινωνία
            </NavLink>
          </nav>
          
          <div className="flex items-center gap-1.5">
            {/* Dark Mode Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              className="rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? 
                <Sun size={18} className="transition-all duration-500 rotate-0 hover:rotate-90" /> : 
                <Moon size={18} className="transition-all duration-500" />
              }
            </Button>
            
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative inline-flex items-center justify-center h-9 w-9 rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={18} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-canteen-coral dark:bg-canteen-coral text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center transition-all duration-300">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border-gray-100 dark:border-primary/10 shadow-lg rounded-xl mt-1 p-1">
                  <DropdownMenuLabel className="text-canteen-dark dark:text-white flex items-center gap-3 p-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint/70 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-primary/10"/>
                  <DropdownMenuItem asChild className="text-canteen-darkgray dark:text-gray-300 hover:bg-canteen-lightgray dark:hover:bg-primary/10 hover:text-canteen-teal dark:hover:text-primary focus:bg-canteen-lightgray dark:focus:bg-primary/10 cursor-pointer py-2.5 px-3 rounded-lg my-1">
                    <Link to="/profile" className="flex items-center">
                      <span>Το προφίλ μου</span>
                      <ChevronRight size={14} className="ml-auto opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-canteen-darkgray dark:text-gray-300 hover:bg-canteen-lightgray dark:hover:bg-primary/10 hover:text-canteen-teal dark:hover:text-primary focus:bg-canteen-lightgray dark:focus:bg-primary/10 cursor-pointer py-2.5 px-3 rounded-lg my-1">
                    <Link to="/order-history" className="flex items-center">
                      <span>Ιστορικό παραγγελιών</span>
                      <ChevronRight size={14} className="ml-auto opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 dark:bg-primary/10"/>
                  <DropdownMenuItem onClick={logout} className="text-canteen-coral dark:text-canteen-coral hover:bg-canteen-coral/10 focus:bg-canteen-coral/10 hover:text-canteen-coral dark:hover:text-canteen-coral cursor-pointer py-2.5 px-3 rounded-lg my-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 shadow-md"
                >
                  Σύνδεση
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-card border-b border-gray-100 dark:border-primary/10 shadow-lg transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <nav className="flex flex-col p-4 gap-2">
          <MobileNavLink to="/" isActive={isActive('/')} isDark={isDarkMode}>
            Αρχική
          </MobileNavLink>
          <MobileNavLink to="/menu" isActive={isActive('/menu')} isDark={isDarkMode}>
            Κατάλογος
          </MobileNavLink>
          <MobileNavLink to="/order-status" isActive={isActive('/order-status')} isDark={isDarkMode}>
            Κατάσταση Παραγγελίας
          </MobileNavLink>
          <MobileNavLink to="/contact" isActive={isActive('/contact')} isDark={isDarkMode}>
            Επικοινωνία
          </MobileNavLink>
          
          {!isAuthenticated && (
            <Link to="/login" className="w-full mt-2">
              <Button className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white w-full transition-colors duration-300 shadow-md rounded-lg py-5">
                Σύνδεση
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<{ to: string; isActive: boolean; isDark: boolean; children: React.ReactNode }> = ({ 
  to, 
  isActive,
  isDark,
  children 
}) => {
  return (
    <Link 
      to={to} 
      className={`
        relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300
        ${isActive 
          ? isDark
            ? 'text-white bg-primary/10'
            : 'text-canteen-teal bg-canteen-lightgray' 
          : isDark
            ? 'text-gray-400 hover:text-white hover:bg-primary/10'
            : 'text-canteen-darkgray hover:text-canteen-teal hover:bg-canteen-lightgray'
        }
      `}
    >
      {children}
      {isActive && (
        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary' : 'bg-canteen-teal'}`}></span>
      )}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink: React.FC<{ to: string; isActive: boolean; isDark: boolean; children: React.ReactNode }> = ({ 
  to, 
  isActive,
  isDark,
  children 
}) => {
  return (
    <Link 
      to={to} 
      className={`
        px-4 py-3 rounded-lg text-base transition-all duration-300
        ${isActive 
          ? isDark
            ? 'bg-primary/10 text-white font-medium'
            : 'bg-canteen-lightgray text-canteen-teal font-medium' 
          : isDark
            ? 'text-gray-300 hover:bg-primary/10 hover:text-white'
            : 'text-canteen-darkgray hover:bg-canteen-lightgray hover:text-canteen-teal'
        }
      `}
    >
      {children}
    </Link>
  );
};

export default Navbar;
