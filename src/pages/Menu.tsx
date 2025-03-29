
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
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
  
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
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
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Κατάλογος Προϊόντων</h1>
          
          <div className="w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input
              placeholder="Αναζήτηση προϊόντων..."
              className="pl-10 w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  // Use the same helper function from ProductCarousel
  const getProductImage = (id: string): string => {
    const imageMap: Record<string, string> = {
      "1": "https://images.unsplash.com/photo-1528736235302-52922df5c122?q=80&w=500&auto=format&fit=crop", // Sandwich
      "2": "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=500&auto=format&fit=crop", // Cheese pie
      "3": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=500&auto=format&fit=crop", // Koulouri
      "4": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=500&auto=format&fit=crop", // Orange juice
      "5": "https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=500&auto=format&fit=crop", // Water
      "6": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=500&auto=format&fit=crop", // Chocolate Muffin
      "7": "https://images.unsplash.com/photo-1581400151483-fa25f4c088c2?q=80&w=500&auto=format&fit=crop", // Granola Bar
      "8": "https://images.unsplash.com/photo-1662953929935-181baaabcb0c?q=80&w=500&auto=format&fit=crop", // Spinach pie
      "9": "https://images.unsplash.com/photo-1554433607-66b5efe9d304?q=80&w=500&auto=format&fit=crop", // Toast
      "10": "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=500&auto=format&fit=crop" // Chocolate milk
    };
    
    return imageMap[id] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop"; // Default food image
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img 
          src={hasImageError ? 
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop" : 
            getProductImage(product.id)} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          onError={() => onImageError(product.id)}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-lg font-bold text-canteen-teal">
          {product.price.toFixed(2)}€
        </div>
        <Button 
          size="sm" 
          className="bg-canteen-teal hover:bg-canteen-teal/90"
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
