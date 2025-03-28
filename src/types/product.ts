
export type ProductCategory = 
  | 'sandwich' 
  | 'pastry' 
  | 'snack' 
  | 'sweet'
  | 'drink';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  popular?: boolean;
};
