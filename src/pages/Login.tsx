import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Το email είναι υποχρεωτικό';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Μη έγκυρη διεύθυνση email';
    }
    
    if (!password) {
      newErrors.password = 'Ο κωδικός είναι υποχρεωτικός';
    } else if (password.length < 6) {
      newErrors.password = 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Η σύνδεση έγινε με επιτυχία!');
      navigate('/');
    } catch (error) {
      toast.error('Αποτυχία σύνδεσης. Ελέγξτε τα στοιχεία σας και προσπαθήστε ξανά.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    toast.info('Η σύνδεση με Google θα είναι διαθέσιμη σύντομα!');
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-canteen-teal/10 dark:bg-primary/10 rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-canteen-yellow/10 dark:bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-canteen-coral/5 dark:bg-canteen-coral/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-md z-10">
          <Card className="border border-gray-100 dark:border-primary/10 shadow-xl dark:shadow-primary/5 backdrop-blur-sm bg-white/90 dark:bg-card/90">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Καλώς ορίσατε ξανά</CardTitle>
              <CardDescription>
                Συνδεθείτε στον λογαριασμό σας για να συνεχίσετε
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="email" 
                      className="text-sm font-medium text-canteen-darkgray dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-canteen-darkgray dark:text-gray-400">
                        <Mail size={18} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className={`pl-10 ${errors.email ? 'border-canteen-coral dark:border-canteen-coral focus:ring-canteen-coral/20 dark:focus:ring-canteen-coral/20' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <div className="text-canteen-coral dark:text-canteen-coral text-sm flex items-center mt-1.5">
                        <AlertCircle size={14} className="mr-1.5" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="password" 
                        className="text-sm font-medium text-canteen-darkgray dark:text-gray-300"
                      >
                        Κωδικός πρόσβασης
                      </Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-canteen-teal hover:text-canteen-teal/80 dark:text-primary dark:hover:text-primary/80 transition-colors"
                      >
                        Ξεχάσατε τον κωδικό;
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-canteen-darkgray dark:text-gray-400">
                        <Lock size={18} />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pl-10 ${errors.password ? 'border-canteen-coral dark:border-canteen-coral focus:ring-canteen-coral/20 dark:focus:ring-canteen-coral/20' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary transition-colors"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-canteen-coral dark:text-canteen-coral text-sm flex items-center mt-1.5">
                        <AlertCircle size={14} className="mr-1.5" />
                        {errors.password}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label 
                        htmlFor="remember" 
                        className="text-sm text-canteen-darkgray dark:text-gray-400 leading-none cursor-pointer"
                      >
                        Να με θυμάσαι
                      </label>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Σύνδεση...' : 'Σύνδεση'} {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-primary/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-card px-4 text-sm text-canteen-darkgray dark:text-gray-400">
                    ή συνεχίστε με
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-white hover:bg-gray-50 dark:bg-card dark:hover:bg-card/80 text-canteen-dark dark:text-white border border-gray-200 dark:border-primary/10 py-6"
                onClick={handleGoogleLogin}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" className="mr-2 h-4 w-4">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Σύνδεση με Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-canteen-darkgray dark:text-gray-400">
                Δεν έχετε λογαριασμό;{' '}
                <Link 
                  to="/register" 
                  className="text-canteen-teal hover:text-canteen-teal/80 dark:text-primary dark:hover:text-primary/80 font-medium transition-colors"
                >
                  Εγγραφείτε
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
