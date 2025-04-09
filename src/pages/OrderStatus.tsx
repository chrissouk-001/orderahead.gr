import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Loader2, Package, AlertCircle, ArrowLeft, ShoppingBag, XCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const OrderStatus: React.FC = () => {
  const { getOrderNumber } = useCart();
  const [currentOrder, setCurrentOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animateStatus, setAnimateStatus] = useState<boolean>(false);
  const orderNumber = getOrderNumber();
  
  // Simulate fetching current order
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Random number between 1 and orderNumber (or 10 if no order)
      setCurrentOrder(Math.floor(Math.random() * (orderNumber || 10)) + 1);
      
      // Trigger animation after loading
      setTimeout(() => {
        setAnimateStatus(true);
      }, 100);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [orderNumber]);
  
  // Simulate order progress
  const calculateProgress = () => {
    if (!orderNumber) return 100;
    const position = orderNumber - currentOrder;
    if (position <= 0) return 100;
    return Math.max(0, 100 - (position * 10));
  };
  
  const getEstimatedTime = () => {
    if (!orderNumber) return 0;
    const position = orderNumber - currentOrder;
    return Math.max(0, position * 2);
  };
  
  const getStatusText = () => {
    if (!orderNumber) return 'Δεν υπάρχει ενεργή παραγγελία';
    
    const position = orderNumber - currentOrder;
    if (position <= 0) return 'Η παραγγελία σας είναι έτοιμη για παραλαβή!';
    if (position === 1) return 'Η παραγγελία σας ετοιμάζεται, είστε ο επόμενος!';
    return `${position} παραγγελίες πριν από εσάς`;
  };
  
  const getStatusIcon = () => {
    if (!orderNumber) return XCircle;
    const position = orderNumber - currentOrder;
    if (position <= 0) return CheckCircle;
    if (position === 1) return Package;
    return Clock;
  };

  const getStatusColor = () => {
    if (!orderNumber) return 'text-gray-400';
    const position = orderNumber - currentOrder;
    if (position <= 0) return 'text-green-500';
    if (position === 1) return 'text-orange-500';
    return 'text-blue-500';
  };
  
  const StatusIcon = getStatusIcon();
  const statusColor = getStatusColor();
  const progress = calculateProgress();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-canteen-dark dark:text-white">Κατάσταση Παραγγελίας</h1>
            <div className="ml-auto">
              <Link to="/menu">
                <Button variant="outline" className="flex items-center gap-2 rounded-full">
                  <ArrowLeft size={16} />
                  <span>Πίσω στον κατάλογο</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {isLoading ? (
            <div className="bg-white dark:bg-card rounded-xl shadow-md p-12 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-canteen-teal/10 dark:bg-primary/10 rounded-full animate-ping"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-canteen-teal/20 dark:bg-primary/20 rounded-full">
                  <Loader2 className="h-10 w-10 text-canteen-teal dark:text-primary animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-medium text-canteen-dark dark:text-white mb-2">Φόρτωση κατάστασης παραγγελίας</h2>
              <p className="text-gray-500 dark:text-gray-400">Παρακαλώ περιμένετε καθώς ελέγχουμε την κατάσταση της παραγγελίας σας...</p>
            </div>
          ) : !orderNumber ? (
            <div className={`bg-white dark:bg-card rounded-xl shadow-md overflow-hidden transition-all duration-500 transform ${animateStatus ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="rounded-full bg-gray-100 dark:bg-muted/60 w-20 h-20 flex items-center justify-center mb-6 md:mb-0 md:mr-6">
                    <XCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-canteen-dark dark:text-white mb-2">Δεν έχετε κάποια ενεργή παραγγελία</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Δεν βρέθηκε καμία ενεργή παραγγελία αυτή τη στιγμή. Περιηγηθείτε στον κατάλογο για να παραγγείλετε.
                    </p>
                    <Link to="/menu">
                      <Button className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Παραγγείλτε Τώρα
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`bg-white dark:bg-card rounded-xl shadow-md overflow-hidden transition-all duration-500 transform ${animateStatus ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="p-8">
                <div className="flex flex-col md:flex-row md:items-start mb-8">
                  <div className={`rounded-full w-20 h-20 flex items-center justify-center mb-6 md:mb-0 md:mr-6 ${StatusIcon === CheckCircle ? 'bg-green-100 dark:bg-green-900/20' : StatusIcon === Package ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                    <StatusIcon className={`h-10 w-10 ${statusColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h2 className="text-2xl font-bold text-canteen-dark dark:text-white mb-2 md:mb-0">Παραγγελία #{orderNumber}</h2>
                      <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-muted">
                        <Clock className="mr-2 h-4 w-4 text-canteen-teal dark:text-primary" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Τρέχουσα σειρά: <span className="font-bold text-canteen-teal dark:text-primary">{currentOrder}</span>
                        </span>
                      </div>
                    </div>
                    <p className={`text-lg font-medium mb-4 ${statusColor}`}>
                      {getStatusText()}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Πρόοδος παραγγελίας</span>
                        <span className="font-medium text-canteen-teal dark:text-primary text-sm">{progress}%</span>
                      </div>
                      <div className="relative h-2 w-full bg-gray-100 dark:bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${orderNumber <= currentOrder ? 'bg-green-500' : 'bg-canteen-teal dark:bg-primary'}`} 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-4 bg-gray-50 dark:bg-muted/60 border border-gray-100 dark:border-muted">
                    <div className="flex items-start">
                      <Clock className="mr-3 h-5 w-5 text-canteen-teal dark:text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-canteen-dark dark:text-white mb-1">Εκτιμώμενος χρόνος</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {orderNumber <= currentOrder ? (
                            <span className="font-medium text-green-600 dark:text-green-400">Έτοιμο για παραλαβή!</span>
                          ) : (
                            <>Περίπου <span className="font-bold">{getEstimatedTime()}</span> λεπτά αναμονής</>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-start">
                      <AlertCircle className="mr-3 h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-1">Σημείωση</h3>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          Παρακαλούμε να βρίσκεστε κοντά στο κυλικείο όταν ο αριθμός σας πλησιάζει 
                          στην τρέχουσα σειρά εξυπηρέτησης.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {orderNumber <= currentOrder && (
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-4">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-600 dark:text-green-400">Η παραγγελία σας είναι έτοιμη!</h3>
                          <p className="text-gray-600 dark:text-gray-400">Παρακαλώ προσέλθετε στο κυλικείο</p>
                        </div>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Επιβεβαίωση Παραλαβής
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderStatus;
