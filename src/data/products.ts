
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Σάντουιτς Γαλοπούλα',
    description: 'Φρέσκο ψωμάκι με γαλοπούλα, τυρί και μαρούλι',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1539252554935-80c7dd4d82f3?q=80&w=500&auto=format&fit=crop', 
    category: 'sandwich',
    popular: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Τυρόπιτα',
    description: 'Παραδοσιακή τυρόπιτα με φέτα',
    price: 1.80,
    image: 'https://images.unsplash.com/photo-1584913938084-a075e5f939c5?q=80&w=500&auto=format&fit=crop',
    category: 'pastry',
    popular: true
  },
  {
    id: '3',
    name: 'Κουλούρι Θεσσαλονίκης',
    description: 'Φρεσκοψημένο κουλούρι με σουσάμι',
    price: 0.80,
    image: 'https://images.unsplash.com/photo-1583344218052-d29c99f3d8bd?q=80&w=500&auto=format&fit=crop',
    category: 'pastry'
  },
  {
    id: '4',
    name: 'Χυμός Πορτοκάλι',
    description: 'Φυσικός χυμός πορτοκάλι (250ml)',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=500&auto=format&fit=crop',
    category: 'drink',
    popular: true
  },
  {
    id: '5',
    name: 'Νερό Εμφιαλωμένο',
    description: 'Φυσικό μεταλλικό νερό (500ml)',
    price: 0.50,
    image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4?q=80&w=500&auto=format&fit=crop',
    category: 'drink'
  },
  {
    id: '6',
    name: 'Σοκολατένιο Muffin',
    description: 'Αφράτο muffin με κομμάτια σοκολάτας',
    price: 1.70,
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=500&auto=format&fit=crop',
    category: 'sweet',
    isNew: true
  },
  {
    id: '7',
    name: 'Μπάρα Δημητριακών',
    description: 'Υγιεινή μπάρα με βρώμη και μέλι',
    price: 1.20,
    image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?q=80&w=500&auto=format&fit=crop',
    category: 'snack'
  },
  {
    id: '8',
    name: 'Σπανακόπιτα',
    description: 'Χωριάτικη σπανακόπιτα με φέτα',
    price: 1.90,
    image: 'https://images.unsplash.com/photo-1591299177061-2151e53df4f6?q=80&w=500&auto=format&fit=crop',
    category: 'pastry',
    popular: true,
    isNew: true
  },
  {
    id: '9',
    name: 'Τοστ τυρί-γαλοπούλα',
    description: 'Ζεστό τοστ με τυρί και γαλοπούλα',
    price: 1.80,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=500&auto=format&fit=crop',
    category: 'sandwich'
  },
  {
    id: '10',
    name: 'Σοκολατούχο Γάλα',
    description: 'Κρύο σοκολατούχο γάλα (250ml)',
    price: 1.30,
    image: 'https://images.unsplash.com/photo-1644943765491-1d245f11e743?q=80&w=500&auto=format&fit=crop',
    category: 'drink'
  }
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getPopularProducts = () => {
  return products.filter(product => product.popular);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
