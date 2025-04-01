import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

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
    
    if (savedTheme === 'dark' || savedTheme === null) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      // Default to dark mode if no saved preference
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
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
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 