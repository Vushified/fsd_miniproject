import { useState, useEffect } from 'react';

// Custom hook to debounce fast changing values like search inputs
// Avoids filtering or hitting the backend on every single keystroke
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer if value changes before delay runs out (demonstrates useEffect cleanup)
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

