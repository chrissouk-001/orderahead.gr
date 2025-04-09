import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingCart, Heart, AlertTriangle, Info, X, Filter, ChevronDown, ArrowLeft, ArrowRight, Star, Leaf, Sprout, Check, Eye, Grid2X2, List, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { products, getProductsByCategory } from '@/data/products';
import { Product, ProductCategory } from '@/types/product';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Health indicator types
type HealthIndicator = 'healthy' | 'moderate' | 'unhealthy';
type DietaryInfo = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'contains-nuts' | 'diabetes-friendly';
type AllergyInfo = 'contains-gluten' | 'contains-lactose' | 'contains-nuts' | 'contains-soy' | 'contains-eggs';
type SortOption = 'popular' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';
type ViewMode = 'grid' | 'list';

// Helper function to get health indicators
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

// Helper function to get dietary information
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

// Helper function to get allergy information
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

// Helper function for ratings
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

const dietaryFilters: { value: DietaryInfo; label: string }[] = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Χορτοφαγικά' },
  { value: 'gluten-free', label: 'Χωρίς Γλουτένη' },
  { value: 'dairy-free', label: 'Χωρίς Γαλακτοκομικά' },
  { value: 'nut-free', label: 'Χωρίς Ξηρούς Καρπούς' },
  { value: 'diabetes-friendly', label: 'Για Διαβητικούς' },
];

const healthFilters: { value: HealthIndicator; label: string }[] = [
  { value: 'healthy', label: 'Υγιεινά' },
  { value: 'moderate', label: 'Ισορροπημένα' },
  { value: 'unhealthy', label: 'Λιγότερο Υγιεινά' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Δημοφιλή' },
  { value: 'price-low', label: 'Τιμή (Χαμηλή → Υψηλή)' },
  { value: 'price-high', label: 'Τιμή (Υψηλή → Χαμηλή)' },
  { value: 'name-asc', label: 'Όνομα (Α → Ω)' },
  { value: 'name-desc', label: 'Όνομα (Ω → Α)' },
];

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

const Menu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [healthFiltersSelected, setHealthFiltersSelected] = useState<HealthIndicator[]>([]);
  const [dietaryFiltersSelected, setDietaryFiltersSelected] = useState<DietaryInfo[]>([]);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addItem, getTotalItems } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const sortOptionsRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      
      // Reset to grid view on mobile
      if (window.innerWidth < 768 && viewMode === 'list') {
        setViewMode('grid');
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [viewMode]);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSortOptions &&
        sortOptionsRef.current &&
        !sortOptionsRef.current.contains(event.target as Node) &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setShowSortOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortOptions]);
  
  // Apply filters logic
  const applyFilters = () => {
    setIsFiltersApplied(healthFiltersSelected.length > 0 || dietaryFiltersSelected.length > 0);
    setShowFilters(false);
  };
  
  // Clear filters logic
  const clearFilters = () => {
    setHealthFiltersSelected([]);
    setDietaryFiltersSelected([]);
    setIsFiltersApplied(false);
    setShowFilters(false);
  };
  
  // Toggle health filter
  const toggleHealthFilter = (filter: HealthIndicator) => {
    setHealthFiltersSelected(prev => 
      prev.includes(filter) 
        ? prev.filter(item => item !== filter) 
        : [...prev, filter]
    );
  };
  
  // Toggle dietary filter
  const toggleDietaryFilter = (filter: DietaryInfo) => {
    setDietaryFiltersSelected(prev => 
      prev.includes(filter) 
        ? prev.filter(item => item !== filter) 
        : [...prev, filter]
    );
  };
  
  // Filter products based on search, category, and additional filters
  const filteredProducts = products.filter(product => {
    // Search text filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      activeCategory === 'all' || product.category === activeCategory;
    
    // Health filter
    const matchesHealth = 
      healthFiltersSelected.length === 0 || 
      healthFiltersSelected.includes(getHealthInfo(product.id));
    
    // Dietary filter
    const matchesDietary = 
      dietaryFiltersSelected.length === 0 || 
      dietaryFiltersSelected.some(filter => 
        getDietaryInfo(product.id).includes(filter)
      );
    
    return matchesSearch && matchesCategory && matchesHealth && matchesDietary;
  });
  
  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // This gives higher priority to popular items (negative value puts them first)
        return (a.popular ? 0 : 1) - (b.popular ? 0 : 1);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name, 'el');
      case 'name-desc':
        return b.name.localeCompare(a.name, 'el');
      default:
        return 0;
    }
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
  
  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0b1220] to-[#051129]">
      <main className="bg-gray-50 dark:bg-background min-h-screen pb-16">
        <div className="container mx-auto px-4 pt-8">
          {/* Main Catalog Header */}
          <div className="bg-gradient-to-r from-primary/90 to-primary dark:from-primary/80 dark:to-primary/90 mb-6 rounded-lg shadow-md backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Κατάλογος
              </h1>
              <p className="text-white/90 max-w-2xl">
                Επιλέξτε τα προϊόντα σας και παραγγείλτε εύκολα και γρήγορα
              </p>
            </div>
          </div>
          
          {/* Search and Filter Control Panel */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση προϊόντων..."
                className="pl-9 w-full bg-background dark:bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1">
                    <Filter className="h-4 w-4" />
                    Φίλτρα
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Ταξινόμηση</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map((option) => (
                    <DropdownMenuItem 
                      key={option.value}
                      className={sortBy === option.value ? "bg-accent text-accent-foreground" : ""}
                      onClick={() => setSortBy(option.value)}
                    >
                      {option.label}
                      {sortBy === option.value && (
                        <Check className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex border border-border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-none rounded-l-md ${viewMode === 'grid' ? 'bg-accent' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-none rounded-r-md ${viewMode === 'list' ? 'bg-accent' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
            <Button
              variant={activeCategory === 'all' ? "default" : "outline"}
              size="sm"
              className={`rounded-full text-sm px-4 ${activeCategory === 'all' ? '' : 'border-border/60 hover:bg-accent/50'}`}
              onClick={() => setActiveCategory('all')}
            >
              Όλα
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? "default" : "outline"}
                size="sm"
                className={`rounded-full text-sm px-4 ${activeCategory === category.value ? '' : 'border-border/60 hover:bg-accent/50'}`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Filter panel with improved styling */}
          {showFilters && (
            <motion.div 
              id="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 border border-gray-100 dark:border-[#1d2f4f]/50 rounded-xl bg-white dark:bg-card shadow-sm backdrop-blur-sm"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-canteen-dark dark:text-white">Φίλτρα</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-canteen-dark dark:text-gray-400 dark:hover:text-white"
                    onClick={() => setShowFilters(false)}
                    aria-label="Κλείσιμο φίλτρων"
                  >
                    <X size={18} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-canteen-dark dark:text-white mb-4">Διατροφικό προφίλ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {healthFilters.map((filter) => (
                        <div key={filter.value} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`health-${filter.value}`} 
                            checked={healthFiltersSelected.includes(filter.value)}
                            onCheckedChange={() => toggleHealthFilter(filter.value)}
                            className="border-gray-300 dark:border-[#1d2f4f] data-[state=checked]:bg-canteen-teal data-[state=checked]:border-canteen-teal"
                          />
                          <Label 
                            htmlFor={`health-${filter.value}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {filter.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-canteen-dark dark:text-white mb-4">Διατροφικές προτιμήσεις</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {dietaryFilters.map((filter) => (
                        <div key={filter.value} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`dietary-${filter.value}`} 
                            checked={dietaryFiltersSelected.includes(filter.value)}
                            onCheckedChange={() => toggleDietaryFilter(filter.value)}
                            className="border-gray-300 dark:border-[#1d2f4f] data-[state=checked]:bg-canteen-teal data-[state=checked]:border-canteen-teal"
                          />
                          <Label 
                            htmlFor={`dietary-${filter.value}`}
                            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {filter.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100 dark:border-[#1d2f4f]/50">
                  <Button
                    variant="outline"
                    className="mr-3 border-gray-200 dark:border-[#1d2f4f] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    onClick={clearFilters}
                  >
                    Καθαρισμός
                  </Button>
                  <Button
                    className="bg-canteen-teal hover:bg-canteen-teal/90 text-white"
                    onClick={() => {
                      applyFilters();
                      setShowFilters(false);
                    }}
                  >
                    Εφαρμογή
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="w-full">
            {/* Products Grid/List with Animation */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6" 
              : "flex flex-col gap-4"
            }>
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className={addedProduct === product.id ? 'animate-pulse-subtle' : ''}
                >
                  {viewMode === 'grid' ? (
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onImageError={handleImageError}
                      hasImageError={!!imageErrors[product.id]}
                    />
                  ) : (
                    <ProductListItem
                      product={product}
                      onAddToCart={handleAddToCart}
                      onImageError={handleImageError}
                      hasImageError={!!imageErrors[product.id]}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <Info className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Δεν βρέθηκαν προϊόντα</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης ή να καθαρίσετε όλα τα φίλτρα για να δείτε περισσότερα προϊόντα.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setHealthFiltersSelected([]);
                    setDietaryFiltersSelected([]);
                  }}
                >
                  Καθαρισμός φίλτρων
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
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
          <Star key={`full-${i}`} className="w-4 h-4 fill-canteen-yellow stroke-canteen-yellow dark:fill-secondary dark:stroke-secondary" />
        ))}
        {halfStar && (
          <div className="relative">
            <Star className="w-4 h-4 stroke-canteen-yellow dark:stroke-secondary" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-canteen-yellow stroke-canteen-yellow dark:fill-secondary dark:stroke-secondary" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 stroke-canteen-yellow dark:stroke-secondary" />
        ))}
      </div>
    );
  };

  return (
    <div className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-border dark:border-border hover:shadow-lg bg-card dark:bg-card relative">
      {/* Image Container */}
      <div 
        className="relative overflow-hidden cursor-pointer aspect-[4/3]"
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
        <div className="absolute top-0 right-0 z-10 p-2">
          <div className="px-3 py-1.5 bg-background/80 dark:bg-background/80 backdrop-blur-md rounded-full text-foreground dark:text-foreground font-bold border border-border">
            {product.price.toFixed(2)}€
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-0 left-0 z-10 p-2">
          <Badge variant="outline" className="bg-background/80 dark:bg-background/80 backdrop-blur-md border-border text-foreground dark:text-foreground">
            {categories.find(c => c.value === product.category)?.label || product.category}
          </Badge>
        </div>
        
        {/* Health/Dietary Indicators */}
        <div className="absolute bottom-0 left-0 z-10 p-2 flex gap-1.5">
          {healthInfo === 'healthy' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-8 h-8 rounded-full bg-green-500/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Leaf className="w-4 h-4" />
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
                  <div className="w-8 h-8 rounded-full bg-green-600/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Sprout className="w-4 h-4" />
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
                  <div className="w-8 h-8 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-white">
                    <Star className="w-4 h-4" />
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
          <Badge className="absolute top-11 left-3 z-10 bg-canteen-coral/90 dark:bg-canteen-coral/90 text-white py-1 px-2.5 text-xs rounded-full shadow-md">
            <Sparkles className="h-3 w-3 mr-1" />
            Νέο
          </Badge>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow space-y-2">
        {/* Title and Stars */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            {renderStars(rating)}
            <span className="text-xs text-muted-foreground ml-1">({count})</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{product.description}</p>
        
        {/* Action Button */}
        <Button 
          onClick={() => onAddToCart(product)}
          variant="default" 
          size="sm" 
          className="w-full mt-auto gap-1 group-hover:bg-primary/90"
        >
          <ShoppingCart className="w-4 h-4" />
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
                {categories.find(c => c.value === product.category)?.label}
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

interface ProductListItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onImageError: (productId: string) => void;
  hasImageError: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ 
  product, 
  onAddToCart,
  onImageError,
  hasImageError
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
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
  
  const getHealthLabel = (): { text: string; color: string } => {
    const labels: Record<HealthIndicator, { text: string; color: string }> = {
      'healthy': { text: 'Υγιεινό', color: 'bg-green-500 text-white' },
      'moderate': { text: 'Ισορροπημένο', color: 'bg-yellow-500 text-white' },
      'unhealthy': { text: 'Λιγότερο Υγιεινό', color: 'bg-red-500 text-white' }
    };
    
    return labels[healthInfo];
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

  return (
    <div className="group flex flex-col sm:flex-row overflow-hidden border border-border dark:border-border hover:shadow-lg bg-card dark:bg-card transition-all duration-300 hover:scale-[1.01]">
      {/* Product Image */}
      <div className="relative w-full sm:w-40 md:w-48 aspect-[4/3] sm:aspect-square overflow-hidden">
        <img 
          src={getProductImage(product, hasImageError)} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
          onError={() => onImageError(product.id)}
          onClick={() => setIsDialogOpen(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-l sm:from-black/60 opacity-60 transition-opacity duration-300"></div>
        
        {/* Price Tag */}
        <div className="absolute top-2 right-2 z-10">
          <div className="px-2 py-1 bg-background/80 dark:bg-background/80 backdrop-blur-md rounded-full text-foreground dark:text-foreground font-bold text-sm border border-border">
            {product.price.toFixed(2)}€
          </div>
        </div>
        
        {/* New Badge */}
        {product.isNew && (
          <Badge className="absolute top-11 left-3 z-10 bg-canteen-coral/90 dark:bg-canteen-coral/90 text-white py-1 px-2.5 text-xs rounded-full shadow-md">
            <Sparkles className="h-3 w-3 mr-1" />
            Νέο
          </Badge>
        )}
      </div>
      
      {/* Product Content */}
      <div className="flex-1 p-4 flex flex-col relative">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            {/* Category Badge */}
            <Badge variant="outline" className="mb-2 border-border bg-background/80 dark:bg-background/80 text-xs text-foreground">
              {categories.find(c => c.value === product.category)?.label || product.category}
            </Badge>
            
            {/* Product Title */}
            <h3 className="font-semibold text-foreground">{product.name}</h3>
            
            {/* Ratings */}
            <div className="flex items-center mt-1">
              {renderStars(rating)}
              <span className="text-xs text-muted-foreground ml-1">({count})</span>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex gap-1.5">
            {healthInfo === 'healthy' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-7 h-7 rounded-full bg-green-500/90 backdrop-blur-md flex items-center justify-center text-white">
                      <Leaf className="w-3.5 h-3.5" />
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
                    <div className="w-7 h-7 rounded-full bg-green-600/90 backdrop-blur-md flex items-center justify-center text-white">
                      <Sprout className="w-3.5 h-3.5" />
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
                    <div className="w-7 h-7 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-white">
                      <Star className="w-3.5 h-3.5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Δημοφιλές</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        
        {/* Quick Info */}
        <div className="flex flex-wrap gap-1 mb-4">
          {dietaryInfo.length > 0 && dietaryInfo.slice(0, 3).map((info, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-accent/10 border-border">
              {formatDietaryInfo(info)}
            </Badge>
          ))}
          {dietaryInfo.length > 3 && (
            <Badge variant="outline" className="text-xs bg-accent/10 border-border">
              +{dietaryInfo.length - 3}
            </Badge>
          )}
          
          {allergyInfo.length > 0 && (
            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {allergyInfo.length} {allergyInfo.length === 1 ? 'αλλεργιογόνο' : 'αλλεργιογόνα'}
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-border"
            onClick={() => setIsDialogOpen(true)}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Λεπτομέρειες
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="w-4 h-4" />
            Προσθήκη
          </Button>
        </div>
      </div>
      
      {/* Product Detail Dialog - Same as in ProductCard */}
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
                {categories.find(c => c.value === product.category)?.label}
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

export default Menu;
