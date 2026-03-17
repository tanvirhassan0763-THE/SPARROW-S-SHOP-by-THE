export interface Product {
  id: string;
  name: string;
  color: string;
  price: number;
  salePrice?: number;
  sizes: string[];
  colors: string[];
  image: string;
  hoverImage: string;
  category: string;
}

export interface CartItem extends Product {
  cartItemId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}
