import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Sun, Moon } from 'lucide-react';
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
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-background border-b border-gray-200 dark:border-border transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <img 
            src="https://img.freepik.com/premium-vector/school-food-logo-design-template_145155-2789.jpg?w=826" 
            alt="Smart Canteen Atsoglou Logo" 
            className="h-10 w-auto mr-2 rounded-md" 
          />
          <span className="text-xl font-bold text-canteen-dark dark:text-white transition-colors duration-300">
            Smart Canteen <span className="text-canteen-teal dark:text-primary transition-colors duration-300">Atsoglou</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
            Αρχική
          </Link>
          <Link to="/menu" className="text-gray-700 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
            Κατάλογος
          </Link>
          <Link to="/order-status" className="text-gray-700 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
            Κατάσταση Παραγγελίας
          </Link>
          <Link to="/contact" className="text-gray-700 dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
            Επικοινωνία
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle Button */}
          <Button 
            variant={isDarkMode ? "outline" : "ghost"} 
            size="icon" 
            onClick={toggleDarkMode} 
            className={`
              transition-all duration-300 
              ${isDarkMode 
                ? "bg-card text-primary border-border hover:bg-card hover:text-secondary hover:border-primary" 
                : "text-canteen-dark hover:bg-gray-100"
              } rounded-full`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun size={18} className="animate-pulse" /> : <Moon size={18} />}
          </Button>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/cart" 
                className="relative inline-flex items-center p-2 text-canteen-dark dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-canteen-teal dark:bg-primary text-white dark:text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center transition-colors duration-300">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-canteen-dark dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-card/70 transition-colors duration-300">
                    <User size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-card border-gray-200 dark:border-border shadow-md dark:shadow-black/20">
                  <DropdownMenuLabel className="text-canteen-dark dark:text-white">{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-muted"/>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted/50 transition-colors duration-300">
                    <Link to="/profile">Το προφίλ μου</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-muted/50 transition-colors duration-300">
                    <Link to="/order-history">Ιστορικό παραγγελιών</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors duration-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Αποσύνδεση</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" className="text-canteen-dark dark:text-muted-foreground hover:text-canteen-teal dark:hover:text-primary transition-colors duration-300">
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
