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
    <header className="sticky top-0 z-50 bg-white dark:bg-background shadow-md border-b border-gray-200 dark:border-primary/20 backdrop-blur-sm bg-white/90 dark:bg-background/95 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <div className="bg-canteen-teal dark:bg-primary rounded-full p-1.5 mr-2 overflow-hidden transform transition-all duration-300 group-hover:scale-110 shadow-md">
              <img 
                src="/OrderAhead-logo.svg" 
                alt="OrderAhead.gr Logo" 
                className="h-8 w-8 rounded-full" 
              />
            </div>
            <span className="text-xl font-bold text-canteen-dark dark:text-white transition-colors duration-300 flex flex-col md:flex-row">
              <span className="mr-1">Order</span> 
              <span className="text-canteen-teal dark:text-primary transition-colors duration-300">Ahead.gr</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={isActive('/')} isDark={isDarkMode}>
              Αρχική
            </NavLink>
            <NavLink to="/menu" isActive={isActive('/menu')} isDark={isDarkMode}>
              Κατάλογος
            </NavLink>
            <NavLink to="/order-status" isActive={isActive('/order-status')} isDark={isDarkMode}>
              Κατάσταση Παραγγελίας
            </NavLink>
            <NavLink to="/contact" isActive={isActive('/contact')} isDark={isDarkMode}>
              Επικοινωνία
            </NavLink>
          </nav>
          
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle Button */}
            <Button 
              variant={isDarkMode ? "outline" : "ghost"} 
              size="icon" 
              onClick={toggleDarkMode} 
              className={`
                transition-all duration-300 
                ${isDarkMode 
                  ? "bg-card text-primary border-primary/20 hover:bg-card/90 hover:text-primary hover:border-primary shadow-inner" 
                  : "rounded-full hover:bg-gray-100 text-canteen-dark shadow-sm"
                }`}
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
                className="relative inline-flex items-center p-2 text-canteen-dark dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-canteen-teal dark:bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-card/70 transition-colors duration-300">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border-gray-200 dark:border-primary/20 shadow-lg rounded-lg mt-1">
                  <DropdownMenuLabel className="text-canteen-dark dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-canteen-teal/20 dark:bg-primary/20 flex items-center justify-center text-canteen-teal dark:text-primary font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-muted"/>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted/50 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300 rounded cursor-pointer">
                    <Link to="/profile" className="flex items-center">
                      <span>Το προφίλ μου</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted/50 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300 rounded cursor-pointer">
                    <Link to="/order-history" className="flex items-center">
                      <span>Ιστορικό παραγγελιών</span>
                      <ChevronRight size={16} className="ml-auto" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-muted"/>
                  <DropdownMenuItem onClick={logout} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 transition-colors duration-300 rounded cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button 
                  className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white rounded-full px-4 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Σύνδεση
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-card/70 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-background shadow-lg border-b border-gray-200 dark:border-primary/20 transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <nav className="flex flex-col space-y-1 p-4">
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
            <Link to="/login" className="w-full mt-4">
              <Button className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white w-full transition-colors duration-300 shadow-md">
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
      className={`relative text-base font-medium py-1 transition-all duration-300 ${
        isActive 
          ? "text-canteen-teal dark:text-primary"
          : "text-canteen-dark/80 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary"
      }`}
    >
      {children}
      <span 
        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-canteen-teal dark:bg-primary transform origin-left transition-transform duration-300 ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        } group-hover:scale-x-100`}
      />
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
      className={`flex items-center py-3 px-4 rounded-md transition-colors duration-300 ${
        isActive 
          ? "bg-canteen-teal/10 dark:bg-primary/10 text-canteen-teal dark:text-primary font-medium"
          : "text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-card"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
