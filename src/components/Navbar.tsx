/**
 * Navbar.tsx
 * 
 * Main navigation component for the application featuring:
 * - Responsive design with mobile menu
 * - User authentication controls
 * - Shopping cart access with item count
 * - Theme switcher (light/dark/system)
 * - Scroll-aware styling
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronRight,
  LaptopIcon 
} from 'lucide-react';
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar component - Main navigation header that appears on all pages
 * Handles responsive display, user authentication UI, cart access,
 * and theme switching
 */
const Navbar: React.FC = () => {
  // Access authentication, cart and theme contexts
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { theme, setTheme, isDarkMode } = useTheme();
  
  // State for mobile menu and scroll detection
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  /**
   * Close the mobile menu when route changes
   * Prevents menu from staying open after navigation
   */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  /**
   * Add scroll detection to change navbar appearance when scrolling
   * Adds background blur and shadow when scrolled
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  /**
   * Check if a navigation link is active based on current route
   * 
   * @param path - The path to check against current location
   * @returns Boolean indicating if this is the active route
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/90 dark:bg-background/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-primary/10' 
        : 'bg-white dark:bg-transparent dark:backdrop-blur-none'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and branding */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              className="bg-gradient-to-br from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint rounded-full p-1.5 overflow-hidden shadow-md"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img 
                src="/OrderAhead-logo.svg" 
                alt="OrderAhead.gr Logo" 
                className="h-6 w-6 rounded-full" 
              />
            </motion.div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-canteen-dark to-canteen-teal dark:from-white dark:to-primary transition-colors duration-300">
              OrderAhead.gr
            </span>
          </Link>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-2">
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
          
          {/* Right side actions: Theme, Cart, User Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-gray-100 dark:bg-gray-800/20 hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors h-10 w-10 sm:h-10 sm:w-10 touch-manipulation"
                >
                  {theme === 'dark' ? (
                    <Moon size={20} className="text-indigo-400" />
                  ) : theme === 'light' ? (
                    <Sun size={20} className="text-yellow-500" />
                  ) : (
                    <LaptopIcon size={20} className="text-blue-400" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[150px] bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-1 p-1">
                  {/* Light Theme Option */}
                  <DropdownMenuItem 
                    onClick={() => setTheme('light')} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded cursor-pointer ${
                      theme === 'light' 
                        ? 'bg-gray-100 dark:bg-gray-800 text-yellow-600 dark:text-yellow-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Sun size={18} className="text-yellow-500" />
                    <span>Φωτεινό</span>
                  </DropdownMenuItem>
                  {/* Dark Theme Option */}
                  <DropdownMenuItem 
                    onClick={() => setTheme('dark')} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Moon size={18} className="text-indigo-400" />
                    <span>Σκοτεινό</span>
                  </DropdownMenuItem>
                  {/* System Theme Option */}
                  <DropdownMenuItem 
                    onClick={() => setTheme('system')} 
                    className={`flex items-center gap-2 px-3 py-2.5 rounded cursor-pointer ${
                      theme === 'system' 
                        ? 'bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <LaptopIcon size={18} className="text-blue-400" />
                    <span>Σύστημα</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Shopping Cart Button with Item Count */}
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative inline-flex items-center justify-center h-10 w-10 sm:h-10 sm:w-10 rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10 touch-manipulation"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {/* Animated item count badge */}
                {getTotalItems() > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 bg-canteen-coral dark:bg-canteen-coral text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </Link>
            )}
            
            {/* User Menu (when authenticated) or Login Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary hover:bg-canteen-lightgray dark:hover:bg-primary/10 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border-gray-100 dark:border-primary/10 shadow-lg rounded-xl mt-1 p-1">
                  {/* User profile summary */}
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
              <Link to="/login" className="md:inline-flex hidden">
                <Button className="bg-canteen-teal dark:bg-primary hover:bg-canteen-teal/90 text-white px-4 py-2 rounded-lg">
                  Σύνδεση
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="inline-flex md:hidden items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800/30 touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu - Only visible on small screens */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-white dark:bg-card border-b border-gray-100 dark:border-primary/10 shadow-lg overflow-hidden"
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

/**
 * NavLink component - Styled navigation link for desktop menu
 * Handles active state styling
 */
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
        <motion.span 
          layoutId="activeNavIndicator"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary' : 'bg-canteen-teal'}`}
        ></motion.span>
      )}
    </Link>
  );
};

/**
 * MobileNavLink component - Styled navigation link for mobile menu
 * Includes animations and active state styling
 */
const MobileNavLink: React.FC<{ to: string; isActive: boolean; isDark: boolean; children: React.ReactNode }> = ({ 
  to, 
  isActive,
  isDark,
  children 
}) => {
  return (
    <Link
      to={to}
      className={`relative flex items-center w-full px-4 py-3 text-base rounded-lg transition-colors ${
        isActive
          ? `bg-gradient-to-r from-canteen-teal/10 to-canteen-mint/10 dark:from-primary/20 dark:to-primary/5 
             text-canteen-teal dark:text-primary font-medium`
          : `text-canteen-dark dark:text-white 
             hover:bg-gray-100 dark:hover:bg-gray-800/30`
      }`}
    >
      <span>{children}</span>
      {isActive && (
        <motion.span
          layoutId="mobile-nav-indicator"
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint rounded-r-full`}
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        />
      )}
    </Link>
  );
};

export default Navbar;
