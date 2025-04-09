import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPopularProducts } from "@/data/products";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Product } from '@/types/product';

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

export const ProductCarousel = () => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  // Set mobile state based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSmallMobile(window.innerWidth < 480);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const popularProducts = await getPopularProducts();
      setProducts(popularProducts);
    };
    
    fetchProducts();
  }, []);
  
  // Calculate number of visible items based on screen size
  const getVisibleItemCount = () => {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 640) return 1.5;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };
  
  const visibleItems = getVisibleItemCount();
  
  // Navigation functions
  const goToNext = () => {
    if (currentIndex < products.length - visibleItems) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentIndex < products.length - visibleItems) {
      goToNext();
    }
    
    if (isRightSwipe && currentIndex > 0) {
      goToPrev();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Add to cart function
  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      return;
    }
    
    addItem(product);
    toast.success(`${product.name} προστέθηκε στο καλάθι`);
  };
  
  // Like product function
  const toggleLike = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setLikedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`${likedProducts[productId] ? 'Αφαιρέθηκε από τα αγαπημένα' : 'Προστέθηκε στα αγαπημένα'}: ${product.name}`);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  // Calculate transform value for carousel
  const calculateTransform = () => {
    // Full card width (including gap)
    let itemWidth = 280; // Base width
    const gap = 16;
    
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (isSmallMobile) {
        // On very small screens, just show 1 card that takes full width
        itemWidth = containerWidth - 32; // Subtract padding
      } else {
        itemWidth = (containerWidth / visibleItems) - (gap * (visibleItems - 1) / visibleItems);
      }
    }
    
    return `translateX(-${currentIndex * (itemWidth + gap)}px)`;
  };
  
  if (!products.length) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-64 h-80 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative overflow-hidden px-1 py-4"
    >
      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-card/80 shadow-md hover:shadow-lg rounded-full border border-gray-100 dark:border-primary/10"
          onClick={(event) => { event.stopPropagation(); goToPrev(); }}
        >
          <ChevronLeft className="h-6 w-6 text-canteen-dark dark:text-white" />
        </Button>
      )}
      
      {currentIndex < products.length - visibleItems && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-card/80 shadow-md hover:shadow-lg rounded-full border border-gray-100 dark:border-primary/10"
          onClick={(event) => { event.stopPropagation(); goToNext(); }}
        >
          <ChevronRight className="h-6 w-6 text-canteen-dark dark:text-white" />
        </Button>
      )}
      
      {/* Products carousel */}
      <div
        className="flex gap-4 transition-transform duration-500 ease-out"
        style={{ transform: calculateTransform() }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {products.map((product) => (
          <motion.div 
            key={product.id}
            variants={itemVariants}
            className="min-w-[280px] flex-shrink-0"
          >
            <Card className="overflow-hidden group h-full border border-gray-100 dark:border-primary/10 bg-white dark:bg-card hover:shadow-xl transition-all duration-300 relative">
              {/* Badge for new or eco products */}
              {product.isNew && (
                <Badge className="absolute top-11 left-3 z-10 bg-canteen-coral/90 dark:bg-canteen-coral/90 text-white py-1 px-2.5 text-xs rounded-full shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Νέο
                </Badge>
              )}
              {product.isEco && (
                <Badge className="absolute top-20 left-3 z-10 bg-canteen-teal/90 dark:bg-primary/90 text-white py-1 px-2.5 text-xs rounded-full shadow-md">
                  Eco
                </Badge>
              )}
              
              {/* Product image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background/30 dark:to-background/10 overflow-hidden">
                <motion.img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.button 
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center ${
                    likedProducts[product.id] 
                      ? 'bg-canteen-coral text-white' 
                      : 'bg-white/80 dark:bg-card/80 text-gray-500 dark:text-gray-400'
                  } shadow-md`}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={(event) => { event.stopPropagation(); toggleLike(product.id, event); }}
                >
                  <Heart className={`h-4 w-4 ${likedProducts[product.id] ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
              
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-canteen-dark dark:text-white">{product.name}</h3>
                </div>
                <p className="text-canteen-darkgray dark:text-gray-400 text-sm">{product.description}</p>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <div className="flex items-center mt-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < (product.rating || 5) ? 'text-canteen-yellow fill-canteen-yellow dark:text-secondary dark:fill-secondary' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-canteen-darkgray dark:text-gray-400 ml-1">({product.reviews || 42})</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="font-bold text-lg text-canteen-dark dark:text-white">
                  {product.price.toFixed(2)}€
                </div>
                <Button 
                  className="bg-gradient-to-r from-canteen-teal to-canteen-mint dark:from-primary dark:to-canteen-mint hover:opacity-90 text-white"
                  size="sm"
                  onClick={(event) => { event.stopPropagation(); handleAddToCart(product, event); }}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Προσθήκη
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination dots (for mobile) */}
      {isMobile && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: Math.ceil(products.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-canteen-teal dark:bg-primary w-4'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
              onClick={(event) => { event.stopPropagation(); setCurrentIndex(index); }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
