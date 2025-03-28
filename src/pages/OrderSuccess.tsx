
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Η παραγγελία σας ολοκληρώθηκε!</h1>
          <p className="text-gray-600 mb-8">
            Σας ευχαριστούμε για την παραγγελία σας στο Smart Canteen Atsoglou.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Αριθμός παραγγελίας:</span>
              <span className="font-bold"># {state.orderNumber}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Εκτιμώμενος χρόνος παραλαβής:</span>
              <span className="font-bold flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {state.orderNumber} λεπτά
              </span>
            </div>
          </div>
          
          <div className="bg-canteen-yellow/10 border border-canteen-yellow/30 p-4 rounded-lg mb-8">
            <h2 className="font-bold text-canteen-dark mb-2">Οδηγίες παραλαβής</h2>
            <p className="text-sm text-gray-700">
              Όταν έρθει η σειρά σας, θα ακούσετε/δείτε τον αριθμό σας. 
              Παρακαλούμε πλησιάστε στο ταμείο του κυλικείου για την παραλαβή της παραγγελίας σας.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/order-status">
                Έλεγχος κατάστασης παραγγελίας
              </Link>
            </Button>
            
            <Button asChild className="bg-canteen-teal hover:bg-canteen-teal/90">
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
