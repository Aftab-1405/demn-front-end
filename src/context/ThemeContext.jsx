import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '../theme/muiTheme';
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Use custom hook for theme persistence (defaults to 'dark')
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const isDarkMode = theme === 'dark';

  // State to track if theme is transitioning
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoize MUI theme to prevent unnecessary re-creation
  const muiTheme = useMemo(() => {
    return createAppTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {

    // Add transitioning class for smooth theme switch
    document.documentElement.classList.add('theme-transitioning');
    setIsTransitioning(true);

    // Set theme attribute
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Remove transitioning class after animation completes
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    isTransitioning,
  }), [isDarkMode, isTransitioning]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
