export type LogisticsStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface LogisticsPartnerOption {
  id: string;
  name: string;
  baseRate: number;
  rating?: number | null;
  verified: boolean;
}

export interface LogisticsShipper {
  id: string;
  logisticsPartnerId: string;
  active?: boolean;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  deliveryRange: number;
  rating?: number | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  assignedOrders?: LogisticsOrderRecord[];
}

export interface LogisticsOrderRecord {
  id: string;
  orderId: string;
  logisticsPartnerId: string;
  shipperId?: string | null;
  trackingCode: string;
  status: LogisticsStatus;
  pickupAddress?: string | null;
  deliveryAddress: string;
  estimatedDelivery?: string | null;
  pickupTime?: string | null;
  deliveredTime?: string | null;
  notes?: string | null;
  logisticsPartner?: LogisticsPartnerOption;
  shipper?: LogisticsShipper | null;
  order: {
    id: string;
    totalAmount: number;
    recipientName?: string | null;
    recipientPhone?: string | null;
    deliveryAddress?: string | null;
    user?: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
    orderItems: Array<{
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        images: string[];
      };
      variant?: {
        id: string;
        size?: string | null;
        color?: string | null;
      } | null;
    }>;
  };
}
