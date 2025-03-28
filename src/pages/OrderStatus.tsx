
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderStatus: React.FC = () => {
  const { getOrderNumber } = useCart();
  const [currentOrder, setCurrentOrder] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const orderNumber = getOrderNumber();
  
  // Simulate fetching current order
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Random number between 1 and orderNumber (or 10 if no order)
      setCurrentOrder(Math.floor(Math.random() * (orderNumber || 10)) + 1);
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Κατάσταση Παραγγελίας</h1>
        
        <div className="max-w-lg mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-canteen-teal mb-4" />
              <p>Φόρτωση κατάστασης παραγγελίας...</p>
            </div>
          ) : !orderNumber ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-lg mb-4">Δεν υπάρχει ενεργή παραγγελία</p>
              <p className="text-gray-500">
                Δεν έχετε κάποια ενεργή παραγγελία αυτή τη στιγμή.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Παραγγελία #{orderNumber}</h2>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-canteen-teal" />
                    <span className="font-medium">
                      Τρέχουσα σειρά εξυπηρέτησης: {currentOrder}
                    </span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Πρόοδος παραγγελίας</span>
                    <span>{calculateProgress()}%</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <h3 className="font-medium mb-2">Κατάσταση</h3>
                  
                  {orderNumber <= currentOrder ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span className="font-medium">Έτοιμη για παραλαβή!</span>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-canteen-teal mb-1">{getStatusText()}</p>
                      <p className="text-sm text-gray-500">
                        Εκτιμώμενος χρόνος αναμονής: ~{getEstimatedTime()} λεπτά
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800 mb-2">Σημείωση</h3>
                  <p className="text-sm text-blue-700">
                    Παρακαλούμε να βρίσκεστε κοντά στο κυλικείο όταν ο αριθμός σας πλησιάζει 
                    στην τρέχουσα σειρά εξυπηρέτησης.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderStatus;
