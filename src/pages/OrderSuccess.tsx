import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Info, Sparkles, Watch, CalendarClock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

interface LocationState {
  orderNumber: number;
}

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [showConfetti, setShowConfetti] = useState(true);
  
  // If no order number, redirect to home
  useEffect(() => {
    if (!state || typeof state.orderNumber !== 'number') {
      navigate('/');
    }
    
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [state, navigate]);
  
  // Add animation styles
  useEffect(() => {
    // Create style element
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
    `;
    
    // Append to head
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  if (!state || typeof state.orderNumber !== 'number') {
    return null;
  }
  
  // Calculate estimated time based on order number (simple example)
  const estimatedTime = `${10 + state.orderNumber}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)}`;
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-[#0a1023] dark:to-[#0c1429] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-teal-500/30 dark:bg-teal-400/20"
                initial={{ 
                  top: "-10%", 
                  left: `${Math.random() * 100}%`,
                  scale: 0
                }}
                animate={{ 
                  top: "110%", 
                  scale: [0, 1.5, 0.5],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4,
                  ease: "easeOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`circle-${i}`}
                className="absolute w-3 h-3 rounded-full bg-green-500/30 dark:bg-green-400/20"
                initial={{ 
                  top: "-5%", 
                  left: `${Math.random() * 100}%`,
                  scale: 0 
                }}
                animate={{ 
                  top: "110%", 
                  scale: [0, 2, 0.5],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 3,
                  ease: "easeOut",
                  delay: 0.5 + Math.random() * 2
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 z-10">
        <motion.div 
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* Background card with shadow */}
            <div className="absolute inset-0 bg-white dark:bg-[#141d30] rounded-3xl shadow-xl transform rotate-1 scale-[1.03] opacity-50 dark:opacity-30 -z-10"></div>
            
            {/* Main content card */}
            <div className="bg-white dark:bg-[#141d30] rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden border border-gray-100 dark:border-gray-800/20">
              {/* Top wave decoration */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-green-500 to-teal-600"></div>
              
              <div className="text-center">
                {/* Success icon with animation */}
                <motion.div 
                  className="relative inline-flex items-center justify-center w-20 h-20 mb-6 mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/20 animate-pulse"></div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div className="absolute -inset-1 rounded-full border-2 border-green-200 dark:border-green-700/30 border-dashed animate-spin-slow"></div>
                </motion.div>
                
                {/* Order completed message with animation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                    Η παραγγελία σας ολοκληρώθηκε!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Σας ευχαριστούμε για την παραγγελία σας στο Smart Canteen Atsoglou.
                  </p>
                </motion.div>
                
                {/* Order details with animation */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-5 text-left"
                >
                  <div className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-[#0c1429] border border-gray-100 dark:border-gray-800/20">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="flex flex-grow justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Αριθμός παραγγελίας:</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{state.orderNumber}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-[#0c1429] border border-gray-100 dark:border-gray-800/20">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <CalendarClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex flex-grow justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Εκτιμώμενος χρόνος:</span>
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{estimatedTime}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Pickup instructions with animation */}
            <motion.div 
              className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-5 rounded-xl mb-8 text-left border border-teal-100 dark:border-teal-800/20 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2 className="font-bold text-gray-900 dark:text-gray-200 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                Οδηγίες παραλαβής
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Μόλις πάρετε τον αριθμό σας, θα ακούσετε/δείτε την σειρά σας.
                Παρακαλούμε πλησιάστε στο ταμείο του κυλικείου για την
                παραλαβή της παραγγελίας σας.
              </p>
            </motion.div>
            
            {/* Buttons with animation */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50 transition-all duration-300"
                asChild
              >
                <Link to="/order-status">
                  Έλεγχος κατάστασης παραγγελίας
                </Link>
              </Button>
              
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-700 shadow-lg shadow-teal-600/20 dark:shadow-teal-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-teal-600/30 dark:hover:shadow-teal-900/30"
                asChild
              >
                <Link to="/menu">
                  Νέα παραγγελία
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
