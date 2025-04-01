import React, { useState } from "react";
import { Plus, Heart, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { getPopularProducts } from "@/data/products";

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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
  popular?: boolean;
}

export function ProductCarousel() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const popularProducts = getPopularProducts();

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Helper function to get product images
  const getProductImage = (id: string): string => {
    const imageMap: Record<string, string> = {
      "1": "/images/products/sandwich.jpg", // Sandwich
      "2": "/images/products/cheese-pie.jpg", // Cheese pie
      "3": "/images/products/koulouri.jpg", // Koulouri
      "4": "/images/products/orange-juice.jpg", // Orange juice
      "5": "/images/products/water.jpg", // Water
      "6": "/images/products/muffin.jpg", // Chocolate Muffin
      "7": "/images/products/cereal-bar.jpg", // Granola Bar
      "8": "/images/products/spinach-pie.jpg", // Spinach pie
      "9": "/images/products/toast.jpg", // Toast
      "10": "/images/products/chocolate-milk.jpg" // Chocolate milk
    };
    
    return imageMap[id] || "/images/products/sandwich.jpg"; // Default food image
  };
  
  // Format dietary info for display
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
  
  // Format allergy info for display
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
  
  // Health indicator colors and icon
  const healthColors = {
    healthy: {
      bg: 'bg-emerald-500',
      text: 'text-white',
      icon: <Heart className="h-3 w-3 mr-1" />
    },
    moderate: {
      bg: 'bg-amber-500',
      text: 'text-white',
      icon: <Info className="h-3 w-3 mr-1" />
    },
    unhealthy: {
      bg: 'bg-red-500',
      text: 'text-white',
      icon: <AlertTriangle className="h-3 w-3 mr-1" />
    }
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full py-2"
    >
      <CarouselContent className="-ml-4">
        {popularProducts.map((product, index) => {
          const healthInfo = getHealthInfo(product.id);
          const dietaryInfo = getDietaryInfo(product.id);
          const allergyInfo = getAllergyInfo(product.id);
          const isExpanded = expandedProductId === product.id;
          
          return (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
              <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-800/50 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md h-full animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative overflow-hidden">
                  <img
                    src={imageErrors[product.id] ? "/images/products/sandwich.jpg" : getProductImage(product.id)}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    onError={() => handleImageError(product.id)}
                  />
                  
                  <div className="absolute top-3 left-0 right-0 flex flex-wrap justify-between px-3 gap-2">
                    <div className="flex flex-wrap gap-2">
                      {product.isNew && (
                        <span className="bg-amber-500 text-white text-sm font-medium py-1 px-3 rounded-md">
                          Νέο
                        </span>
                      )}
                      <span className={`${healthColors[healthInfo].bg} ${healthColors[healthInfo].text} text-sm font-medium py-1 px-3 rounded-md flex items-center`}>
                        {healthColors[healthInfo].icon}
                        {healthInfo === 'healthy' ? 'Υγιεινό' : healthInfo === 'moderate' ? 'Μέτριο' : 'Ανθυγιεινό'}
                      </span>
                    </div>
                    {product.popular && (
                      <span className="bg-teal-600 text-white text-sm font-medium py-1 px-3 rounded-md ml-auto">
                        ★ δημοφιλές
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 mt-2">{product.description}</p>
                  
                  <div className="flex items-center text-amber-500 mb-3">
                    <div className="flex text-sm">★★★★★</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({product.id})</span>
                  </div>
                  
                  <button 
                    onClick={() => setExpandedProductId(isExpanded ? null : product.id)}
                    className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium mb-4 underline underline-offset-2"
                  >
                    {isExpanded ? 'Απόκρυψη πληροφοριών υγείας' : 'Προβολή πληροφοριών υγείας'}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md text-sm">
                      {dietaryInfo.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Διατροφικές Πληροφορίες:</h4>
                          <div className="flex flex-wrap gap-2">
                            {dietaryInfo.map((info, index) => (
                              <span key={index} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded text-sm">
                                {formatDietaryInfo(info)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {allergyInfo.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">Αλλεργιογόνα:</h4>
                          <div className="flex flex-wrap gap-2">
                            {allergyInfo.map((info, index) => (
                              <span key={index} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded text-sm">
                                {formatAllergyInfo(info)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <Button size="default" className="rounded-full h-11 w-11 p-0 bg-teal-600 hover:bg-teal-700 text-white">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="absolute bottom-[62px] right-4">
                  <span className="text-base font-bold bg-teal-600 text-white px-3 py-1 rounded-md">
                    {product.price.toFixed(2)}€
                  </span>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex justify-center gap-4 mt-8">
        <CarouselPrevious className="relative inline-flex h-12 w-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300" />
        <CarouselNext className="relative inline-flex h-12 w-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300" />
      </div>
    </Carousel>
  );
}
