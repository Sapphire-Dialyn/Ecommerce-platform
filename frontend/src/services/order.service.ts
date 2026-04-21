import api from '@/ultis/api';
import { Order, OrderStatus } from '@/types/order';

export const orderService = {
  getMyOrders: async (status?: OrderStatus | 'ALL') => {
    try {
      const params: Record<string, string> = {};
      if (status && status !== 'ALL') {
        params.status = status;
      }

      const res = await api.get<Order[]>('/orders/my-orders', { params });
      return res.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  getOrderById: async (id: string) => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  createOrder: async (orderData: {
    items: Array<{ productId: string; variantId?: string | null; quantity: number }>;
    shippingFee?: number;
    paymentMethod: string;
    addressId: string;
    logisticsPartnerId: string;
    voucherIds?: string[];
  }) => {
    const res = await api.post<Order>('/orders', orderData);
    return res.data;
  },

  updatePaymentStatus: async (payload: {
    orderId: string;
    status: string;
    paymentMethod: string;
  }) => {
    const res = await api.put<Order>(`/orders/${payload.orderId}/payment-status`, payload);
    return res.data;
  },
};
