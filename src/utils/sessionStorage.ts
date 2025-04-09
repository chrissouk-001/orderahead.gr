/**
 * sessionStorage.ts
 * 
 * This module provides secure client-side storage utilities with features like:
 * - Encryption simulation (would be actual encryption in production)
 * - Expiration-based storage
 * - Tamper detection via session ID validation
 * - Automatic cleanup of expired data
 */

import { generateSecureId } from './security';

// Define the type of data to be stored securely
type SecureStorageItem<T> = {
  data: T;        // The actual data being stored
  expiry: number; // Timestamp when this data expires
  id: string;     // Unique ID to verify data integrity
};

/**
 * Securely store data in localStorage with encryption simulation,
 * expiration, and tamper protection
 * 
 * @param key - Storage key identifier
 * @param data - The data to store
 * @param expiryInMinutes - How long to keep the data valid (default: 60 minutes)
 */
export const securelyStoreData = <T>(
  key: string, 
  data: T, 
  expiryInMinutes: number = 60 // Default 1 hour
): void => {
  // Generate a unique ID for this session store
  const sessionId = generateSecureId();
  
  // Create the storage item with expiry
  const storageItem: SecureStorageItem<T> = {
    data,
    expiry: Date.now() + (expiryInMinutes * 60 * 1000),
    id: sessionId
  };
  
  // In a real app, you would encrypt this data before storing
  // For demo purposes, we're storing it with expiration and session ID
  try {
    // Check if storage is available
    if (!isStorageAvailable('localStorage') || !isStorageAvailable('sessionStorage')) {
      console.warn('Storage not available - data will not persist');
      return;
    }
    
    localStorage.setItem(key, JSON.stringify(storageItem));
    
    // Store the session ID in a separate location as a secondary check
    sessionStorage.setItem(`${key}_session`, sessionId);
  } catch (error) {
    console.error('Error storing data securely:', error);
    // Clear potentially corrupted data
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(`${key}_session`);
    } catch (cleanupError) {
      console.error('Error cleaning up after storage failure:', cleanupError);
    }
  }
};

/**
 * Securely retrieve data from localStorage with validation
 * and tamper detection
 * 
 * @param key - Storage key identifier to retrieve
 * @returns The stored data if valid and not expired, null otherwise
 */
export const securelyRetrieveData = <T>(key: string): T | null => {
  // First check if storage is available
  if (!isStorageAvailable('localStorage') || !isStorageAvailable('sessionStorage')) {
    console.warn('Storage not available - cannot retrieve data');
    return null;
  }
  
  try {
    // Get both the data and the session ID
    const storedData = localStorage.getItem(key);
    const sessionId = sessionStorage.getItem(`${key}_session`);
    
    // If either is missing, the data is invalid
    if (!storedData || !sessionId) return null;
    
    const storageItem: SecureStorageItem<T> = JSON.parse(storedData);
    
    // Validate the data hasn't been tampered with
    if (storageItem.id !== sessionId) {
      console.warn('Possible session tampering detected');
      securelyRemoveData(key);
      return null;
    }
    
    // Check if the data has expired
    if (storageItem.expiry < Date.now()) {
      securelyRemoveData(key);
      return null;
    }
    
    return storageItem.data;
  } catch (error) {
    console.error('Error retrieving data securely:', error);
    try {
      securelyRemoveData(key);
    } catch (cleanupError) {
      console.error('Error cleaning up after retrieval failure:', cleanupError);
    }
    return null;
  }
};

/**
 * Securely remove data from both localStorage and sessionStorage
 * 
 * @param key - Storage key identifier to remove
 */
export const securelyRemoveData = (key: string): void => {
  if (!isStorageAvailable('localStorage') && !isStorageAvailable('sessionStorage')) {
    return;
  }
  
  try {
    if (isStorageAvailable('localStorage')) {
      localStorage.removeItem(key);
    }
    
    if (isStorageAvailable('sessionStorage')) {
      sessionStorage.removeItem(`${key}_session`);
    }
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

/**
 * Utility function to check if storage is available
 * 
 * @param type - The type of storage to check ('localStorage' or 'sessionStorage')
 * @returns boolean indicating if storage is available
 */
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const testKey = `__storage_test__${Math.random()}`;
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Extend the expiry time of stored data
 * 
 * @param key - Storage key identifier
 * @param additionalMinutes - Extra minutes to extend the expiry (default: 60 minutes)
 * @returns true if data was found and extended, false otherwise
 */
export const extendDataExpiry = <T>(
  key: string, 
  additionalMinutes: number = 60
): boolean => {
  if (!isStorageAvailable('localStorage') || !isStorageAvailable('sessionStorage')) {
    return false;
  }
  
  try {
    const data = securelyRetrieveData<T>(key);
    if (!data) return false;
    
    securelyStoreData(key, data, additionalMinutes);
    return true;
  } catch (error) {
    console.error('Error extending data expiry:', error);
    return false;
  }
}; 