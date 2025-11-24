export type Role = 'GUEST' | 'CUSTOMER' | 'SELLER' | 'ENTERPRISE' | 'LOGISTICS' | 'SHIPPER' | 'ADMIN';

export interface Variant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string; // Prisma CUID là string
  name: string;
  description: string;
  images: string[];
  variants: Variant[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  specifications?: Record<string, string>;
  
  // Thông tin chủ sở hữu
  sellerId?: string;
  seller?: Seller;
  enterpriseId?: string;
  enterprise?: Enterprise;

  // Giá hiển thị (nếu không dùng variant)
  basePrice?: number;
  stock?: number;
}

export interface CartItem {
  id: string;
  productId: string; // Prisma ID là string
  name: string;
  price: number;
  image: string;
  quantity: number;
  variantId?: string;
  variant?: Variant;
}


export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  verified: boolean;
  rating?: number;
  logoUrl?: string;
  businessDocumentUrl?: string;
  identityDocumentUrl?: string;
  addressDocumentUrl?: string;
}

export interface Enterprise {
  id: string;
  userId: string;
  companyName: string;
  taxCode?: string;
  verified: boolean;
  officialBrand: boolean;
  rating?: number;
  logoUrl?: string;
  businessLicenseUrl?: string;
  brandRegistrationUrl?: string;
  taxDocumentUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Quan hệ (quan trọng để trang Profile không báo lỗi)
  seller?: Seller | null;
  enterprise?: Enterprise | null;
}
