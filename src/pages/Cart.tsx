
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
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Το καλάθι σας είναι άδειο</h2>
            <p className="text-gray-500 mb-6">Προσθέστε προϊόντα για να ξεκινήσετε την παραγγελία σας</p>
            <Button 
              className="bg-canteen-teal hover:bg-canteen-teal/90"
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
                      <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                          <img 
                            src={item.product.image || "/placeholder.svg"} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        
                        <div className="flex-grow sm:ml-4">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.description}</p>
                          <div className="text-canteen-teal font-bold mt-1">
                            {item.product.price.toFixed(2)}€
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 sm:mt-0">
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-md hover:bg-gray-100"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                          <button 
                            className="ml-4 p-1 text-red-500 hover:bg-red-50 rounded-md"
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
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Σύνοψη Παραγγελίας</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Υποσύνολο</span>
                      <span>{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="eco-bag" 
                        checked={!includesBag}
                        onCheckedChange={(checked) => setIncludesBag(!checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="eco-bag"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Οικολογική επιλογή (χωρίς πλαστική σακούλα)
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Βοηθήστε στην προστασία του περιβάλλοντος
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold">
                      <span>Σύνολο</span>
                      <span>{getTotalPrice().toFixed(2)}€</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-canteen-teal hover:bg-canteen-teal/90"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder ? (
                        'Υποβολή παραγγελίας...'
                      ) : (
                        <>
                          Υποβολή παραγγελίας
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
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
