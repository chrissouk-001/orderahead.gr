/**
 * ThemeContext.tsx
 * 
 * Provides theme management functionality throughout the application:
 * - Light/dark theme switching
 * - System theme preference detection
 * - Theme persistence in localStorage
 * - Responsive theme updates based on system preference changes
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * ThemeProvider props type
 */
type ThemeProviderProps = {
  children: React.ReactNode;
};

/**
 * Available theme options
 * - light: Force light theme
 * - dark: Force dark theme
 * - system: Follow system preference
 */
type Theme = 'light' | 'dark' | 'system';

/**
 * Theme context type definition
 * Defines the shape of the theme context
 */
type ThemeContextType = {
  theme: Theme;                    // Current theme setting
  setTheme: (theme: Theme) => void; // Function to update theme
  isDarkMode: boolean;              // Whether dark mode is currently active
};

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component
 * Manages theme state and provides theme switching functionality
 * to all child components
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Apply the selected theme to the document
   * Updates the DOM with appropriate theme class
   * 
   * @param newTheme - The theme to apply
   */
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Toggle the 'dark' class on the root element
    root.classList.toggle('dark', isDark);
    setIsDarkMode(isDark);
  };

  /**
   * On component mount, initialize theme from localStorage
   * or fall back to system preference
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      applyTheme('system');
    }
  }, []);

  /**
   * Watch for changes in system color scheme preference
   * Updates theme automatically when in system mode
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  /**
   * Update theme and store preference in localStorage
   * 
   * @param newTheme - The new theme to set
   */
  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Provide theme context to child components
  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * Must be used within a ThemeProvider component
 * 
 * @returns Theme context with current theme and methods to update it
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 