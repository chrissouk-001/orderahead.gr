/**
 * product.ts
 * 
 * Type definitions for product-related data structures used across the application.
 * These types ensure consistent product data structure throughout the codebase.
 */

/**
 * ProductCategory
 * 
 * Defines the available product categories in the menu.
 * Used for filtering and categorizing products in the UI.
 */
export type ProductCategory = 
  | 'sandwich' 
  | 'pastry' 
  | 'snack' 
  | 'sweet'
  | 'drink';

/**
 * Product
 * 
 * Core product data structure representing menu items
 * Contains all information needed to display and order a product
 */
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  popular?: boolean;
  isNew?: boolean;
  isEco?: boolean;
  rating?: number;
  reviews?: number;
};
