
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
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Μαθητής Δοκιμαστικός',
    email: 'student@example.com',
    password: 'password123',
    role: 'student' as const
  },
  {
    id: '2',
    name: 'Διαχειριστής',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('smartCanteenUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('smartCanteenUser', JSON.stringify(userWithoutPassword));
        toast.success('Επιτυχής σύνδεση!');
      } else {
        throw new Error('Λανθασμένο email ή κωδικός πρόσβασης');
      }
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
      const { password, ...userWithoutPassword } = MOCK_USERS[0];
      setUser(userWithoutPassword);
      localStorage.setItem('smartCanteenUser', JSON.stringify(userWithoutPassword));
      toast.success('Επιτυχής σύνδεση με Google!');
    } catch (error) {
      toast.error('Αποτυχία σύνδεσης με Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Το email χρησιμοποιείται ήδη');
      }
      
      // For demo purposes, we'll just log in the user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        role: 'student' as const
      };
      
      setUser(newUser);
      localStorage.setItem('smartCanteenUser', JSON.stringify(newUser));
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
    localStorage.removeItem('smartCanteenUser');
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
      logout
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
