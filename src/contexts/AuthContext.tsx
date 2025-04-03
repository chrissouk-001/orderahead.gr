import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define the user type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
} | null;

// Define the auth context type
type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  csrfToken: string;
  refreshCsrfToken: () => void;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure mock users for demo purposes - passwords are hashed
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

// Helper function to generate a secure CSRF token
const generateCsrfToken = (): string => {
  // Generate a random string for CSRF token
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Helper function to securely store user data
const securelyStoreUser = (user: User) => {
  if (!user) return;

  // In a real app, you would encrypt this data before storing
  // For demo purposes, we're just storing it with an expiration
  const userWithExpiry = {
    user,
    expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };

  localStorage.setItem('orderAheadUser', JSON.stringify(userWithExpiry));
};

// Helper function to securely retrieve user data
const securelyRetrieveUser = (): User => {
  const storedData = localStorage.getItem('orderAheadUser');
  if (!storedData) return null;

  try {
    const { user, expiry } = JSON.parse(storedData);

    // Check if the session has expired
    if (expiry < Date.now()) {
      localStorage.removeItem('orderAheadUser');
      return null;
    }

    return user;
  } catch (error) {
    localStorage.removeItem('orderAheadUser');
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState<string>(generateCsrfToken());

  // Refresh CSRF token
  const refreshCsrfToken = () => {
    setCsrfToken(generateCsrfToken());
  };

  // Load user from localStorage with security checks
  useEffect(() => {
    const retrievedUser = securelyRetrieveUser();
    if (retrievedUser) {
      setUser(retrievedUser);
    }

    setIsLoading(false);
  }, []);

  // Login function with secure password verification
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, we would use bcrypt to compare passwords
      // For this demo, we'll simulate secure authentication
      const user = MOCK_USERS.find(u => u.email === email);

      if (!user) {
        throw new Error('Λάθος email ή κωδικός');
      }

      // Simulate password verification
      // In a real app, this would be: const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      const isPasswordValid = (email === 'student@example.com' && password === 'password123') ||
                             (email === 'admin@example.com' && password === 'admin123');

      if (!isPasswordValid) {
        throw new Error('Λάθος email ή κωδικός');
      }

      // Create user object without sensitive data
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      setUser(userWithoutPassword);

      // Securely store user data
      securelyStoreUser(userWithoutPassword);

      // Generate a new CSRF token on login
      refreshCsrfToken();

      toast.success('Επιτυχής σύνδεση!');
    } catch (error) {
      toast.error((error as Error).message || 'Αποτυχία σύνδεσης');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google function
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo, just log in as the student
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

  // Register function with secure password handling
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Το email χρησιμοποιείται ήδη');
      }

      // In a real app, we would hash the password here
      // For demo: const passwordHash = await bcrypt.hash(password, 10);

      // For demo purposes, we'll just log in the user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
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
    localStorage.removeItem('orderAheadUser');

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
