import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';

type MiniCartProps = {
  layout?: 'default' | 'compact';
};

const MiniCart: React.FC<MiniCartProps> = ({ layout = 'default' }) => {
  const { items, getTotalPrice, updateQuantity, removeItem } = useCart();
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };
  
  if (items.length === 0) {
    return (
      <div className={`text-center ${layout === 'compact' ? 'p-5 bg-white dark:bg-[#1A1A1A] rounded-lg' : 'p-8'}`}>
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-800/10 rounded-full opacity-70 animate-pulse"></div>
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-[#2A2A2A] dark:to-[#1A1A1A] flex items-center justify-center relative z-10 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
              <ShoppingBag className="h-8 w-8 text-teal-600 dark:text-teal-400 animate-in fade-in zoom-in duration-500" />
            </div>
          </div>
          <h3 className="font-semibold text-xl text-gray-900 dark:text-white mt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">Το καλάθι σας είναι άδειο</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-[220px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300 delay-100">
            Προσθέστε προϊόντα στο καλάθι σας
          </p>
          <Button asChild className="mt-5 w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 dark:from-teal-600 dark:to-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-400 text-white shadow-md hover:shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-3 duration-300 delay-200">
            <Link to="/menu">Προσθήκη προϊόντων</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {layout === 'default' ? (
        <div className="lg:flex lg:gap-6">
          {/* Products List */}
          <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-muted/30 lg:w-2/3">
            <div className="divide-y divide-gray-200 dark:divide-muted/30">
              {items.map((item) => (
                <div key={item.product.id} className="p-4 flex items-start">
                  {/* Product Image */}
                  <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.product.price.toFixed(2)}€</p>
                    
                    <div className="flex items-center mt-2">
                      <button 
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="mx-2 w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white p-1"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price and Remove */}
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                    <button 
                      className="mt-2 text-gray-400 hover:text-red-500 p-1"
                      onClick={() => handleRemoveItem(item.product.id)}
                      aria-label="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-muted/30 lg:w-1/3">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Σύνοψη Παραγγελίας</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Υποσύνολο</span>
                  <span className="text-gray-900 dark:text-white">{getTotalPrice().toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Έκπτωση</span>
                  <span className="text-gray-900 dark:text-white">0.00€</span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-muted/30">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900 dark:text-white">Σύνολο</span>
                    <span className="text-canteen-teal dark:text-primary">{getTotalPrice().toFixed(2)}€</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild>
                  <Link to="/cart">Δείτε το καλάθι</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/menu">Συνέχεια για προσθήκη</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${layout === 'compact' ? 'bg-gray-50 dark:bg-[#1A1A1A] rounded-lg shadow-lg border border-gray-100 dark:border-gray-700' : 'bg-white dark:bg-card rounded-lg shadow-md p-5 border border-gray-200 dark:border-muted/30'}`}>
          <div className="space-y-0 mb-1 p-3">
            {items.slice(0, 3).map((item, index) => (
              <div 
                key={item.product.id} 
                className="flex items-center py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 animate-in fade-in-50 slide-in-from-right-3"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.quantity} x {item.product.price.toFixed(2)}€</p>
                    <p className="text-xs font-medium text-teal-600 dark:text-teal-400">{(item.quantity * item.product.price).toFixed(2)}€</p>
                  </div>
                </div>
              </div>
            ))}
            
            {items.length > 3 && (
              <p className="text-xs text-center font-medium text-gray-500 dark:text-gray-400 py-1 mt-1 bg-gray-100 dark:bg-gray-800/50 rounded">
                + {items.length - 3} ακόμη προϊόντα
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center bg-gradient-to-r from-gray-100 to-gray-50 dark:from-[#1A1A1A] dark:to-[#252525] px-3 py-3 rounded-b-lg">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Σύνολο</span>
              <span className="ml-2 text-base font-bold text-teal-600 dark:text-teal-400">{getTotalPrice().toFixed(2)}€</span>
            </div>
            
            <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all hover:shadow-md">
              <Link to="/cart" className="px-4">Δείτε το καλάθι</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniCart; 