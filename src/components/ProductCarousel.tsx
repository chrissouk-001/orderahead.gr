
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { getPopularProducts } from "@/data/products";

const ProductCarousel = () => {
  const popularProducts = getPopularProducts();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <div className="py-10 relative">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {popularProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden h-full">
                <CardContent className="p-0">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={imageErrors[product.id] ? 
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop" : 
                        getProductImage(product.id)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(product.id)}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <p className="font-bold text-canteen-teal mt-2">{product.price.toFixed(2)}€</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 md:-left-12" />
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 md:-right-12" />
      </Carousel>
    </div>
  );
};

// Helper function to get appropriate stock images based on product ID
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
}

export default ProductCarousel;
