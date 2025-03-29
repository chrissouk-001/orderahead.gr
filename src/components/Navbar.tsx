import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    // Check if dark class is already applied (could be from server-side)
    const isDarkActive = document.documentElement.classList.contains('dark');
    
    if (isDarkActive) {
      setIsDarkMode(true);
      return;
    }
    
    // Otherwise, check saved preference and system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      // No saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    }
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    // Use functional state update to ensure we're working with latest state
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      return newMode;
    });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0f172a] shadow-sm border-b border-gray-200 dark:border-primary/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center group">
            <div className="bg-canteen-teal dark:bg-primary rounded-full p-1.5 mr-2 overflow-hidden transform transition-all duration-300 group-hover:scale-110">
              <img 
                src="https://img.freepik.com/premium-vector/school-food-logo-design-template_145155-2789.jpg?w=826" 
                alt="Smart Canteen Atsoglou Logo" 
                className="h-8 w-8 rounded-full" 
              />
            </div>
            <span className="text-xl font-bold text-canteen-dark dark:text-white transition-colors duration-300 flex flex-col md:flex-row">
              <span className="mr-1">Smart Canteen</span> 
              <span className="text-canteen-teal dark:text-primary transition-colors duration-300">Atsoglou</span>
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
                  ? "bg-[#141d30] text-primary border-primary/20 hover:bg-[#141d30]/90 hover:text-primary hover:border-primary" 
                  : "rounded-full hover:bg-gray-100 text-canteen-dark"
                }`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={18} className="animate-pulse-gentle" /> : <Moon size={18} />}
            </Button>
            
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="relative inline-flex items-center p-2 text-canteen-dark dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-canteen-teal dark:bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 animate-pulse-gentle">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-[#141d30]/70 transition-colors duration-300">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#141d30] border-gray-200 dark:border-primary/20 shadow-lg rounded-lg mt-1">
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
                  className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white rounded-full px-4 transition-all duration-300 transform hover:scale-105"
                >
                  Σύνδεση
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-[#141d30]/70 transition-colors duration-300"
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
        className={`md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-[#0f172a] shadow-lg border-b border-gray-200 dark:border-primary/20 transition-all duration-300 ${
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
              <Button className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white w-full transition-colors duration-300">
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
      className={`relative text-base font-medium py-1 transition-colors duration-300 ${
        isActive 
          ? 'text-canteen-teal dark:text-primary font-semibold' 
          : 'text-gray-700 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary'
      }`}
    >
      {children}
      <span className={`absolute bottom-[-4px] left-0 h-[3px] ${isDark ? 'bg-primary' : 'bg-canteen-teal'} transition-all duration-300 rounded-full ${
        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
      }`}></span>
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
      className={`p-3 flex justify-between items-center rounded-lg transition-colors duration-300 ${
        isActive 
          ? isDark 
            ? 'bg-primary/10 text-primary font-semibold' 
            : 'bg-canteen-teal/10 text-canteen-teal font-semibold'
          : 'text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-[#141d30] hover:text-canteen-teal dark:hover:text-primary'
      }`}
    >
      <span>{children}</span>
      {isActive && <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-primary' : 'bg-canteen-teal'}`}></div>}
    </Link>
  );
};

export default Navbar;
