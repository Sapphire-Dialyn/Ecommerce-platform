export interface Variant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  variants: Variant[];
  specifications?: Record<string, string>;
  enterprise?: {
    companyName: string;
  };
  seller?: {
    storeName: string;
  };
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}