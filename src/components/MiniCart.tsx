import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface MiniCartProps {
  onSubmit?: () => void;
  compact?: boolean;
  layout?: 'full' | 'compact' | 'side-by-side';
}

// Define types for cart items
interface CartItemType {
  product: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
  };
  quantity: number;
}

const MiniCart: React.FC<MiniCartProps> = ({ 
  onSubmit,
  compact = false,
  layout = 'full'
}) => {
  const { items, removeItem, updateQuantity, includesBag, setIncludesBag, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // Simple cart item component
  const CartItem = ({ item }: { item: CartItemType }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700/30">
      <div className="flex items-center gap-3 flex-1">
        {/* Product image */}
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800/50 rounded overflow-hidden flex-shrink-0">
          <img 
            src={item.product.image || "/placeholder.svg"} 
            alt={item.product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        {/* Product details */}
        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-gray-800 dark:text-white text-sm">
            {item.product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {item.product.description || 'Παραδοσιακή τυρόπιτα με φέτα'}
          </p>
          <div className="text-teal-600 dark:text-teal-400 font-medium text-sm mt-1">
            {item.product.price.toFixed(2)}€
          </div>
        </div>
      </div>
      
      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
        >
          <Minus size={14} />
        </button>
        <span className="w-5 text-center font-medium text-gray-800 dark:text-white text-sm">
          {item.quantity}
        </span>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
        >
          <Plus size={14} />
        </button>
        <button 
          className="ml-1 p-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
          onClick={() => removeItem(item.product.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );

  // Empty cart component
  const EmptyCart = () => (
    <div className="text-center py-6">
      <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Το καλάθι σας είναι άδειο</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Προσθέστε προϊόντα για να ξεκινήσετε την παραγγελία σας</p>
      <Button 
        variant="outline" 
        onClick={() => navigate('/menu')}
        className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        Προσθήκη προϊόντων
      </Button>
    </div>
  );

  // Order summary component
  const OrderSummary = () => (
    <div className="mt-5">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Σύνοψη Παραγγελίας</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300 text-sm">Υποσύνολο</span>
          <span className="font-medium text-gray-800 dark:text-white">{getTotalPrice().toFixed(2)}€</span>
        </div>
        
        <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/30 p-2.5 rounded">
          <Checkbox 
            id="eco-bag" 
            checked={!includesBag}
            onCheckedChange={(checked) => setIncludesBag(!checked as boolean)}
            className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-gray-300 dark:border-gray-600"
          />
          <div>
            <label
              htmlFor="eco-bag"
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
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 mt-2"
          onClick={() => onSubmit ? onSubmit() : navigate('/cart')}
        >
          <span>Υποβολή παραγγελίας</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Main component rendering
  const renderCartContent = () => {
    if (items.length === 0) {
      return <EmptyCart />;
    }

    return (
      <div className={`${compact ? 'max-h-80 overflow-y-auto pr-1' : ''}`}>
        {/* Cart items */}
        <div className="space-y-2">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
        
        {/* Only show order summary in full layout */}
        {layout !== 'compact' && <OrderSummary />}
      </div>
    );
  };

  // Side-by-side layout
  if (layout === 'side-by-side' && items.length > 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products section */}
        <div className="bg-white dark:bg-[#0a1023] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800/30 lg:w-2/3">
          <div className="p-5">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Προϊόντα</h2>
            <div className={`${compact ? 'max-h-80 overflow-y-auto pr-1' : ''}`}>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>
        </div>
        
        {/* Order summary section */}
        <div className="bg-white dark:bg-[#0a1023] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800/30 lg:w-1/3">
          <div className="p-5">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-teal-600 dark:text-teal-400" />
                Σύνοψη Παραγγελίας
              </div>
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300 text-sm">Υποσύνολο</span>
                <span className="font-medium text-gray-800 dark:text-white">{getTotalPrice().toFixed(2)}€</span>
              </div>
              
              <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/30 p-2.5 rounded">
                <Checkbox 
                  id="eco-bag-side" 
                  checked={!includesBag}
                  onCheckedChange={(checked) => setIncludesBag(!checked as boolean)}
                  className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-gray-300 dark:border-gray-600"
                />
                <div>
                  <label
                    htmlFor="eco-bag-side"
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 mt-2"
                onClick={() => onSubmit ? onSubmit() : navigate('/cart')}
              >
                <span>Υποβολή παραγγελίας</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default compact or full layout
  return (
    <div className="bg-white dark:bg-[#0a1023] rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800/30">
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {layout === 'compact' ? 'Προϊόντα' : 'Το καλάθι μου'}
        </h2>
        {renderCartContent()}
      </div>
    </div>
  );
};

export default MiniCart; 