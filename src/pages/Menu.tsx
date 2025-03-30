import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { products, getProductsByCategory } from '@/data/products';
import { Product, ProductCategory } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MiniCart from '@/components/MiniCart';
import { toast } from 'sonner';

const categories: { value: ProductCategory; label: string }[] = [
  { value: 'sandwich', label: 'Σάντουιτς' },
  { value: 'pastry', label: 'Αρτοσκευάσματα' },
  { value: 'snack', label: 'Σνακ' },
  { value: 'sweet', label: 'Γλυκά' },
  { value: 'drink', label: 'Ροφήματα' },
];

const Menu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addItem, getTotalItems } = useCart();
  const navigate = useNavigate();

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
    
    addItem(product);
    // Show mini cart on mobile after adding an item
    if (isMobile) {
      setShowMiniCart(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowMiniCart(false), 3000);
    }
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Κατάλογος Προϊόντων</h1>
          
          <div className="w-full md:w-auto flex items-center gap-3">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                placeholder="Αναζήτηση προϊόντων..."
                className="pl-10 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isMobile && isAuthenticated && (
              <Button 
                size="icon" 
                variant="outline" 
                className="relative flex-shrink-0"
                onClick={toggleMiniCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-canteen-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
              <TabsList className="mb-8 flex flex-wrap justify-start w-full overflow-x-auto">
                <TabsTrigger value="all">Όλα</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.value} value={category.value}>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      onImageError={handleImageError}
                      hasImageError={!!imageErrors[product.id]} 
                    />
                  ))}
                </div>
              </TabsContent>
              
              {categories.map((category) => (
                <TabsContent key={category.value} value={category.value} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onImageError={handleImageError}
                        hasImageError={!!imageErrors[product.id]}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          {/* Desktop mini cart */}
          {!isMobile && isAuthenticated && (
            <div className="w-full lg:w-1/4 hidden lg:block">
              <div className="sticky top-24">
                <MiniCart compact={true} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile mini cart as slide-up panel */}
      {isMobile && isAuthenticated && showMiniCart && (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out">
          <div className="max-h-[70vh] overflow-auto">
            <MiniCart compact={true} />
          </div>
        </div>
      )}
      
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
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-canteen-dark/50 to-transparent z-10"></div>
        <img 
          src={hasImageError ? "/images/products/sandwich.jpg" : product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
          onError={() => onImageError(product.id)}
        />
        {product.popular && (
          <div className="absolute top-4 right-4 bg-canteen-teal/90 text-white font-bold py-1 px-3 rounded-full text-xs z-20 shadow-md">★ δημοφιλές</div>
        )}
        {product.isNew && (
          <div className="absolute top-4 left-4 bg-canteen-yellow text-canteen-dark font-bold py-1 px-3 rounded-full text-xs z-20 shadow-md animate-pulse-slow">Νέο</div>
        )}
        <div className="absolute bottom-4 left-4 bg-white/90 text-canteen-dark font-bold py-1 px-3 rounded-full text-sm z-20 shadow-md group-hover:bg-canteen-yellow group-hover:text-canteen-dark transition-all duration-300">
          {product.price.toFixed(2)}€
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl group-hover:text-canteen-teal transition-colors duration-300">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center">
          <div className="flex text-sm text-canteen-yellow">
            ★★★★★
          </div>
        </div>
        <Button 
          size="sm" 
          className="bg-canteen-teal hover:bg-canteen-teal/90 text-white transition-all duration-300 transform hover:scale-105"
          onClick={() => onAddToCart(product)}
        >
          <Plus size={16} className="mr-1" />
          Προσθήκη
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Menu;
