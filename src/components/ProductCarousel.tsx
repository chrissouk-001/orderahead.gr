import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { getPopularProducts } from "@/data/products";

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
  const popularProducts = getPopularProducts();

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  // Helper function to get product images
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
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full py-2"
    >
      <CarouselContent className="-ml-4">
        {popularProducts.map((product, index) => (
          <CarouselItem key={product.id} className="pl-4 md:basis-1/3 lg:basis-1/3">
            <div className="relative bg-white dark:bg-[#141d30] rounded-xl shadow-lg overflow-hidden group hover:shadow-xl dark:hover:shadow-primary/30 transition-all duration-500 transform hover:-translate-y-2 dark:border dark:border-primary/10 h-[360px] flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative h-[180px] w-full flex-shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-canteen-dark/50 to-transparent z-10"></div>
                <img
                  src={imageErrors[product.id] ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop" : getProductImage(product.id)}
                  alt={product.name}
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={() => handleImageError(product.id)}
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-canteen-yellow text-canteen-dark font-bold py-1 px-3 rounded-full text-xs z-20 shadow-md animate-pulse-slow">
                    Νέο
                  </div>
                )}
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-canteen-teal/90 text-white font-bold py-1 px-3 rounded-full text-xs z-20 shadow-md">
                    ★ δημοφιλές
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-[#141d30]/90 text-canteen-dark dark:text-white font-bold py-1 px-3 rounded-full text-sm z-20 shadow-md group-hover:bg-canteen-yellow group-hover:text-canteen-dark transition-all duration-300">
                  {product.price.toFixed(2)}€
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-canteen-dark dark:text-white mb-2 group-hover:text-canteen-teal transition-colors duration-300">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground mb-4 line-clamp-2 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex text-canteen-yellow">
                      ★★★★★
                    </div>
                  </div>
                  <Button size="sm" className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-canteen-teal hover:bg-canteen-teal/90 text-white transform transition-all duration-300 hover:scale-110">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-4 mt-8">
        <CarouselPrevious className="relative inline-flex h-12 w-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300" />
        <CarouselNext className="relative inline-flex h-12 w-12 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-300" />
      </div>
    </Carousel>
  );
}
