import { Product } from './types';

export const products: Product[] = [
  { 
    id: '1', 
    name: 'Oversized Puff Hoodie', 
    color: 'Black', 
    price: 89.99, 
    salePrice: 69.99, 
    sizes: ['S', 'M', 'L', 'XL'], 
    colors: ['#0a0a0a', '#4b5563', '#1e3a8a'], 
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&q=80&w=800', 
    category: 'Hoodies' 
  },
  { 
    id: '2', 
    name: 'Box Logo Tee', 
    color: 'White', 
    price: 34.99, 
    sizes: ['S', 'M', 'L', 'XL'], 
    colors: ['#ffffff', '#0a0a0a'], 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', 
    category: 'Tees' 
  },
  { 
    id: '3', 
    name: 'Cargo Joggers', 
    color: 'Grey', 
    price: 79.99, 
    sizes: ['S', 'M', 'L', 'XL'], 
    colors: ['#4b5563', '#0a0a0a'], 
    image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=800', 
    category: 'Joggers' 
  },
  { 
    id: '4', 
    name: 'Vintage Wash Hoodie', 
    color: 'Blue', 
    price: 94.99, 
    sizes: ['M', 'L', 'XL'], 
    colors: ['#1e3a8a', '#0a0a0a'], 
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&q=80&w=800', 
    category: 'Hoodies' 
  },
  { 
    id: '5', 
    name: 'Graphic Tee', 
    color: 'Black', 
    price: 29.99, 
    salePrice: 24.99, 
    sizes: ['S', 'M', 'L'], 
    colors: ['#0a0a0a', '#ffffff'], 
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', 
    category: 'Tees' 
  },
  { 
    id: '6', 
    name: '5-Panel Hat', 
    color: 'Black/White', 
    price: 39.99, 
    sizes: ['One Size'], 
    colors: ['#0a0a0a'], 
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=800', 
    hoverImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800', 
    category: 'Accessories' 
  },
];
