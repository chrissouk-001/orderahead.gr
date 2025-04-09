import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, X, ShoppingCart, Package, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0b1220] to-[#051129]">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Το καλάθι μου</h1>
        
        {items.length === 0 ? (
          <motion.div 
            className="bg-[#112136]/80 dark:bg-[#112136]/80 backdrop-blur-sm rounded-lg shadow-md p-8 max-w-md mx-auto text-center border border-[#1d2f4f]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-center mb-4">
              <div className="h-24 w-24 rounded-full bg-[#0b1220] flex items-center justify-center relative border border-[#1d2f4f]">
                <ShoppingCart className="h-12 w-12 text-canteen-teal animate-in fade-in zoom-in duration-500" />
              </div>
            </div>
            <h2 className="text-xl font-medium mb-2 text-white">Το καλάθι σας είναι άδειο</h2>
            <p className="text-gray-400 mb-6">
              Προσθέστε προϊόντα από τον κατάλογο για να παραγγείλετε.
            </p>
            <Button asChild className="bg-canteen-teal hover:bg-canteen-teal/90 text-white">
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
              <div className="bg-[#112136]/80 dark:bg-[#112136]/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-[#1d2f4f]">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-white">Προϊόντα</h2>
                  
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div 
                        key={item.product.id} 
                        className="flex items-center p-4 rounded-lg border border-[#1d2f4f] bg-[#0b1220]/60 backdrop-blur-sm"
                      >
                        {/* Product Image */}
                        <div className="h-16 w-16 rounded-md bg-[#051129] overflow-hidden flex-shrink-0 border border-[#1d2f4f]/50">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-grow ml-4">
                          <h3 className="font-medium text-white">{item.product.name}</h3>
                          <p className="text-sm text-gray-400">{item.product.price.toFixed(2)}€ / τεμάχιο</p>
                        </div>
                        
                        {/* Quantity Control */}
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-[#1a2c47]/50 border-[#1d2f4f] hover:bg-[#1a2c47] hover:border-canteen-teal/30 text-white"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-medium text-white">
                            {item.quantity}
                          </span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-[#1a2c47]/50 border-[#1d2f4f] hover:bg-[#1a2c47] hover:border-canteen-teal/30 text-white"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Total Price */}
                        <div className="ml-6 w-20 text-right">
                          <p className="font-medium text-white">
                            {(item.product.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 text-gray-400 hover:text-canteen-coral"
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
              <div className="bg-[#112136]/80 dark:bg-[#112136]/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden sticky top-24 border border-[#1d2f4f]">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-white flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-canteen-teal" />
                    Σύνοψη Παραγγελίας
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between pb-4 border-b border-[#1d2f4f]/70">
                      <span className="text-gray-400">Υποσύνολο</span>
                      <span className="font-medium text-white">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex justify-between pb-4 border-b border-[#1d2f4f]/70">
                      <span className="text-gray-400">Χρέωση εξυπηρέτησης</span>
                      <span className="font-medium text-white">0.00€</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Σύνολο</span>
                      <span className="text-canteen-teal">{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <Button 
                        className="w-full bg-canteen-teal hover:bg-canteen-teal/90 text-white"
                        onClick={handleCheckout}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Ολοκλήρωση Παραγγελίας
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full bg-[#1a2c47]/50 border-[#1d2f4f] hover:bg-[#1a2c47] hover:border-canteen-teal/30 text-white"
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
    </div>
  );
};

export default Cart;
