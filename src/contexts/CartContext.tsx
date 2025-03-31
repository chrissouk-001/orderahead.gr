import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Product } from '@/types/product';

// Define cart item type
type CartItem = {
  product: Product;
  quantity: number;
};

// Define cart context type
type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  includesBag: boolean;
  setIncludesBag: (value: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOrderNumber: () => number | null;
  placeOrder: () => Promise<number>;
};

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [includesBag, setIncludesBag] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  
  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('orderAheadCart');
    const storedBag = localStorage.getItem('orderAheadBag');
    
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    
    if (storedBag) {
      setIncludesBag(JSON.parse(storedBag));
    }
  }, []);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('orderAheadCart', JSON.stringify(items));
  }, [items]);
  
  // Save bag preference to localStorage
  useEffect(() => {
    localStorage.setItem('orderAheadBag', JSON.stringify(includesBag));
  }, [includesBag]);

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.info('Το προϊόν αφαιρέθηκε από το καλάθι');
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setIncludesBag(false);
  };

  // Get total items in cart
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  // Get order number
  const getOrderNumber = () => {
    return orderNumber;
  };

  // Place order
  const placeOrder = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random order number between 1-20
    const newOrderNumber = Math.floor(Math.random() * 20) + 1;
    setOrderNumber(newOrderNumber);
    
    // Clear cart after successful order
    clearCart();
    
    return newOrderNumber;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      includesBag,
      setIncludesBag,
      getTotalItems,
      getTotalPrice,
      getOrderNumber,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
