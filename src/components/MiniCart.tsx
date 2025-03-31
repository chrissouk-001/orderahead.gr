import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
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
      <div className={`text-center ${layout === 'compact' ? 'p-4' : 'p-8'}`}>
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-muted flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-gray-400" />
          </div>
        </div>
        <h3 className="font-medium text-gray-900 dark:text-white">Το καλάθι σας είναι άδειο</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Προσθέστε προϊόντα στο καλάθι σας
        </p>
        <Button asChild className="mt-4 w-full">
          <Link to="/menu">Προσθήκη προϊόντων</Link>
        </Button>
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
        <div className={`${layout === 'compact' ? '' : 'bg-white dark:bg-card rounded-lg shadow-md p-5 border border-gray-200 dark:border-muted/30'}`}>
          <div className="space-y-2 mb-3">
            {items.slice(0, 2).map((item) => (
              <div key={item.product.id} className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-gray-200 dark:bg-muted overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-2 flex-grow">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} x {item.product.price.toFixed(2)}€</p>
                </div>
              </div>
            ))}
            
            {items.length > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                + {items.length - 2} ακόμη προϊόντα
              </p>
            )}
          </div>
          
          <div className="flex justify-between text-sm font-medium mb-3">
            <span className="text-gray-900 dark:text-white">Σύνολο</span>
            <span className="text-canteen-teal dark:text-primary">{getTotalPrice().toFixed(2)}€</span>
          </div>
          
          <Button asChild size="sm" className="w-full">
            <Link to="/cart">Δείτε το καλάθι</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default MiniCart; 