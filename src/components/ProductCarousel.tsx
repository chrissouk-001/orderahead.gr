import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { getPopularProducts } from '@/data/products';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Star, Heart } from "lucide-react";

// Health indicator types
type HealthIndicator = 'healthy' | 'moderate' | 'unhealthy';
type DietaryInfo = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'contains-nuts' | 'diabetes-friendly';
type AllergyInfo = 'contains-gluten' | 'contains-lactose' | 'contains-nuts' | 'contains-soy' | 'contains-eggs';

// Mock function to get health indicators
const getHealthInfo = (productId: string): HealthIndicator => {
  const healthMap: Record<string, HealthIndicator> = {
    "1": "moderate", // Sandwich
    "2": "moderate", // Cheese pie
    "3": "healthy", // Koulouri
    "4": "healthy", // Orange juice
    "5": "healthy", // Water
    "6": "unhealthy", // Chocolate Muffin
    "7": "healthy", // Granola Bar
    "8": "moderate", // Spinach pie
    "9": "moderate", // Toast
    "10": "unhealthy" // Chocolate milk
  };
  
  return healthMap[productId] || "moderate";
};

// Mock function to get dietary information
const getDietaryInfo = (productId: string): DietaryInfo[] => {
  const dietaryMap: Record<string, DietaryInfo[]> = {
    "1": ["contains-nuts"], 
    "2": ["vegetarian"],
    "3": ["vegan", "dairy-free"],
    "4": ["vegan", "gluten-free", "diabetes-friendly"],
    "5": ["vegan", "gluten-free", "dairy-free"],
    "6": ["vegetarian", "contains-nuts"],
    "7": ["gluten-free", "vegan"],
    "8": ["vegetarian"],
    "9": ["contains-nuts"],
    "10": ["vegetarian"]
  };
  
  return dietaryMap[productId] || [];
};

// Mock function to get allergy information
const getAllergyInfo = (productId: string): AllergyInfo[] => {
  const allergyMap: Record<string, AllergyInfo[]> = {
    "1": ["contains-gluten", "contains-lactose"],
    "2": ["contains-lactose", "contains-gluten"],
    "3": ["contains-gluten"],
    "4": [],
    "5": [],
    "6": ["contains-gluten", "contains-lactose", "contains-eggs"],
    "7": ["contains-nuts"],
    "8": ["contains-gluten", "contains-lactose"],
    "9": ["contains-gluten", "contains-lactose"],
    "10": ["contains-lactose"]
  };
  
  return allergyMap[productId] || [];
};

export function ProductCarousel() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const products = getPopularProducts();
  
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      return;
    }
    
    addItem(product);
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swiped left
      goToNext();
    } else if (touchEndX - touchStartX > 50) {
      // Swiped right
      goToPrev();
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate visible products based on screen size
  const getVisibleProducts = () => {
    // On mobile, show 1 product
    // On small screens, show 2 products
    // On medium screens, show 3 products
    // On large screens, show 4 products
    const screenWidth = window.innerWidth;
    let visibleCount = 1;
    
    if (screenWidth >= 1280) {
      visibleCount = 4;
    } else if (screenWidth >= 1024) {
      visibleCount = 3;
    } else if (screenWidth >= 640) {
      visibleCount = 2;
    }
    
    const visibleProducts = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % products.length;
      visibleProducts.push(products[index]);
    }
    
    return visibleProducts;
  };
  
  return (
    <div className="relative">
      <div 
        className="overflow-hidden"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getVisibleProducts().map((product, index) => (
            <ProductCard 
              key={`${product.id}-${index}`} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white dark:bg-card border border-gray-100 dark:border-primary/10 shadow-md hover:shadow-lg transition-all w-10 h-10 text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary"
          onClick={goToPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white dark:bg-card border border-gray-100 dark:border-primary/10 shadow-md hover:shadow-lg transition-all w-10 h-10 text-canteen-darkgray dark:text-gray-400 hover:text-canteen-teal dark:hover:text-primary"
          onClick={goToNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white dark:bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-primary/10 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/products/sandwich.jpg";
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Product tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          {product.popular && (
            <Badge className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint text-white">
              <Star className="w-3 h-3 mr-1" />
              Δημοφιλές
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-canteen-yellow to-canteen-coral dark:from-secondary dark:to-canteen-coral text-white animate-pulse">
              Νέο
            </Badge>
          )}
        </div>
        
        {/* Add to Cart button */}
        <Button
          size="icon"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white dark:bg-card text-canteen-teal dark:text-primary hover:bg-canteen-teal hover:dark:bg-primary hover:text-white rounded-full shadow-md h-9 w-9"
          onClick={() => onAddToCart(product)}
          aria-label={`Προσθήκη ${product.name} στο καλάθι`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/40 backdrop-blur-sm hover:bg-white/60 text-canteen-darkgray hover:text-canteen-coral dark:text-gray-300 dark:hover:text-canteen-coral rounded-full h-8 w-8"
          aria-label={`Προσθήκη ${product.name} στα αγαπημένα`}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium text-canteen-dark dark:text-white mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-canteen-darkgray dark:text-gray-400 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center text-canteen-yellow dark:text-secondary">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                className="w-3.5 h-3.5 fill-current" 
                strokeWidth={0}
              />
            ))}
            <span className="ml-1 text-xs text-canteen-darkgray dark:text-gray-400">(42)</span>
          </div>
          <span className="font-bold text-canteen-dark dark:text-white">{product.price.toFixed(2)}€</span>
        </div>
      </div>
    </div>
  );
};
