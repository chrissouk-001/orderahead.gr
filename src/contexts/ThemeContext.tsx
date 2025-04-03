import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply theme
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    const isDark = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    root.classList.toggle('dark', isDark);
    setIsDarkMode(isDark);
  };

  // Initialize theme
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

  // Watch for system preference changes
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

  // Update theme when it changes
  const updateTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, isDarkMode }}>
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