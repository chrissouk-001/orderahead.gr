import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    includesBag, 
    setIncludesBag, 
    getTotalPrice,
    placeOrder
  } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };
  
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Το καλάθι είναι άδειο');
      return;
    }
    
    setIsPlacingOrder(true);
    try {
      const orderNumber = await placeOrder();
      toast.success('Η παραγγελία σας καταχωρήθηκε με επιτυχία!');
      navigate('/order-success', { state: { orderNumber } });
    } catch (error) {
      toast.error('Παρουσιάστηκε σφάλμα κατά την καταχώρηση της παραγγελίας');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a1023]">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Το καλάθι μου</h1>
        
        {items.length === 0 ? (
          <motion.div 
            className="bg-white dark:bg-[#141d30] rounded-lg shadow-md p-8 max-w-md mx-auto text-center border border-gray-100 dark:border-gray-800/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-3">Το καλάθι σας είναι άδειο</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Προσθέστε προϊόντα για να ξεκινήσετε την παραγγελία σας
            </p>
            <Button 
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white px-8"
              onClick={() => navigate('/menu')}
            >
              Συνέχεια αγορών
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Products Column */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white dark:bg-[#141d30] rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-800/20">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Προϊόντα</h2>
                  
                  <div className="space-y-5">
                    {items.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-800/20 bg-white dark:bg-[#141d30]"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800/50 rounded-md overflow-hidden flex-shrink-0 mr-4">
                          <img 
                            src={item.product.image || "/placeholder.svg"} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800 dark:text-white">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.description}</p>
                          <div className="text-teal-600 dark:text-teal-400 font-medium mt-1">
                            {item.product.price.toFixed(2)}€
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium text-gray-800 dark:text-white">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            className="ml-2 p-1 rounded-full text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            onClick={() => handleRemoveItem(item.product.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Order Summary Column */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-[#141d30] rounded-lg shadow-md overflow-hidden sticky top-24 border border-gray-100 dark:border-gray-800/20">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                    Σύνοψη Παραγγελίας
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Υποσύνολο</span>
                      <span className="font-medium text-gray-800 dark:text-white">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/30 p-3 rounded">
                      <Checkbox 
                        id="eco-option" 
                        checked={!includesBag}
                        onCheckedChange={(checked) => setIncludesBag(!checked as boolean)}
                        className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-gray-300 dark:border-gray-600"
                      />
                      <div>
                        <label
                          htmlFor="eco-option"
                          className="text-sm font-medium text-gray-800 dark:text-white"
                        >
                          Οικολογική επιλογή
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Χωρίς πλαστική σακούλα για προστασία του περιβάλλοντος
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-200 dark:bg-gray-700/30 my-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-white">Σύνολο</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white py-5 mt-2"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          <span>Υποβολή παραγγελίας...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span>Υποβολή παραγγελίας</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    <div className="flex justify-center mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-teal-600 dark:text-teal-400" />
                        Ασφαλής ολοκλήρωση παραγγελίας
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
