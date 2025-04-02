import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingBag, Heart, AlertTriangle, Info, X, Filter, ChevronDown, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { products, getProductsByCategory } from '@/data/products';
import { Product, ProductCategory } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { motion } from "framer-motion";

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
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
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
      <Navbar />
      
      <main className="bg-gray-50 dark:bg-background min-h-screen pb-16">
        <div className="container mx-auto px-4 pt-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-canteen-dark dark:text-white">Κατάλογος</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Επιλέξτε τα προϊόντα σας και παραγγείλτε εύκολα και γρήγορα
            </p>
          </div>
          
          {/* Search and Filters Row */}
          <div className="mb-8">
            <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-gray-200 dark:border-[#1d2f4f] overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-grow flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        type="search"
                        placeholder="Αναζήτηση προϊόντων..."
                        className="w-full pl-10 bg-gray-50/50 dark:bg-[#0b1220]/50 border-gray-200 dark:border-[#1d2f4f] focus:border-canteen-teal dark:focus:border-primary text-canteen-dark dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        ref={searchInputRef}
                        aria-label="Αναζήτηση προϊόντων"
                      />
                      {searchQuery && (
                        <button 
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => setSearchQuery('')}
                          aria-label="Καθαρισμός αναζήτησης"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Sort and View */}
                    <div className="flex gap-2">
                      {/* Sort Button */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          className="h-10 px-3 bg-gray-50/50 dark:bg-[#0b1220]/50 border-gray-200 dark:border-[#1d2f4f] text-gray-700 dark:text-gray-300 hover:text-canteen-dark dark:hover:text-white hover:border-gray-300 dark:hover:border-[#1a2c47]"
                          onClick={() => setShowSortOptions(!showSortOptions)}
                          ref={sortButtonRef}
                          aria-expanded={showSortOptions}
                          aria-haspopup="listbox"
                        >
                          <span className="mr-1">Ταξινόμηση</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        
                        {/* Sort Options Dropdown */}
                        {showSortOptions && (
                          <motion.div 
                            ref={sortOptionsRef}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-20 mt-1 w-56 bg-white dark:bg-card border border-gray-200 dark:border-[#1d2f4f] rounded-lg shadow-lg overflow-hidden"
                          >
                            <div className="py-1" role="listbox">
                              {sortOptions.map(option => (
                                <button
                                  key={option.value}
                                  className={`w-full text-left px-4 py-2 text-sm ${
                                    sortBy === option.value 
                                      ? 'bg-gray-100 dark:bg-[#1a2c47] text-canteen-teal dark:text-white font-medium' 
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#112136]/70'
                                  }`}
                                  onClick={() => {
                                    setSortBy(option.value);
                                    setShowSortOptions(false);
                                  }}
                                  aria-current={sortBy === option.value ? 'true' : 'false'}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* View Toggle Buttons */}
                      <div className="hidden sm:flex p-0.5 border border-gray-200 dark:border-[#1d2f4f] rounded-lg bg-gray-50/50 dark:bg-[#0b1220]/50">
                        <button
                          className={`p-1.5 rounded-md ${
                            viewMode === 'grid' 
                              ? 'bg-white dark:bg-[#1a2c47] text-canteen-dark dark:text-white shadow-sm' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-canteen-dark dark:hover:text-white'
                          }`}
                          onClick={() => setViewMode('grid')}
                          aria-label="Προβολή πλέγματος"
                          aria-pressed={viewMode === 'grid'}
                        >
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                            <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                          </div>
                        </button>
                        <button
                          className={`p-1.5 rounded-md ${
                            viewMode === 'list' 
                              ? 'bg-white dark:bg-[#1a2c47] text-canteen-dark dark:text-white shadow-sm' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-canteen-dark dark:hover:text-white'
                          }`}
                          onClick={() => setViewMode('list')}
                          aria-label="Προβολή λίστας"
                          aria-pressed={viewMode === 'list'}
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="h-1 w-4 rounded-sm bg-current"></div>
                            <div className="h-1 w-4 rounded-sm bg-current"></div>
                            <div className="h-1 w-4 rounded-sm bg-current"></div>
                          </div>
                        </button>
                      </div>

                      {/* Filter Button */}
                      <Button
                        variant="outline"
                        className="h-10 px-3 bg-gray-50/50 dark:bg-[#0b1220]/50 border-gray-200 dark:border-[#1d2f4f] text-gray-700 dark:text-gray-300 hover:text-canteen-dark dark:hover:text-white hover:border-gray-300 dark:hover:border-[#1a2c47]"
                        onClick={() => setShowFilters(!showFilters)}
                        aria-expanded={showFilters}
                        aria-controls="filter-panel"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        <span>Φίλτρα</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <motion.div 
              id="filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-y border-gray-200 dark:border-[#1d2f4f] bg-gray-50/90 dark:bg-[#0b1220]/90 backdrop-blur-md"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-canteen-dark dark:text-white mb-3">Διατροφικό προφίλ</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {healthFilters.map((filter) => (
                        <div key={filter.value} className="flex items-center space-x-2">
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
                    <h3 className="text-sm font-medium text-canteen-dark dark:text-white mb-3">Διατροφικές προτιμήσεις</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dietaryFilters.map((filter) => (
                        <div key={filter.value} className="flex items-center space-x-2">
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
                
                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="mr-2 border-gray-300 dark:border-[#1d2f4f] text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
                    onClick={clearFilters}
                  >
                    Καθαρισμός
                  </Button>
                  <Button
                    className="bg-canteen-teal text-white hover:bg-canteen-teal/90"
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
            {/* Products grid/list */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-5" 
              : "flex flex-col gap-4"
            }>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/70 dark:bg-[#112136]/70 rounded-xl border border-gray-200 dark:border-[#1d2f4f] backdrop-blur-sm">
                  <Info className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-canteen-dark dark:text-white mb-2">Δεν βρέθηκαν προϊόντα</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Δοκιμάστε να αλλάξετε τα φίλτρα ή τον όρο αναζήτησης.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-gray-200 dark:border-[#1d2f4f] text-canteen-teal dark:text-primary hover:border-canteen-teal dark:hover:border-primary"
                    onClick={clearFilters}
                  >
                    Καθαρισμός φίλτρων
                  </Button>
                </div>
              )}
            </div>
          </div>
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
    <div className="group h-full flex flex-col rounded-xl overflow-hidden relative transition-all duration-300 border border-gray-200 dark:border-[#1d2f4f] hover:border-canteen-teal/50 bg-white/90 dark:bg-[#112136]/80 backdrop-blur-sm">
      {/* Product Image with Gradient Overlay */}
      <div 
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <img 
          src={getProductImage(product, hasImageError)} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          onError={() => onImageError(product.id)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 dark:from-[#051129]/80 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Health Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          <Badge className={`${getHealthLabel().color} shadow-md px-2 py-0.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            {getHealthLabel().text}
          </Badge>
        </div>
        
        {/* Product Tags */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {product.popular && (
            <Badge className="bg-gradient-to-r from-canteen-teal to-canteen-mint text-white shadow-md">
              <Star className="w-3 h-3 mr-1" />
              Δημοφιλές
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-canteen-yellow to-canteen-coral text-white shadow-md animate-pulse">
              Νέο
            </Badge>
          )}
        </div>
        
        {/* Quick Action Buttons */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 dark:bg-[#112136]/80 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-[#1a2c47] text-canteen-coral hover:text-canteen-coral opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
            aria-label={`Προσθήκη ${product.name} στα αγαπημένα`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow relative">
        {/* Category Tag */}
        <div className="absolute -top-3 left-4">
          <Badge variant="outline" className="bg-white/90 dark:bg-[#112136]/90 backdrop-blur-sm shadow-sm border-canteen-teal/20 text-canteen-teal text-xs">
            {categories.find(c => c.value === product.category)?.label || product.category}
          </Badge>
        </div>
        
        <h3 
          className="text-lg font-medium text-canteen-dark dark:text-white mt-1 mb-1 line-clamp-1 group-hover:text-canteen-teal transition-colors duration-300 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Product Meta */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Dietary Icons */}
          <div className="flex gap-1">
            {dietaryInfo.includes('vegan') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-green-500/30 bg-green-100/70 dark:bg-green-900/20" title="Vegan">
                <span className="text-green-700 dark:text-green-400 text-xs">V</span>
              </Badge>
            )}
            {dietaryInfo.includes('vegetarian') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-green-500/30 bg-green-100/70 dark:bg-green-900/20" title="Χορτοφαγικό">
                <span className="text-green-700 dark:text-green-400 text-xs">Χ</span>
              </Badge>
            )}
            {dietaryInfo.includes('gluten-free') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-amber-500/30 bg-amber-100/70 dark:bg-amber-900/20" title="Χωρίς Γλουτένη">
                <span className="text-amber-700 dark:text-amber-400 text-xs">G</span>
              </Badge>
            )}
          </div>
          
          {/* Allergy Warning */}
          {allergyInfo.length > 0 && (
            <div 
              className="cursor-help" 
              title={allergyInfo.map(formatAllergyInfo).join(', ')}
            >
              <AlertTriangle className="h-4 w-4 text-canteen-coral" />
            </div>
          )}
          
          {/* Rating */}
          <div className="ml-auto flex items-center">
            {renderStars(rating)}
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({count})</span>
          </div>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-[#1d2f4f]">
          <div className="font-bold text-canteen-dark dark:text-white text-lg">{product.price.toFixed(2)}€</div>
          <Button
            size="sm"
            className="bg-canteen-teal hover:bg-canteen-teal/90 text-white"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Προσθήκη
          </Button>
        </div>
      </div>
      
      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#112136] border border-gray-200 dark:border-[#1d2f4f] text-canteen-dark dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-canteen-dark dark:text-white">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={getProductImage(product, hasImageError)} 
                alt={product.name} 
                className="w-full aspect-square object-cover"
                onError={() => onImageError(product.id)}
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.popular && (
                  <Badge className="bg-gradient-to-r from-canteen-teal to-canteen-mint text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Δημοφιλές
                  </Badge>
                )}
              </div>
              <Badge className={`${getHealthLabel().color} absolute bottom-3 right-3`}>
                {getHealthLabel().text}
              </Badge>
            </div>
            <div className="flex flex-col">
              <div className="mb-3">
                <Badge variant="outline" className="mb-2 border-canteen-teal/20 text-canteen-teal">
                  {categories.find(c => c.value === product.category)?.label || product.category}
                </Badge>
                <h3 className="text-2xl font-medium text-canteen-dark dark:text-white mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">({count} αξιολογήσεις)</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </div>
              
              <Card className="mb-4 bg-gray-50 dark:bg-[#0b1220] border-gray-200 dark:border-[#1d2f4f]">
                <CardHeader className="py-3">
                  <CardTitle className="text-base text-canteen-dark dark:text-white">Διατροφικά στοιχεία</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-canteen-dark dark:text-white">Κατάλληλο για:</h4>
                      <ul className="mt-1 space-y-1">
                        {dietaryInfo.filter(d => !d.startsWith('contains-')).map((info) => (
                          <li key={info} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-canteen-teal mr-2"></span>
                            {formatDietaryInfo(info)}
                          </li>
                        ))}
                        {dietaryInfo.filter(d => !d.startsWith('contains-')).length === 0 && (
                          <li className="text-sm text-gray-400">Δεν υπάρχουν πληροφορίες</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-canteen-dark dark:text-white">Προειδοποιήσεις:</h4>
                      <ul className="mt-1 space-y-1">
                        {allergyInfo.map((info) => (
                          <li key={info} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-canteen-coral mr-2"></span>
                            {formatAllergyInfo(info)}
                          </li>
                        ))}
                        {allergyInfo.length === 0 && (
                          <li className="text-sm text-gray-400">Δεν υπάρχουν προειδοποιήσεις</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="font-bold text-canteen-dark dark:text-white text-2xl">{product.price.toFixed(2)}€</div>
                <Button
                  onClick={() => {
                    onAddToCart(product);
                    setIsDialogOpen(false);
                  }}
                  className="bg-canteen-teal hover:bg-canteen-teal/90 text-white"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Προσθήκη στο καλάθι
                </Button>
              </div>
            </div>
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
    <div className="group flex rounded-xl overflow-hidden relative transition-all duration-300 border border-gray-200 dark:border-[#1d2f4f] hover:border-canteen-teal/50 bg-white/90 dark:bg-[#112136]/80 backdrop-blur-sm">
      {/* Product Image */}
      <div 
        className="relative h-full w-32 sm:w-36 md:w-44 overflow-hidden cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <img 
          src={getProductImage(product, hasImageError)} 
          alt={product.name} 
          className="h-full w-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          onError={() => onImageError(product.id)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 dark:from-[#051129]/80 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Product Tags */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
          {product.popular && (
            <Badge className="bg-gradient-to-r from-canteen-teal to-canteen-mint text-white shadow-md">
              <Star className="w-3 h-3 mr-1" />
              Δημοφιλές
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-canteen-yellow to-canteen-coral text-white shadow-md animate-pulse">
              Νέο
            </Badge>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-1 border-canteen-teal/20 text-canteen-teal text-xs">
              {categories.find(c => c.value === product.category)?.label || product.category}
            </Badge>
            <h3 
              className="text-lg font-medium text-canteen-dark dark:text-white mb-1 group-hover:text-canteen-teal transition-colors duration-300 cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              {product.name}
            </h3>
          </div>
          
          <Badge className={`${getHealthLabel().color} ml-2 shadow-md h-fit`}>
            {getHealthLabel().text}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        
        {/* Dietary and Allergy Info + Rating */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Dietary Icons */}
          <div className="flex gap-1">
            {dietaryInfo.includes('vegan') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-green-500/30 bg-green-100/70 dark:bg-green-900/20" title="Vegan">
                <span className="text-green-700 dark:text-green-400 text-xs">V</span>
              </Badge>
            )}
            {dietaryInfo.includes('vegetarian') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-green-500/30 bg-green-100/70 dark:bg-green-900/20" title="Χορτοφαγικό">
                <span className="text-green-700 dark:text-green-400 text-xs">Χ</span>
              </Badge>
            )}
            {dietaryInfo.includes('gluten-free') && (
              <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-amber-500/30 bg-amber-100/70 dark:bg-amber-900/20" title="Χωρίς Γλουτένη">
                <span className="text-amber-700 dark:text-amber-400 text-xs">G</span>
              </Badge>
            )}
          </div>
          
          {/* Allergy Warning */}
          {allergyInfo.length > 0 && (
            <div 
              className="cursor-help" 
              title={allergyInfo.map(formatAllergyInfo).join(', ')}
            >
              <AlertTriangle className="h-4 w-4 text-canteen-coral" />
            </div>
          )}
          
          {/* Rating */}
          <div className="ml-auto flex items-center">
            {renderStars(rating)}
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({count})</span>
          </div>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-[#1d2f4f]">
          <div className="font-bold text-canteen-dark dark:text-white text-lg">{product.price.toFixed(2)}€</div>
          <Button
            size="sm"
            className="bg-canteen-teal hover:bg-canteen-teal/90 text-white"
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Προσθήκη
          </Button>
        </div>
      </div>
      
      {/* Product Detail Dialog - same as in ProductCard */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#112136] border border-gray-200 dark:border-[#1d2f4f] text-canteen-dark dark:text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-canteen-dark dark:text-white">{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={getProductImage(product, hasImageError)} 
                alt={product.name} 
                className="w-full aspect-square object-cover"
                onError={() => onImageError(product.id)}
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.popular && (
                  <Badge className="bg-gradient-to-r from-canteen-teal to-canteen-mint text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Δημοφιλές
                  </Badge>
                )}
              </div>
              <Badge className={`${getHealthLabel().color} absolute bottom-3 right-3`}>
                {getHealthLabel().text}
              </Badge>
            </div>
            <div className="flex flex-col">
              <div className="mb-3">
                <Badge variant="outline" className="mb-2 border-canteen-teal/20 text-canteen-teal">
                  {categories.find(c => c.value === product.category)?.label || product.category}
                </Badge>
                <h3 className="text-2xl font-medium text-canteen-dark dark:text-white mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(rating)}
                  <span className="text-sm text-gray-500 dark:text-gray-400">({count} αξιολογήσεις)</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
              </div>
              
              <Card className="mb-4 bg-gray-50 dark:bg-[#0b1220] border-gray-200 dark:border-[#1d2f4f]">
                <CardHeader className="py-3">
                  <CardTitle className="text-base text-canteen-dark dark:text-white">Διατροφικά στοιχεία</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-canteen-dark dark:text-white">Κατάλληλο για:</h4>
                      <ul className="mt-1 space-y-1">
                        {dietaryInfo.filter(d => !d.startsWith('contains-')).map((info) => (
                          <li key={info} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-canteen-teal mr-2"></span>
                            {formatDietaryInfo(info)}
                          </li>
                        ))}
                        {dietaryInfo.filter(d => !d.startsWith('contains-')).length === 0 && (
                          <li className="text-sm text-gray-400">Δεν υπάρχουν πληροφορίες</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-canteen-dark dark:text-white">Προειδοποιήσεις:</h4>
                      <ul className="mt-1 space-y-1">
                        {allergyInfo.map((info) => (
                          <li key={info} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-canteen-coral mr-2"></span>
                            {formatAllergyInfo(info)}
                          </li>
                        ))}
                        {allergyInfo.length === 0 && (
                          <li className="text-sm text-gray-400">Δεν υπάρχουν προειδοποιήσεις</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="font-bold text-canteen-dark dark:text-white text-2xl">{product.price.toFixed(2)}€</div>
                <Button
                  onClick={() => {
                    onAddToCart(product);
                    setIsDialogOpen(false);
                  }}
                  className="bg-canteen-teal hover:bg-canteen-teal/90 text-white"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Προσθήκη στο καλάθι
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
