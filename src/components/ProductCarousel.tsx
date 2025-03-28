
import React from "react";
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

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Δημοφιλή Προϊόντα</h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {popularProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <p className="font-bold text-canteen-teal mt-2">{product.price.toFixed(2)}€</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
