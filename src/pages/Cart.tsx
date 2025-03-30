import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Το καλάθι μου</h1>
        
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-canteen-teal dark:text-primary mb-4 opacity-80" />
            <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-3">Το καλάθι σας είναι άδειο</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Προσθέστε προϊόντα για να ξεκινήσετε την παραγγελία σας
            </p>
            <Button 
              className="bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary px-8"
              onClick={() => navigate('/menu')}
            >
              Συνέχεια αγορών
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Προϊόντα</h2>
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/10 rounded-lg transition-colors duration-200 group border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <img 
                            src={item.product.image || "/placeholder.svg"} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        
                        <div className="flex-grow sm:ml-4">
                          <h3 className="font-medium text-gray-800 dark:text-white group-hover:text-canteen-teal dark:group-hover:text-primary transition-colors duration-300">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.description}</p>
                          <div className="text-canteen-teal dark:text-primary font-bold mt-1">
                            {item.product.price.toFixed(2)}€
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 sm:mt-0">
                          <button 
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-200"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-2 w-8 text-center font-medium">{item.quantity}</span>
                          <button 
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-canteen-teal dark:hover:text-primary transition-colors duration-200"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <button 
                            className="ml-4 p-2 rounded-full text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors duration-200"
                            onClick={() => handleRemoveItem(item.product.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#141d30] rounded-xl shadow-lg overflow-hidden sticky top-24 border border-gray-100 dark:border-gray-800/30">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-canteen-dark dark:text-white flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-canteen-teal dark:text-primary" />
                    Σύνοψη Παραγγελίας
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between py-2 border-b border-dashed border-gray-200 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-300">Υποσύνολο</span>
                      <span className="font-medium">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/20 p-3 rounded-lg">
                      <Checkbox 
                        id="eco-bag" 
                        checked={!includesBag}
                        onCheckedChange={(checked) => setIncludesBag(!checked as boolean)}
                        className="mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <div className="grid gap-1 leading-none">
                        <label
                          htmlFor="eco-bag"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Οικολογική επιλογή
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Χωρίς πλαστική σακούλα για προστασία του περιβάλλοντος
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg font-bold text-canteen-dark dark:text-white">Σύνολο</span>
                      <span className="text-lg font-bold text-canteen-teal dark:text-primary">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <Button 
                      className="w-full text-white shadow-md bg-gradient-to-r from-canteen-teal to-canteen-teal/90 hover:from-canteen-teal hover:to-canteen-teal dark:from-primary dark:to-primary/90 dark:hover:from-primary dark:hover:to-primary py-6"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                          Υποβολή παραγγελίας...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Υποβολή παραγγελίας
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                      Ασφαλής ολοκλήρωση παραγγελίας
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
