import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { getPopularProducts } from '@/data/products';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Star, 
  Heart,
  Leaf,
  Sprout,
  AlertTriangle
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";

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

// Helper function for ratings
const getRating = (productId: string): { rating: number; count: number } => {
  // Mock implementation for rating
  const ratingMap: Record<string, number> = {
    "1": 5, // Sandwich - 5 stars
    "2": 4, // Cheese pie - 4 stars
    "3": 5, // Koulouri - 5 stars
    "4": 5, // Orange juice - 5 stars
    "5": 4.5, // Water - 4.5 stars
    "6": 4, // Chocolate Muffin - 4 stars
    "7": 5, // Granola Bar - 5 stars
    "8": 4.5, // Spinach pie - 4.5 stars
    "9": 4, // Toast - 4 stars
    "10": 4.5 // Chocolate milk - 4.5 stars
  };
  
  const countMap: Record<string, number> = {
    "1": 12,
    "2": 8,
    "3": 15,
    "4": 10,
    "5": 6,
    "6": 9,
    "7": 7,
    "8": 11,
    "9": 8,
    "10": 9
  };
  
  return { 
    rating: ratingMap[productId] || 4.5,
    count: countMap[productId] || 5
  };
};

export function ProductCarousel() {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const products = getPopularProducts();
  
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      return;
    }
    
    addItem(product);
    toast.success(
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <div>
          <p className="font-medium">Προστέθηκε στο καλάθι</p>
          <p className="text-sm text-gray-500">{product.name}</p>
        </div>
      </div>
    );
  };
  
  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
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
  
  // Helper function to get product image
  const getProductImage = (product: Product, hasError: boolean) => {
    if (!hasError && product.image) {
      return product.image;
    }
    
    // Category-specific placeholders
    const categoryPlaceholders: Record<string, string> = {
      'sandwich': '/images/products/sandwich.jpg',
      'pastry': '/images/products/cheese-pie.jpg',
      'snack': '/images/products/cereal-bar.jpg',
      'sweet': '/images/products/chocolate-croissant.jpg',
      'drink': '/images/products/orange-juice.jpg'
    };
    
    return categoryPlaceholders[product.category] || '/images/placeholder.jpg';
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
        <div className="grid grid-cols-2 gap-3">
          {getVisibleProducts().map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                hasImageError={!!imageErrors[product.id]}
                onImageError={handleImageError}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 dark:bg-background/80 shadow-sm border border-border w-7 h-7"
          onClick={goToPrev}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
      </div>
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 dark:bg-background/80 shadow-sm border border-border w-7 h-7"
          onClick={goToNext}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  hasImageError: boolean;
  onImageError: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  hasImageError, 
  onImageError 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const healthInfo = getHealthInfo(product.id);
  const dietaryInfo = getDietaryInfo(product.id);
  const allergyInfo = getAllergyInfo(product.id);
  const { rating, count } = getRating(product.id);
  
  const formatDietaryInfo = (info: DietaryInfo): string => {
    const formatMap: Record<DietaryInfo, string> = {
      'vegan': 'Vegan',
      'vegetarian': 'Χορτοφαγικό',
      'gluten-free': 'Χωρίς Γλουτένη',
      'dairy-free': 'Χωρίς Γαλακτοκομικά',
      'nut-free': 'Χωρίς Ξηρούς Καρπούς',
      'contains-nuts': 'Περιέχει Ξηρούς Καρπούς',
      'diabetes-friendly': 'Κατάλληλο για Διαβητικούς'
    };
    
    return formatMap[info] || info;
  };
  
  const formatAllergyInfo = (info: AllergyInfo): string => {
    const formatMap: Record<AllergyInfo, string> = {
      'contains-gluten': 'Περιέχει Γλουτένη',
      'contains-lactose': 'Περιέχει Λακτόζη',
      'contains-nuts': 'Περιέχει Ξηρούς Καρπούς',
      'contains-soy': 'Περιέχει Σόγια',
      'contains-eggs': 'Περιέχει Αυγά'
    };
    
    return formatMap[info] || info;
  };
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-canteen-yellow stroke-canteen-yellow dark:fill-secondary dark:stroke-secondary" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="w-3.5 h-3.5 stroke-canteen-yellow dark:stroke-secondary" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-canteen-yellow stroke-canteen-yellow dark:fill-secondary dark:stroke-secondary" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3.5 h-3.5 stroke-canteen-yellow dark:stroke-secondary" />
        ))}
      </div>
    );
  };
  
  // Helper function to get product image (defined above)
  const getProductImage = (product: Product, hasError: boolean) => {
    if (!hasError && product.image) {
      return product.image;
    }
    
    // Category-specific placeholders
    const categoryPlaceholders: Record<string, string> = {
      'sandwich': '/images/products/sandwich.jpg',
      'pastry': '/images/products/cheese-pie.jpg',
      'snack': '/images/products/cereal-bar.jpg',
      'sweet': '/images/products/chocolate-croissant.jpg',
      'drink': '/images/products/orange-juice.jpg'
    };
    
    return categoryPlaceholders[product.category] || '/images/placeholder.jpg';
  };
  
  return (
    <div className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-border dark:border-border hover:shadow-md bg-card dark:bg-card relative rounded-lg">
      {/* Image Container */}
      <div 
        className="relative overflow-hidden cursor-pointer aspect-[3/2]"
        onClick={() => setIsDialogOpen(true)}
      >
        <img 
          src={getProductImage(product, hasImageError)} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
          onError={() => onImageError(product.id)}
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 transition-opacity duration-300"></div>
        
        {/* Price Tag */}
        <div className="absolute top-1 right-1 z-10">
          <div className="px-1.5 py-0.5 bg-background/80 dark:bg-background/80 backdrop-blur-md rounded-full text-foreground dark:text-foreground font-bold text-xs border border-border">
            {product.price.toFixed(2)}€
          </div>
        </div>
        
        {/* Health/Dietary Indicators */}
        <div className="absolute bottom-1 left-1 z-10 flex gap-1">
          {healthInfo === 'healthy' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-5 h-5 rounded-full bg-green-500/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Leaf className="w-3 h-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Υγιεινό</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {dietaryInfo.includes('vegan') && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-5 h-5 rounded-full bg-green-600/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Sprout className="w-3 h-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Vegan</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {product.popular && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-5 h-5 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Star className="w-3 h-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Δημοφιλές</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {/* New Badge */}
        {product.isNew && (
          <div className="absolute -top-1 -right-1 z-20">
            <div className="relative">
              <div className="w-8 h-8 overflow-hidden rotate-45 transform origin-bottom-left">
                <div className="bg-accent text-accent-foreground text-[10px] h-4 flex items-center justify-center font-bold shadow-sm">
                  Νέο
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-2 flex flex-col flex-grow space-y-1">
        {/* Title and Stars */}
        <div>
          <h3 className="font-semibold text-sm text-foreground line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            {renderStars(rating)}
            <span className="text-[10px] text-muted-foreground ml-1">({count})</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-1 flex-grow">{product.description}</p>
        
        {/* Action Button */}
        <Button 
          onClick={() => onAddToCart(product)}
          variant="default" 
          size="sm" 
          className="w-full h-7 mt-auto gap-1 group-hover:bg-primary/90 text-xs"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Προσθήκη</span>
        </Button>
      </div>
      
      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-background dark:bg-background border-border">
          <div className="relative aspect-[3/2]">
            <img 
              src={getProductImage(product, hasImageError)} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Product Name Overlay */}
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
              <div className="flex items-center mt-1">
                {renderStars(rating)}
                <span className="text-xs text-white/80 ml-1">({count})</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Price and Category */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-border bg-accent/10 text-foreground">
                {product.category}
              </Badge>
              <p className="text-xl font-bold text-foreground">{product.price.toFixed(2)}€</p>
            </div>
            
            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>
            
            {/* Dietary Info */}
            {dietaryInfo.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">Διατροφικές Πληροφορίες</h4>
                <div className="flex flex-wrap gap-1">
                  {dietaryInfo.map((info, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-accent/10 border-border">
                      {formatDietaryInfo(info)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Allergy Info */}
            {allergyInfo.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  Προειδοποιήσεις Αλλεργιών
                </h4>
                <div className="flex flex-wrap gap-1">
                  {allergyInfo.map((info, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                      {formatAllergyInfo(info)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Add to Cart Button */}
            <Button 
              onClick={() => {
                onAddToCart(product);
                setIsDialogOpen(false);
              }}
              className="w-full gap-2 mt-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Προσθήκη στο καλάθι
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
