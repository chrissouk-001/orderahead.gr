/**
 * CartContext.tsx
 * 
 * This module provides a React Context for shopping cart functionality:
 * - Adding, removing, and updating cart items
 * - Managing cart state with localStorage persistence
 * - Calculating totals (price, item count)
 * - Handling order placement
 * - Option for including eco-friendly bag
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Product } from '@/types/product';

// Define cart item type
type CartItem = {
  product: Product;  // Product information
  quantity: number;  // Quantity of this product in cart
};

// Define cart context type with all available operations
type CartContextType = {
  items: CartItem[];                                         // All items in cart
  addItem: (product: Product, quantity?: number) => void;    // Add product to cart
  removeItem: (productId: string) => void;                   // Remove product from cart
  updateQuantity: (productId: string, quantity: number) => void; // Update product quantity
  clearCart: () => void;                                     // Empty cart
  includesBag: boolean;                                      // Eco bag option
  setIncludesBag: (value: boolean) => void;                  // Toggle eco bag option
  getTotalItems: () => number;                               // Count total items
  getTotalPrice: () => number;                               // Calculate total price
  getOrderNumber: () => number | null;                       // Get order number after checkout
  placeOrder: () => Promise<number>;                         // Place order and get order number
};

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider component - Manages the shopping cart state
 * and provides cart functionality to the entire application
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State declarations
  const [items, setItems] = useState<CartItem[]>([]);
  const [includesBag, setIncludesBag] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  
  // Load cart from localStorage on component mount
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
  
  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('orderAheadCart', JSON.stringify(items));
  }, [items]);
  
  // Save bag preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('orderAheadBag', JSON.stringify(includesBag));
  }, [includesBag]);

  /**
   * Add item to cart or increase quantity if already exists
   * 
   * @param product - Product to add
   * @param quantity - Amount to add (default: 1)
   */
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
    
    // Show success notification
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };

  /**
   * Remove item from cart completely
   * 
   * @param productId - ID of product to remove
   */
  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    toast.info('Το προϊόν αφαιρέθηκε από το καλάθι');
  };

  /**
   * Update quantity of an item in cart
   * If quantity ≤ 0, item is removed
   * 
   * @param productId - ID of product to update
   * @param quantity - New quantity
   */
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

  /**
   * Clear all items from cart and reset bag option
   */
  const clearCart = () => {
    setItems([]);
    setIncludesBag(false);
  };

  /**
   * Calculate total number of items in cart
   * @returns Sum of all product quantities
   */
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Calculate total price of all items in cart
   * @returns Sum of (price × quantity) for all items
   */
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };
  
  /**
   * Get the current order number after checkout
   * @returns Order number or null if no order placed
   */
  const getOrderNumber = () => {
    return orderNumber;
  };

  /**
   * Place order and get order confirmation number
   * Currently simulates API call with timeout
   * 
   * @returns Promise resolving to the order number
   */
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

  // Provide cart context to child components
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

/**
 * Custom hook to use the cart context
 * Must be used within a CartProvider component
 * 
 * @returns Cart context with all cart operations
 * @throws Error if used outside of CartProvider
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
