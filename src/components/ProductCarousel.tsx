
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
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-canteen-dark mb-2">Δημοφιλή Προϊόντα</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ανακαλύψτε τα πιο αγαπημένα προϊόντα του κυλικείου μας που επιλέγουν καθημερινά οι μαθητές
        </p>
      </div>
      
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="py-4">
          {popularProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={() => handleImageError(product.id)}
                    />
                    {product.isNew && (
                      <Badge className="absolute top-2 right-2 bg-canteen-teal">Νέο</Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 text-canteen-dark">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-canteen-teal text-lg">{product.price.toFixed(2)}€</p>
                      <button 
                        className="text-canteen-dark hover:text-canteen-teal rounded-full p-2 transition-colors bg-gray-100 hover:bg-gray-200"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 md:-left-12 bg-white border border-gray-200 text-canteen-dark hover:bg-canteen-teal hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </CarouselPrevious>
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 md:-right-12 bg-white border border-gray-200 text-canteen-dark hover:bg-canteen-teal hover:text-white transition-colors">
          <ChevronRight className="h-5 w-5" />
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
