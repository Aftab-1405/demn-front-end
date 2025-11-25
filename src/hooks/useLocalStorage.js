import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - SSR-safe (doesn't break on server-side rendering)
 * - Error handling for localStorage operations
 * - State synchronization across components
 * - Type-safe with proper error boundaries
 *
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, Function, Function]} [storedValue, setValue, removeValue]
 *
 * @example
 * const [token, setToken, removeToken] = useLocalStorage('token', null);
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      if (item === null) {
        return initialValue;
      }

      // Try to parse as JSON, if it fails, return the raw value
      try {
        return JSON.parse(item);
      } catch {
        // If parsing fails, it's likely a plain string
        return item;
      }
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== 'undefined') {
          if (valueToStore === null || valueToStore === undefined) {
            window.localStorage.removeItem(key);
          } else {
            // Serialize to JSON if it's an object, otherwise store as string
            const serializedValue = typeof valueToStore === 'string'
              ? valueToStore
              : JSON.stringify(valueToStore);
            window.localStorage.setItem(key, serializedValue);
          }
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Function to remove the value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch {
          setStoredValue(e.newValue);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
