import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronLeft, ChevronRight, CalendarClock, Info, Sparkles, PartyPopper, QrCode, Clock, Bell } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<{
    orderNumber: string;
    totalAmount: number;
    items: OrderItem[];
  }>({
    orderNumber: '',
    totalAmount: 0,
    items: [],
  });

  // Confetti animation state
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Add pulsing notification state
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    // If we don't have state from navigation, generate dummy data for demonstration
    if (location.state) {
      setState(location.state);
    } else {
      // Generate random order number for demonstration
      const randomOrderNumber = Math.floor(Math.random() * 900000) + 100000;
      setState({
        orderNumber: `#${randomOrderNumber}`,
        totalAmount: 12.50,
        items: [
          {
            id: 1,
            name: 'Τυρόπιτα',
            price: 2.50,
            quantity: 2,
          },
          {
            id: 2,
            name: 'Χυμός Πορτοκάλι',
            price: 1.50,
            quantity: 1,
          },
          {
            id: 3,
            name: 'Κουλούρι',
            price: 1.00,
            quantity: 2,
          },
          {
            id: 4,
            name: 'Σάντουιτς Γαλοπούλα',
            price: 3.00,
            quantity: 1,
          },
        ],
      });
    }

    // Hide confetti after 4 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    
    // Show notification after 2 seconds
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(notificationTimer);
    };
  }, [location.state]);

  // Calculate estimated pickup time (15-20 minutes from now)
  const getEstimatedTime = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 15 * 60000);
    const maxTime = new Date(now.getTime() + 20 * 60000);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('el-GR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      });
    };
    
    return `${formatTime(minTime)} - ${formatTime(maxTime)}`;
  };
  
  const estimatedTime = getEstimatedTime();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background/80 relative overflow-hidden">
      <Navbar />
      
      {/* Decorative Wave Background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20 dark:opacity-10 pointer-events-none">
        <motion.div 
          className="absolute inset-0 w-full h-full"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <svg className="w-full h-full text-teal-100 dark:text-teal-900" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <motion.path 
              d="M 0 300 Q 300 150 600 300 Q 900 450 1200 300 L 1200 800 L 0 800 Z"
              fill="currentColor"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 10,
                ease: "easeInOut"
              }}
            />
            <motion.path 
              d="M 0 400 Q 200 350 400 400 Q 600 450 800 400 Q 1000 350 1200 400 L 1200 800 L 0 800 Z"
              fill="currentColor"
              opacity="0.5"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "mirror", 
                duration: 12,
                ease: "easeInOut"
              }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ top: '15%', left: '5%' }}
        className="absolute w-2 h-2 rounded-full bg-teal-500/30 dark:bg-teal-400/20"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        style={{ top: '35%', right: '8%' }}
        className="absolute w-2 h-2 rounded-full bg-teal-500/30 dark:bg-teal-400/20"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        style={{ bottom: '25%', left: '8%' }}
        className="absolute w-2 h-2 rounded-full bg-teal-500/30 dark:bg-teal-400/20"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.1 }}
        style={{ top: '20%', right: '15%' }}
        className="absolute w-3 h-3 rounded-full bg-green-500/30 dark:bg-green-400/20"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        style={{ bottom: '35%', right: '12%' }}
        className="absolute w-3 h-3 rounded-full bg-green-500/30 dark:bg-green-400/20"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ bottom: '15%', left: '20%' }}
        className="absolute w-3 h-3 rounded-full bg-green-500/30 dark:bg-green-400/20"
      />
      
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {[...Array(40)].map((_, i) => {
              const size = Math.random() * 10 + 5;
              const x = Math.random() * 100;
              const y = Math.random() * -100;
              const delay = Math.random() * 0.5;
              const duration = Math.random() * 2 + 2;
              const rotation = Math.random() * 360;
              const colors = [
                "bg-teal-500", "bg-green-400", "bg-yellow-300", 
                "bg-purple-400", "bg-pink-400", "bg-blue-400"
              ];
              const color = colors[Math.floor(Math.random() * colors.length)];
              
              return (
                <motion.div
                  key={i}
                  className={`absolute rounded-sm ${color} opacity-70`}
                  style={{ 
                    width: size, 
                    height: size, 
                    left: `${x}%`,
                    top: `${y}%`,
                    rotate: rotation
                  }}
                  initial={{ y: -100, opacity: 1 }}
                  animate={{ 
                    y: "150vh", 
                    x: [
                      `${x}%`, 
                      `${x - 10 + Math.random() * 20}%`, 
                      `${x - 10 + Math.random() * 20}%`, 
                      `${x - 10 + Math.random() * 20}%`
                    ],
                    rotate: rotation + 360 * 2,
                    opacity: [1, 1, 1, 0]
                  }}
                  transition={{
                    duration: duration,
                    delay: delay,
                    ease: "easeOut",
                  }}
                  exit={{ opacity: 0 }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        {/* Back button */}
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/')} 
          className="mb-6 inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Επιστροφή στην αρχική
        </motion.button>
        
        {/* Success card with slight tilt for design interest */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.1
          }}
          className="relative max-w-2xl mx-auto"
        >
          {/* Card background shapes */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-teal-50 dark:bg-teal-900/20 rounded-full blur-3xl opacity-50 z-0"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 z-0"></div>
          
          <div className="absolute inset-0 bg-white dark:bg-card rounded-3xl shadow-xl transform rotate-1 scale-[1.03] opacity-50 dark:opacity-30 -z-10"></div>
          
          {/* Main success card */}
          <motion.div 
            className="bg-white dark:bg-card rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden border border-gray-100 dark:border-muted/20"
          >
            {/* Card corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16">
              <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-transparent rounded-full"></div>
            </div>
            
            {/* Card corner accent 2 */}
            <div className="absolute bottom-0 left-0 w-24 h-24 -ml-12 -mb-12">
              <div className="w-full h-full bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full"></div>
            </div>

            {/* Success icon with animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20,
                delay: 0.2
              }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                {/* Animated green blob behind success icon */}
                <div className="absolute -inset-8 animate-pulse-gentle">
                  <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/20 animate-pulse"></div>
                </div>
                
                {/* Party Popper Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -top-1 -right-1"
                >
                  <PartyPopper className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                </motion.div>
                
                {/* The icon itself */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: 0,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  {/* Animated border around icon */}
                  <div className="absolute -inset-1 rounded-full border-2 border-green-200 dark:border-green-700/30 border-dashed animate-spin-slow"></div>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Success message */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Η παραγγελία σας ολοκληρώθηκε!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Σας ευχαριστούμε! Η παραγγελία σας έχει καταχωρηθεί και θα είναι έτοιμη σύντομα.
              </p>
            </motion.div>
            
            {/* Order Progress Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8"
            >
              <div className="relative flex items-center justify-between">
                {/* Line connecting dots */}
                <div className="absolute left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                {/* Step 1: Order Placed */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center shadow-md">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Καταχώρηση</span>
                </div>
                
                {/* Step 2: Processing */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 dark:bg-yellow-600 flex items-center justify-center shadow-md animate-pulse">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Επεξεργασία</span>
                </div>
                
                {/* Step 3: Ready */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatDelay: 5,
                        duration: 0.5,
                        repeatType: "loop"
                      }}
                    >
                      <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </motion.div>
                  </div>
                  <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">Έτοιμη</span>
                </div>
              </div>
            </motion.div>
            
            {/* Order details */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-4"
            >
              {/* Order number */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-muted border border-gray-100 dark:border-muted/20 relative overflow-hidden"
              >
                {/* Card detail accent */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-teal-400/5 -rotate-45 -translate-x-8 -translate-y-8 rounded-full"></div>
                
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400">Αριθμός παραγγελίας:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{state.orderNumber}</span>
                </div>
              </motion.div>
              
              {/* Estimated time */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-muted border border-gray-100 dark:border-muted/20 relative overflow-hidden"
              >
                {/* Card detail accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/5 rotate-45 translate-x-8 -translate-y-8 rounded-full"></div>
                
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <CalendarClock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600 dark:text-gray-400">Εκτιμώμενος χρόνος:</span>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">{estimatedTime}</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Pickup instructions with QR code */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 p-5 rounded-xl mb-8 text-left border border-teal-100 dark:border-teal-800/20 shadow-sm relative overflow-hidden"
          >
            {/* Instruction card accent */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-400/20 rotate-45 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-teal-400/20 rotate-45 rounded-full"></div>
            
            <div className="flex items-start relative z-10">
              <div className="flex-grow">
                <h2 className="font-bold text-gray-900 dark:text-gray-200 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-teal-600 dark:text-teal-400" />
                  Οδηγίες παραλαβής
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Η παραγγελία σας θα είναι διαθέσιμη στο κυλικείο την ώρα που αναφέρεται. 
                  Παρακαλούμε επιδείξτε τον αριθμό παραγγελίας {state.orderNumber} στο προσωπικό του κυλικείου 
                  για να παραλάβετε τα προϊόντα σας.
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  {/* QR Code Box */}
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center border border-teal-200 dark:border-teal-800/30 bg-white dark:bg-black/20 rounded-lg p-3 shadow-sm"
                  >
                    <div className="bg-white dark:bg-black/50 p-2 rounded-md mb-1">
                      <QrCode className="h-16 w-16 text-gray-900 dark:text-gray-100" />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Σκανάρετε για γρήγορη παραλαβή</span>
                  </motion.div>
                  
                  {/* Notification Pulse */}
                  {showNotification && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="relative"
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 2,
                          ease: "easeInOut" 
                        }}
                        className="absolute -inset-2 rounded-full bg-teal-500/20"
                      />
                      <div className="relative bg-white dark:bg-muted/80 p-2 rounded-lg shadow-md">
                        <p className="text-xs text-gray-700 dark:text-gray-300 max-w-[150px]">
                          Θα λάβετε ειδοποίηση όταν η παραγγελία σας είναι έτοιμη!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Action buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-muted dark:text-gray-300 dark:hover:bg-muted/50 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Επιστροφή στην αρχική
            </Button>
            
            <Button 
              onClick={() => navigate('/order-status')}
              className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-700 shadow-lg shadow-teal-600/20 dark:shadow-teal-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-teal-600/30 dark:hover:shadow-teal-900/30"
            >
              Κατάσταση παραγγελίας
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
          
          {/* Success badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -right-4 -top-4 z-20 bg-gradient-to-br from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 text-white rounded-full px-3 py-1 text-xs font-medium shadow-lg flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Επιτυχία</span>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
