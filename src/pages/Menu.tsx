import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingBag, Heart, AlertTriangle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { products, getProductsByCategory } from '@/data/products';
import { Product, ProductCategory } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MiniCart from '@/components/MiniCart';
import { toast } from 'sonner';

// Health indicator types
type HealthIndicator = 'healthy' | 'moderate' | 'unhealthy';
type DietaryInfo = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'contains-nuts' | 'diabetes-friendly';
type AllergyInfo = 'contains-gluten' | 'contains-lactose' | 'contains-nuts' | 'contains-soy' | 'contains-eggs';

// Mock function to get health indicators - in a real app, this would come from your product data
const getHealthInfo = (productId: string): HealthIndicator => {
  // Mock implementation - in a real app, this would be based on actual product data
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
  // Mock implementation
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
  // Mock implementation
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

// Add this helper function after the existing helper functions
const getRating = (productId: string): { rating: number; count: number } => {
  // Mock implementation for rating based on product ID
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

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'sandwich', label: 'Σάντουιτς' },
  { value: 'pastry', label: 'Αρτοσκευάσματα' },
  { value: 'snack', label: 'Σνακ' },
  { value: 'sweet', label: 'Γλυκά' },
  { value: 'drink', label: 'Ροφήματα' },
];

// Add this helper function before the Menu component definition
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

const Menu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const { addItem, getTotalItems } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Add ref for mini cart container
  const miniCartRef = React.useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Filter products by search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === 'all' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      toast.error('Παρακαλώ συνδεθείτε για να προσθέσετε προϊόντα στο καλάθι');
      navigate('/login');
      return;
    }
    
    // Set the added product to show animation
    setAddedProduct(product.id);
    
    // Clear the animation after 1 second
    setTimeout(() => {
      setAddedProduct(null);
    }, 1000);
    
    addItem(product);
    // Show mini cart after adding an item
    setShowMiniCart(true);
    // Auto-hide after 4 seconds
    setTimeout(() => setShowMiniCart(false), 4000);
    
    // Show success toast with product image
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
      </div>,
      {
        duration: 3000,
        className: 'bg-white dark:bg-gray-800'
      }
    );
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };
  
  const toggleMiniCart = () => {
    setShowMiniCart(prev => !prev);
  };
  
  // Add click outside handler to close mini cart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (miniCartRef.current && !miniCartRef.current.contains(event.target as Node) && showMiniCart) {
        setShowMiniCart(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMiniCart]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold mb-4 md:mb-0 text-gray-900 dark:text-white transition-colors duration-300">Κατάλογος Προϊόντων</h1>
          
          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-colors duration-300" size={18} />
              <Input
                placeholder="Αναζήτηση προϊόντων..."
                className="pl-10 w-full md:w-80 bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-700 focus:ring-teal-500 dark:focus:ring-primary rounded-md transition-colors duration-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isAuthenticated && (
              <div className="relative">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="relative flex-shrink-0 bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-full transition-colors duration-300"
                  onClick={toggleMiniCart}
                >
                  <ShoppingBag className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-300" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal-600 dark:bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transition-colors duration-300">
                      {getTotalItems()}
                    </span>
                  )}
                </Button>
                
                {/* Enhanced Mini Cart Display */}
                {showMiniCart && (
                  <div 
                    ref={miniCartRef}
                    className="absolute z-50 right-0 mt-2 w-80 animate-in fade-in slide-in-from-top-5 duration-300 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                    style={{ maxHeight: '80vh', overflowY: 'auto' }}
                  >
                    <MiniCart layout="compact" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <TabsList className="mb-6 flex flex-wrap overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-transparent p-0 gap-2 transition-colors duration-300">
                <TabsTrigger 
                  value="all" 
                  className="rounded-t-md border-b-2 border-transparent py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600 dark:data-[state=active]:border-primary dark:data-[state=active]:text-white bg-transparent transition-colors duration-300"
                >
                  Όλα
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="rounded-t-md border-b-2 border-transparent py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 data-[state=active]:border-teal-600 data-[state=active]:text-teal-600 dark:data-[state=active]:border-primary dark:data-[state=active]:text-white bg-transparent transition-colors duration-300"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Empty State Check */}
              {filteredProducts.length === 0 && activeCategory === 'all' && (
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Δεν βρέθηκαν προϊόντα</p>
                  <p className="text-sm">Δοκιμάστε να αλλάξετε την κατηγορία ή τον όρο αναζήτησης.</p>
                </div>
              )}
              
              {/* Render All products tab content */}
              {(filteredProducts.length > 0 || activeCategory !== 'all') && (
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {activeCategory === 'all' && filteredProducts.map((product) => (
                      <div key={product.id} className="relative h-full">
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          onImageError={handleImageError}
                          hasImageError={!!imageErrors[product.id]}
                        />
                        {addedProduct === product.id && (
                          <div className="absolute inset-0 bg-gray-400/10 dark:bg-gray-300/10 rounded-xl border-2 border-gray-300 dark:border-gray-500 pointer-events-none animate-in fade-in-0 fade-out-95 zoom-in-95 duration-700 z-10 transition-colors duration-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
              
              {categories.map((category) => {
                // Calculate products for this specific category tab
                const categoryProducts = getProductsByCategory(category.value)
                  .filter(product => 
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  
                return (
                  <TabsContent key={category.value} value={category.value} className="mt-0">
                    {/* Empty State Check for specific category */}
                    {categoryProducts.length === 0 && activeCategory === category.value && (
                      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Δεν βρέθηκαν προϊόντα σε αυτήν την κατηγορία</p>
                        <p className="text-sm">Δοκιμάστε να αλλάξετε τον όρο αναζήτησης ή να επιλέξετε άλλη κατηγορία.</p>
                      </div>
                    )}
                    {/* Render grid only if products exist for this category */}
                    {categoryProducts.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {categoryProducts.map((product) => (
                          <div key={product.id} className="relative h-full">
                            <ProductCard
                              product={product}
                              onAddToCart={handleAddToCart}
                              onImageError={handleImageError}
                              hasImageError={!!imageErrors[product.id]}
                            />
                            {addedProduct === product.id && (
                              <div className="absolute inset-0 bg-gray-400/10 dark:bg-gray-300/10 rounded-xl border-2 border-gray-300 dark:border-gray-500 pointer-events-none animate-in fade-in-0 fade-out-95 zoom-in-95 duration-700 z-10 transition-colors duration-300"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
          
          {/* Desktop mini cart */}
          {!isMobile && isAuthenticated && (
            <div className="w-full lg:w-1/4 hidden lg:block">
              <div className="sticky top-24 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A]">
                <MiniCart layout="compact" />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onImageError: (productId: string) => void;
  hasImageError: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  onImageError,
  hasImageError
}) => {
  const healthInfo = getHealthInfo(product.id);
  const dietaryInfo = getDietaryInfo(product.id);
  const allergyInfo = getAllergyInfo(product.id);
  const { rating, count } = getRating(product.id);
  
  // Format dietary info for display (Ensure these match the required text in the image)
  const formatDietaryInfo = (info: DietaryInfo): string => {
    switch(info) {
      case 'vegan': return 'Κατάλληλο για Vegans';
      case 'vegetarian': return 'Κατάλληλο για Χορτοφάγους';
      case 'gluten-free': return 'Χωρίς Γλουτένη';
      case 'dairy-free': return 'Χωρίς Γαλακτοκομικά';
      case 'nut-free': return 'Χωρίς Ξηρούς Καρπούς';
      case 'contains-nuts': return 'Περιέχει Ξηρούς Καρπούς';
      case 'diabetes-friendly': return 'Κατάλληλο για Διαβητικούς';
      default: return info;
    }
  };
  
  // Format allergy info for display (Ensure these match the required text in the image)
  const formatAllergyInfo = (info: AllergyInfo): string => {
    switch(info) {
      case 'contains-gluten': return 'Περιέχει Γλουτένη';
      case 'contains-lactose': return 'Περιέχει Λακτόζη';
      case 'contains-nuts': return 'Περιέχει Ξηρούς Καρπούς';
      case 'contains-soy': return 'Περιέχει Σόγια';
      case 'contains-eggs': return 'Περιέχει Αυγά';
      default: return info;
    }
  };
  
  // Health indicator colors and icon matching the image exactly
  const healthColors = {
    healthy: {
      bg: 'bg-emerald-500 dark:bg-emerald-600',
      text: 'text-white',
      icon: <Heart className="h-3 w-3 mr-1" />
    },
    moderate: {
      bg: 'bg-amber-500 dark:bg-amber-600',
      text: 'text-white',
      icon: <Info className="h-3 w-3 mr-1" />
    },
    unhealthy: {
      bg: 'bg-red-500 dark:bg-red-600',
      text: 'text-white',
      icon: <AlertTriangle className="h-3 w-3 mr-1" />
    }
  };
  
  // Generate star rating display
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex text-sm">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-amber-500 dark:text-amber-400">★</span>
        ))}
        {hasHalfStar && <span className="text-amber-500 dark:text-amber-400">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 dark:text-gray-600">★</span>
        ))}
      </div>
    );
  };
  
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1A1A] shadow-sm hover:shadow-md transition-all duration-300 h-full">
      {/* Image container with enhanced styling */}
      <div className="relative">
        <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-[#121212] transition-colors duration-300">
          <img 
            src={getProductImage(product, hasImageError)}
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => onImageError(product.id)}
            loading="lazy"
          />
          {/* Enhanced gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
        
        {/* Improved badge positioning and styling */}
        <div className="absolute top-3 left-0 right-0 flex flex-wrap justify-between px-3 gap-2">
          <div className="flex flex-wrap gap-2">
            {product.isNew && (
              <span className="bg-amber-500 dark:bg-amber-600 text-white text-xs font-semibold py-1 px-2.5 rounded shadow-sm transition-colors duration-300">
                Νέο
              </span>
            )}
            <span className={`${healthColors[healthInfo].bg} ${healthColors[healthInfo].text} text-xs font-semibold py-1 px-2.5 rounded shadow-sm flex items-center transition-colors duration-300`}>
              {healthColors[healthInfo].icon}
              {healthInfo === 'healthy' ? 'Υγιεινό' : healthInfo === 'moderate' ? 'Ισορροπημένο' : 'Ανθυγιεινό'}
            </span>
          </div>
          {product.popular && (
            <span className="bg-teal-600 dark:bg-primary text-white text-xs font-semibold py-1 px-2.5 rounded shadow-sm transition-colors duration-300">
              ★ Δημοφιλές
            </span>
          )}
        </div>
        
        {/* Enhanced product title and description overlay with better typography */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 text-white z-10">
          <h3 className="text-lg font-semibold text-white mb-0.5 drop-shadow-sm">{product.name}</h3>
          <p className="text-sm text-gray-100 line-clamp-2 drop-shadow-sm">{product.description}</p>
        </div>
      </div>
      
      {/* Content section with improved spacing */}
      <div className="p-4 flex-grow flex flex-col">      
        {/* Ratings with enhanced styling */}
        <div className="flex items-center mb-3">
          {renderStars(rating)}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 transition-colors duration-300">({count})</span>
        </div>
        
        {/* Enhanced Dietary & Allergy Info with visual appeal */}
        <div className="space-y-3 mb-8">
          {dietaryInfo.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-2.5 transition-all duration-300 hover:shadow-sm">
              <h4 className="font-medium text-xs mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Διατροφικά στοιχεία
              </h4>
              <div className="flex flex-wrap gap-2">
                {dietaryInfo.map((info, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs rounded-full font-medium bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border border-blue-100 dark:border-blue-800 flex items-center shadow-sm transition-all duration-300 hover:scale-105"
                  >
                    {formatDietaryInfo(info)}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {allergyInfo.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-2.5 transition-all duration-300 hover:shadow-sm">
              <h4 className="font-medium text-xs mb-2 text-gray-700 dark:text-gray-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-amber-500 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Πληροφορίες αλλεργιογόνων
              </h4>
              <div className="flex flex-wrap gap-2">
                {allergyInfo.map((info, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs rounded-full font-medium bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-200 border border-red-100 dark:border-red-800 flex items-center shadow-sm transition-all duration-300 hover:scale-105"
                  >
                    {formatAllergyInfo(info)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Price styling closer to the image */}
      <div className="absolute bottom-4 left-4">
        <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">
          {product.price.toFixed(2)}€
        </span>
      </div>
      
      {/* Add to cart button with enhanced styling */}
      <div className="absolute bottom-4 right-4">
        <Button 
          size="icon"
          className="rounded-full h-9 w-9 bg-teal-600 hover:bg-teal-700 dark:bg-[#2A2A2A] dark:hover:bg-[#3A3A3A] text-white dark:text-gray-300 shadow-md transition-colors duration-300"
          onClick={() => onAddToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Menu;
