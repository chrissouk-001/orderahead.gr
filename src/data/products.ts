/**
 * products.ts
 * 
 * This module contains product data and utility functions for product retrieval.
 * In a production application, this data would come from a database or API.
 * For this demo, we use static data to simulate the product catalog.
 */

import { Product } from '@/types/product';

/**
 * Mock product catalog
 * A collection of food and drink items available for purchase
 * Each product includes details like price, description, category, and image
 */
export const products: Product[] = [
  {
    id: '1',
    name: 'Σάντουιτς Γαλοπούλα',
    description: 'Φρέσκο ψωμάκι με γαλοπούλα, τυρί και μαρούλι',
    price: 2.50,
    image: '/images/products/sandwich.jpg', 
    category: 'sandwich',
    popular: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Τυρόπιτα',
    description: 'Παραδοσιακή τυρόπιτα με φέτα',
    price: 1.80,
    image: '/images/products/cheese-pie.jpg',
    category: 'pastry',
    popular: true
  },
  {
    id: '3',
    name: 'Κουλούρι Θεσσαλονίκης',
    description: 'Φρεσκοψημένο κουλούρι με σουσάμι',
    price: 0.80,
    image: '/images/products/koulouri.jpg',
    category: 'pastry'
  },
  {
    id: '4',
    name: 'Χυμός Πορτοκάλι',
    description: 'Φυσικός χυμός πορτοκάλι (250ml)',
    price: 1.50,
    image: '/images/products/orange-juice.jpg',
    category: 'drink',
    popular: true
  },
  {
    id: '5',
    name: 'Νερό Εμφιαλωμένο',
    description: 'Φυσικό μεταλλικό νερό (500ml)',
    price: 0.50,
    image: '/images/products/water.jpg',
    category: 'drink'
  },
  {
    id: '6',
    name: 'Κρουασάν Σοκολάτας',
    description: 'Βουτυρένιο κρουασάν με γέμιση σοκολάτας',
    price: 1.80,
    image: '/images/products/chocolate-croissant.jpg',
    category: 'sweet',
    popular: true,
    isNew: true
  },
  {
    id: '7',
    name: 'Μπάρα Δημητριακών',
    description: 'Υγιεινή μπάρα με βρώμη και μέλι',
    price: 1.20,
    image: '/images/products/cereal-bar.jpg',
    category: 'snack'
  },
  {
    id: '8',
    name: 'Σπανακόπιτα',
    description: 'Χωριάτικη σπανακόπιτα με φέτα',
    price: 1.90,
    image: '/images/products/spinach-pie.jpg',
    category: 'pastry',
    popular: true
  },
  {
    id: '9',
    name: 'Τοστ τυρί-γαλοπούλα',
    description: 'Ζεστό τοστ με τυρί και γαλοπούλα',
    price: 1.80,
    image: '/images/products/toast.jpg',
    category: 'sandwich'
  },
  {
    id: '10',
    name: 'Σοκολατούχο Γάλα',
    description: 'Κρύο σοκολατούχο γάλα (250ml)',
    price: 1.30,
    image: '/images/products/chocolate-milk.jpg',
    category: 'drink'
  }
];

/**
 * Get products filtered by category
 * 
 * @param category - The product category to filter by
 * @returns Array of products matching the specified category
 */
export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

/**
 * Get featured/popular products
 * Used for displaying highlighted products on the homepage
 * 
 * @returns Array of products marked as popular
 */
export const getPopularProducts = () => {
  return products.filter(product => product.popular);
};

/**
 * Get a specific product by its ID
 * 
 * @param id - The unique product ID to search for
 * @returns The matching product or undefined if not found
 */
export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
