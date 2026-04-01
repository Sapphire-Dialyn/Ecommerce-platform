import { LogisticsOrderRecord } from './logistics';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';
export type PaymentMethod = 'VNPAY' | 'PAYPAL' | 'COD';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface ProductVariant {
  id: string;
  size?: string | null;
  color?: string | null;
  price?: number;
  stock?: number;
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

export interface SelectedLogisticsPartner {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  totalDiscount: number;
  totalAmount: number;
  addressId?: string | null;
  recipientName?: string | null;
  recipientPhone?: string | null;
  deliveryAddress?: string | null;
  selectedLogisticsPartnerId?: string | null;
  selectedLogisticsPartnerName?: string | null;
  selectedLogisticsPartner?: SelectedLogisticsPartner | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment?: Payment | null;
  user?: OrderUser;
  logisticsOrder?: LogisticsOrderRecord | null;
}
