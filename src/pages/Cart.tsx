import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, X, ShoppingCart, Package, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Cart: React.FC = () => {
  const { items, getTotalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Αφαιρέθηκε από το καλάθι",
      description: "Το προϊόν αφαιρέθηκε από το καλάθι σας.",
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Άδειο καλάθι",
        description: "Προσθέστε προϊόντα στο καλάθι σας για να προχωρήσετε στην πληρωμή.",
        variant: "destructive",
      });
      return;
    }
    
    // Normally you would navigate to a checkout page
    navigate("/order-success", { 
      state: { 
        orderNumber: Math.floor(Math.random() * 900000) + 100000,
        totalAmount: getTotalPrice(),
        items: items,
      } 
    });
    
    // Clear cart after successful checkout
    clearCart();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Το καλάθι μου</h1>
        
        {items.length === 0 ? (
          <motion.div 
            className="bg-white dark:bg-card rounded-lg shadow-md p-8 max-w-md mx-auto text-center border border-gray-100 dark:border-muted/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-muted/50 flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Το καλάθι σας είναι άδειο</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Προσθέστε προϊόντα από τον κατάλογο για να παραγγείλετε.
            </p>
            <Button asChild className="bg-canteen-teal hover:bg-canteen-teal/90 text-white dark:bg-primary dark:hover:bg-primary/90">
              <Link to="/menu">
                Περιήγηση στον κατάλογο
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products List */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-muted/20">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Προϊόντα</h2>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-muted/20 bg-white dark:bg-card"
                      >
                        {/* Product Image */}
                        <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-muted/70 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-grow ml-4">
                          <h3 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.price.toFixed(2)}€ / τεμάχιο</p>
                        </div>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Total Price */}
                        <div className="ml-6 w-20 text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {(item.product.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden sticky top-24 border border-gray-100 dark:border-muted/20">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-canteen-teal dark:text-primary" />
                    Σύνοψη Παραγγελίας
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between pb-4 border-b border-gray-100 dark:border-gray-800/30">
                      <span className="text-gray-600 dark:text-gray-400">Υποσύνολο</span>
                      <span className="font-medium text-gray-900 dark:text-white">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex justify-between pb-4 border-b border-gray-100 dark:border-gray-800/30">
                      <span className="text-gray-600 dark:text-gray-400">Χρέωση εξυπηρέτησης</span>
                      <span className="font-medium text-gray-900 dark:text-white">0.00€</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Σύνολο</span>
                      <span className="text-canteen-teal dark:text-primary">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <Button 
                        className="w-full bg-canteen-teal hover:bg-canteen-teal/90 text-white dark:bg-primary dark:hover:bg-primary/90"
                        onClick={handleCheckout}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Ολοκλήρωση Παραγγελίας
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        asChild
                      >
                        <Link to="/menu">
                          <Package className="mr-2 h-4 w-4" />
                          Συνέχεια για προσθήκη προϊόντων
                        </Link>
                      </Button>
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
