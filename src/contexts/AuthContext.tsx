/**
 * AuthContext.tsx
 * 
 * Provides authentication functionality throughout the application:
 * - User login/logout/registration
 * - Session management with secure storage
 * - CSRF protection
 * - Mock authentication for demonstration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { 
  comparePassword, 
  hashPassword, 
  generateCsrfToken, 
  sanitizeInput,
  isStrongPassword 
} from '../utils/security';
import {
  securelyStoreData,
  securelyRetrieveData,
  securelyRemoveData
} from '../utils/sessionStorage';

/**
 * User type definition
 * Represents an authenticated user or null when not logged in
 */
type User = {
  id: string;         // Unique identifier
  name: string;       // User's display name
  email: string;      // User's email address (used for login)
  role: 'student' | 'admin'; // User role for permission control
} | null;

/**
 * AuthContext type definition
 * Defines the shape of the authentication context
 */
type AuthContextType = {
  user: User;                     // Current user or null
  isAuthenticated: boolean;       // Whether a user is logged in
  isLoading: boolean;             // Loading state during auth operations
  login: (email: string, password: string) => Promise<void>; // Email login
  loginWithGoogle: () => Promise<void>;                      // Google OAuth login
  register: (name: string, email: string, password: string) => Promise<void>; // User registration
  logout: () => void;             // User logout
  csrfToken: string;              // CSRF protection token
  refreshCsrfToken: () => void;   // Generate new CSRF token
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Mock user data for demonstration purposes
 * In a real application, this would be stored in a database
 * Passwords are bcrypt hashed for security
 */
const MOCK_USERS = [
  {
    id: '1',
    name: 'Μαθητής Δοκιμαστικός',
    email: 'student@example.com',
    // This is a hashed version of 'password123'
    passwordHash: '$2a$10$rBSGqxWdGgTXldsZ9qVxj.zXGjHsNnzUZEbJL7.QGfb4WxDWEXOLe',
    role: 'student' as const
  },
  {
    id: '2',
    name: 'Διαχειριστής',
    email: 'admin@example.com',
    // This is a hashed version of 'admin123'
    passwordHash: '$2a$10$rIU1rRTbr7bBxdL5jHIe9.6FVcB.FiQbVvdXb9Ywm4ik/mMQmfE3e',
    role: 'admin' as const
  }
];

// User storage key for secure localStorage
const USER_STORAGE_KEY = 'orderAheadUserSecure';

/**
 * Generate a cryptographically secure CSRF token
 * Used to protect against Cross-Site Request Forgery attacks
 */
const generateSecureCsrfToken = (): string => {
  return generateCsrfToken();
};

/**
 * Securely store user data with expiration
 * @param user - User object to store
 */
const securelyStoreUser = (user: User) => {
  if (!user) return;
  securelyStoreData(USER_STORAGE_KEY, user, 24 * 60); // 24 hours
};

/**
 * Securely retrieve user data with validation
 * @returns User object if valid and not expired, null otherwise
 */
const securelyRetrieveUser = (): User => {
  return securelyRetrieveData<User>(USER_STORAGE_KEY);
};

/**
 * AuthProvider component
 * Manages authentication state and provides auth functionality
 * to all child components
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string>(generateSecureCsrfToken());

  /**
   * Generate a new CSRF token
   * Should be called after authentication state changes
   */
  const refreshCsrfToken = () => {
    setCsrfToken(generateSecureCsrfToken());
  };

  /**
   * On component mount, try to restore user session
   * from secure storage if available
   */
  useEffect(() => {
    const retrievedUser = securelyRetrieveUser();
    if (retrievedUser) {
      setUser(retrievedUser);
    }

    setIsLoading(false);
  }, []);

  /**
   * Authenticate a user with email and password
   * 
   * @param email - User's email address
   * @param password - User's password
   * @throws Error if authentication fails
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Sanitize inputs to prevent XSS
      const sanitizedEmail = sanitizeInput(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email in mock data
      // In a real app, this would be a database or API call
      const user = MOCK_USERS.find(u => u.email === sanitizedEmail);

      if (!user) {
        throw new Error('Λάθος email ή κωδικός');
      }

      // Verify password with proper timing-safe comparison
      let isPasswordValid = false;
      
      if (process.env.NODE_ENV === 'production') {
        // Use real bcrypt comparison in production
        isPasswordValid = await comparePassword(password, user.passwordHash);
      } else {
        // For development/demo purposes only - simplified check
        isPasswordValid = (sanitizedEmail === 'student@example.com' && password === 'password123') ||
                         (sanitizedEmail === 'admin@example.com' && password === 'admin123');
      }

      if (!isPasswordValid) {
        throw new Error('Λάθος email ή κωδικός');
      }

      // Create user object without sensitive data like password hash
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      setUser(userWithoutPassword);

      // Securely store user data for session persistence
      securelyStoreUser(userWithoutPassword);

      // Generate a new CSRF token on login for security
      refreshCsrfToken();

      toast.success('Επιτυχής σύνδεση!');
    } catch (error) {
      toast.error((error as Error).message || 'Αποτυχία σύνδεσης');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticate a user with Google OAuth
   * In this demo, it simulates the OAuth flow
   * 
   * @throws Error if authentication fails
   */
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, just log in as the student user
      const userWithoutPassword = {
        id: MOCK_USERS[0].id,
        name: MOCK_USERS[0].name,
        email: MOCK_USERS[0].email,
        role: MOCK_USERS[0].role
      };
      setUser(userWithoutPassword);

      // Securely store user data
      securelyStoreUser(userWithoutPassword);

      // Generate a new CSRF token on login
      refreshCsrfToken();

      toast.success('Επιτυχής σύνδεση με Google!');
    } catch (error) {
      toast.error('Αποτυχία σύνδεσης με Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user account
   * 
   * @param name - User's display name
   * @param email - User's email address
   * @param password - User's chosen password
   * @throws Error if registration fails or validation fails
   */
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Sanitize inputs to prevent XSS
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);
      
      // Check password strength with security requirements
      if (!isStrongPassword(password)) {
        throw new Error('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες, ένα κεφαλαίο, ένα πεζό, ένα αριθμό και ένα ειδικό χαρακτήρα');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === sanitizedEmail)) {
        throw new Error('Το email χρησιμοποιείται ήδη');
      }

      // Hash the password
      let passwordHash = '';
      
      if (process.env.NODE_ENV === 'production') {
        // Use real password hashing in production
        passwordHash = await hashPassword(password);
      }

      // For demo purposes, we'll just log in the user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name: sanitizedName,
        email: sanitizedEmail,
        role: 'student' as const
      };

      setUser(newUser);

      // Securely store user data
      securelyStoreUser(newUser);

      // Generate a new CSRF token on registration
      refreshCsrfToken();

      toast.success('Επιτυχής εγγραφή!');
    } catch (error) {
      toast.error((error as Error).message || 'Αποτυχία εγγραφής');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    securelyRemoveData(USER_STORAGE_KEY);

    // Generate a new CSRF token on logout
    refreshCsrfToken();

    toast.info('Αποσυνδεθήκατε επιτυχώς');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      loginWithGoogle,
      register,
      logout,
      csrfToken,
      refreshCsrfToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
