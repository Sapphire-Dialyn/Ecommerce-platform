export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "VNPAY" | "PAYPAL" | "COD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  images: string[];
  description?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  orderId: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant | null; 
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
}

export interface OrderUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  
  // Tiền
  subtotal: number;
  shippingFee: number;
  totalDiscount: number; // Tổng giảm giá
  totalAmount: number;   // Tổng thanh toán

  createdAt: string;
  updatedAt: string;

  // Quan hệ
  orderItems: OrderItem[];
  payment?: Payment | null;
  user?: OrderUser; // Thông tin người mua
}