import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Παρακαλώ συμπληρώστε όλα τα πεδία');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/menu');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/menu');
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch bg-gray-50 dark:bg-background transition-colors duration-300">
      {/* Left Panel - Decorative/Brand Section */}
      <div className="md:w-1/2 bg-gradient-to-br from-canteen-teal to-canteen-dark dark:from-primary dark:to-background p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid-bg w-full h-full"></div>
        </div>
        
        {/* Animated circles/blobs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-canteen-yellow dark:bg-accent opacity-20 rounded-full filter blur-xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-canteen-orange dark:bg-secondary opacity-20 rounded-full filter blur-xl animate-blob animation-delay-2000"></div>
        
        {/* Login illustration */}
        <div className="relative z-10 mb-12 animate-float">
          <img 
            src="/images/login-illustration.jpg" 
            alt="Smart Canteen" 
            className="max-w-xs mx-auto rounded-lg shadow-xl"
          />
        </div>
        
        <div className="relative z-10 text-white max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">Smart Canteen Solution</h1>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="rounded-full bg-white dark:bg-primary w-5 h-5 flex items-center justify-center">
                  <ChevronRight size={14} className="text-canteen-teal dark:text-background" />
                </div>
              </div>
              <p className="ml-3 text-sm md:text-base">Παραγγείλτε γρήγορα και εύκολα από το κινητό σας</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="rounded-full bg-white dark:bg-primary w-5 h-5 flex items-center justify-center">
                  <ChevronRight size={14} className="text-canteen-teal dark:text-background" />
                </div>
              </div>
              <p className="ml-3 text-sm md:text-base">Αποφύγετε τις ουρές στο κυλικείο</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="rounded-full bg-white dark:bg-primary w-5 h-5 flex items-center justify-center">
                  <ChevronRight size={14} className="text-canteen-teal dark:text-background" />
                </div>
              </div>
              <p className="ml-3 text-sm md:text-base">Εξοικονομήστε χρόνο από το διάλειμμά σας</p>
            </div>
          </div>
        </div>
        
        {/* Animated wave effect at bottom */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-canteen-dark dark:text-white mb-2">Σύνδεση</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Συνδεθείτε στο λογαριασμό σας για να συνεχίσετε</p>
          </div>
          
          {formError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-md flex items-center text-red-700 dark:text-red-400 text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 bg-white dark:bg-card border-gray-200 dark:border-gray-800 focus:border-canteen-teal dark:focus:border-primary focus:ring-canteen-teal dark:focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Κωδικός</Label>
                <Link to="/forgot-password" className="text-xs text-canteen-teal dark:text-primary hover:underline">
                  Ξεχάσατε τον κωδικό;
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-white dark:bg-card border-gray-200 dark:border-gray-800 focus:border-canteen-teal dark:focus:border-primary focus:ring-canteen-teal dark:focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Σύνδεση...' : 'Σύνδεση'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-background text-gray-500 dark:text-gray-400">ή συνεχίστε με</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-gray-200 dark:border-gray-800 bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-card/70" 
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Google
          </Button>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Δεν έχετε λογαριασμό;{' '}
              <Link to="/register" className="text-canteen-teal dark:text-primary font-medium hover:underline">
                Εγγραφείτε
              </Link>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              Απλή διαδικασία, χωρίς αναμονή
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
