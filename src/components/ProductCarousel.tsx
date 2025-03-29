import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isNew?: boolean;
}

// Sample data
const products: Product[] = [
  {
    id: "1",
    name: "Τυρόπιτα",
    description: "Παραδοσιακή τυρόπιτα με φέτα και φύλλο κρούστας",
    price: 2.50,
    image: "/images/products/tyropita.jpg",
    isNew: true
  },
  {
    id: "2",
    name: "Κρουασάν σοκολάτα",
    description: "Βουτυρένιο κρουασάν με γέμιση σοκολάτας",
    price: 1.80,
    image: "/images/products/croissant.jpg"
  },
  {
    id: "3",
    name: "Χυμός πορτοκάλι",
    description: "Φρέσκος χυμός από στυμμένα πορτοκάλια",
    price: 1.50,
    image: "/images/products/orange-juice.jpg",
    isNew: true
  },
  {
    id: "4",
    name: "Club Sandwich",
    description: "Με κοτόπουλο, μπέικον, τυρί και μαγιονέζα",
    price: 3.50,
    image: "/images/products/club-sandwich.jpg"
  }
];

export function ProductCarousel() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
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
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-4 md:basis-1/3 lg:basis-1/3">
            <div className="relative bg-white rounded-md hover:shadow-lg transition-all p-4 h-[320px] flex flex-col">
              {product.isNew && (
                <div className="absolute top-2 left-2 bg-canteen-teal text-white text-xs font-semibold px-2 py-1 rounded">
                  Νέο
                </div>
              )}
              <div className="relative h-[160px] w-full mb-4 flex-shrink-0">
                <img
                  src={imageErrors[product.id] ? "/images/product-placeholder.jpg" : product.image}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-md"
                  onError={() => handleImageError(product.id)}
                />
              </div>
              <div className="flex flex-col flex-grow">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-grow">{product.description}</p>
                <div className="text-canteen-teal font-semibold">{product.price.toFixed(2)}€</div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-2 mt-4">
        <CarouselPrevious className="relative inline-flex h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50" />
        <CarouselNext className="relative inline-flex h-10 w-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50" />
      </div>
    </Carousel>
  );
}
