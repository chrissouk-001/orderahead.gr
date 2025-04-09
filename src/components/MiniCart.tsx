import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

type MiniCartProps = {
  layout?: 'default' | 'compact' | 'mobile';
};

const MiniCart: React.FC<MiniCartProps> = ({ layout = 'default' }) => {
  const { items, getTotalPrice, updateQuantity, removeItem } = useCart();
  const isMobile = useIsMobile();
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };
  
  // If mobile layout is requested or we're on mobile, force the mobile view
  const effectiveLayout = isMobile ? 'mobile' : layout;
  
  if (items.length === 0) {
    return (
      <div className={`text-center ${
        effectiveLayout === 'compact' 
          ? 'p-5 bg-white dark:bg-[#112136] rounded-lg' 
          : effectiveLayout === 'mobile'
            ? 'p-4 bg-white dark:bg-[#112136] rounded-lg'
            : 'p-8'
      }`}>
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-[#0b1220] flex items-center justify-center relative border border-gray-200 dark:border-[#1d2f4f]">
              <ShoppingBag className="h-8 w-8 text-canteen-teal animate-in fade-in zoom-in duration-500" />
            </div>
          </div>
          <h3 className="font-medium text-lg text-canteen-dark dark:text-white animate-in fade-in slide-in-from-bottom-3 duration-300">Το καλάθι σας είναι άδειο</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-[220px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-300 delay-100">
            Προσθέστε προϊόντα στο καλάθι σας
          </p>
          {effectiveLayout !== 'compact' && (
            <Button asChild className="mt-5 w-full bg-canteen-teal hover:bg-canteen-teal/90 text-white shadow-md hover:shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-3 duration-300 delay-200">
              <Link to="/menu">Προσθήκη προϊόντων</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (effectiveLayout === 'mobile') {
    return (
      <div className="bg-white dark:bg-[#112136] shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-[#1d2f4f]">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-[#1d2f4f]">
          <h3 className="font-medium text-canteen-dark dark:text-white">Το καλάθι μου</h3>
          <div className="text-sm font-medium text-canteen-teal dark:text-primary">
            {items.length} {items.length === 1 ? 'προϊόν' : 'προϊόντα'}
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {items.map((item) => (
            <div 
              key={item.product.id} 
              className="flex items-center gap-3 p-2 border-b border-gray-100 dark:border-[#1d2f4f]/30 last:border-0"
            >
              <div className="h-14 w-14 rounded-md bg-gray-100 dark:bg-[#0b1220] overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <p className="font-medium text-canteen-dark dark:text-white line-clamp-1">
                  {item.product.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-canteen-teal dark:text-primary font-medium">
                    {(item.quantity * item.product.price).toFixed(2)}€
                  </p>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0b1220] rounded-full"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="mx-1 min-w-[20px] text-center text-sm text-canteen-dark dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#0b1220] rounded-full"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveItem(item.product.id)}
                className="text-gray-400 hover:text-canteen-coral p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#0b1220]"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-[#0b1220]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-canteen-dark dark:text-white">Σύνολο:</span>
            <span className="font-bold text-lg text-canteen-teal dark:text-primary">
              {getTotalPrice().toFixed(2)}€
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              asChild
              variant="outline" 
              className="w-full border-gray-200 dark:border-[#1d2f4f] text-canteen-dark dark:text-white"
            >
              <Link to="/cart">Καλάθι</Link>
            </Button>
            <Button 
              asChild
              className="w-full bg-canteen-teal hover:bg-canteen-teal/90 dark:bg-primary dark:hover:bg-primary/90 text-white"
            >
              <Link to="/checkout">Ταμείο</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {effectiveLayout === 'default' ? (
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
        <div className={`${effectiveLayout === 'compact' ? 'bg-white/90 dark:bg-[#112136]/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-[#1d2f4f]' : 'bg-white dark:bg-card rounded-lg shadow-md p-5 border border-gray-200 dark:border-muted/30'}`}>
          <div className="space-y-0 mb-1 p-3">
            {items.slice(0, 3).map((item, index) => (
              <div 
                key={item.product.id} 
                className="flex items-center py-2.5 border-b border-gray-200 dark:border-[#1d2f4f]/50 last:border-0 transition-all duration-200 hover:bg-gray-100/70 dark:hover:bg-[#1a2c47]/70 animate-in fade-in-50 slide-in-from-right-3"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-[#051129] overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#1d2f4f]/50">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="ml-3 flex-grow min-w-0">
                  <p className="text-sm font-medium text-canteen-dark dark:text-white line-clamp-1">{item.product.name}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} x {item.product.price.toFixed(2)}€</p>
                    <p className="text-xs font-medium text-canteen-teal ml-1">{(item.quantity * item.product.price).toFixed(2)}€</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.product.id)}
                  className="ml-2 p-1 text-gray-500 dark:text-gray-400 hover:text-canteen-coral rounded-full"
                  aria-label="Remove item"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {items.length > 3 && (
              <p className="text-xs text-center font-medium text-gray-500 dark:text-gray-400 py-1 mt-1 bg-gray-100 dark:bg-[#0b1220] rounded">
                + {items.length - 3} ακόμη προϊόντα
              </p>
            )}
          </div>
          
          <div className="flex justify-between items-center bg-gradient-to-r from-gray-100 to-white dark:from-[#0b1220] dark:to-[#112136] px-3 py-3 rounded-b-lg">
            <div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Σύνολο</span>
              <span className="ml-2 text-base font-bold text-canteen-teal">{getTotalPrice().toFixed(2)}€</span>
            </div>
            
            <Button asChild size="sm" className="bg-canteen-teal hover:bg-canteen-teal/90 text-white shadow-sm transition-all hover:shadow-md">
              <Link to="/cart" className="px-4">Δείτε το καλάθι</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniCart; 