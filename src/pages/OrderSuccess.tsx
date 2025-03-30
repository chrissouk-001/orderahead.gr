import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocationState {
  orderNumber: number;
}

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  // If no order number, redirect to home
  useEffect(() => {
    if (!state || typeof state.orderNumber !== 'number') {
      navigate('/');
    }
  }, [state, navigate]);
  
  if (!state || typeof state.orderNumber !== 'number') {
    return null;
  }
  
  // Calculate estimated time based on order number (simple example)
  const estimatedTime = `${10 + state.orderNumber}:${Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10)}`;
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a1023]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          {/* Green check icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          
          {/* Order completed message */}
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Η παραγγελία σας ολοκληρώθηκε!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Σας ευχαριστούμε για την παραγγελία σας στο Smart Canteen Atsoglou.
          </p>
          
          {/* Order details */}
          <div className="bg-white dark:bg-[#141d30] border border-gray-100 dark:border-gray-800/20 p-6 rounded-lg mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 dark:text-gray-400">Αριθμός παραγγελίας:</span>
              <span className="font-bold text-gray-900 dark:text-white">{state.orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Εκτιμώμενος χρόνος παραλαβής:</span>
              <span className="font-bold text-gray-900 dark:text-white flex items-center">
                {estimatedTime}
              </span>
            </div>
          </div>
          
          {/* Pickup instructions */}
          <div className="bg-gray-700/20 dark:bg-gray-800/30 p-5 rounded-lg mb-8 text-left">
            <h2 className="font-bold text-gray-900 dark:text-gray-200 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              Οδηγίες παραλαβής
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Μόλις πάρετε τον αριθμό σας, θα ακούσετε/δείτε την σειθρα σας.
              Παρακαλούμε πλησιάστε στο ταμείο του κυλικείου για την
              παραλαβή της παραγγελίας σας.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50"
              asChild
            >
              <Link to="/order-status">
                Έλεγχος κατάστασης παραγγελίας
              </Link>
            </Button>
            
            <Button 
              className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-700"
              asChild
            >
              <Link to="/menu">
                Νέα παραγγελία
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
