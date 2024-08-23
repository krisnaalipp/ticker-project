import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
    // Initialize state with localStorage value or default to initialValue
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    // Function to remove the item from localStorage
    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing localStorage key “${key}”:`, error);
        }
    };

    // Update localStorage when storedValue changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, storedValue, removeItem]);

    // Function to set a new value
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            setStoredValue(prevValue => {
                const newValue = value instanceof Function ? value(prevValue) : value;
                window.localStorage.setItem(key, JSON.stringify(newValue));
                return newValue;
            });
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    };

    return [storedValue, setValue, removeItem] as const;
}

export default useLocalStorage;
