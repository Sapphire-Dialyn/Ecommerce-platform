import axios from 'axios';
import {
  LogisticsOrderRecord,
  LogisticsPartnerOption,
  LogisticsShipper,
} from '@/types/logistics';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const logisticsService = {
  getPartners: async () => {
    const res = await api.get<LogisticsPartnerOption[]>('/logistics/partners');
    return res.data;
  },

  getMyOrders: async (unassignedOnly = false) => {
    const res = await api.get<LogisticsOrderRecord[]>('/logistics/orders/me', {
      params: unassignedOnly ? { unassigned: true } : undefined,
    });
    return res.data;
  },

  getUnassignedOrders: async () => {
    const res = await api.get<LogisticsOrderRecord[]>('/logistics/orders/me/unassigned');
    return res.data;
  },

  updateOrder: async (
    logisticsOrderId: string,
    payload: {
      status?: string;
      pickupAddress?: string;
      estimatedDelivery?: string;
      notes?: string;
    },
  ) => {
    const res = await api.patch<LogisticsOrderRecord>(
      `/logistics/orders/${logisticsOrderId}`,
      payload,
    );
    return res.data;
  },

  assignOrder: async (logisticsOrderId: string, shipperId: string) => {
    const res = await api.post<LogisticsOrderRecord>(
      `/logistics/orders/${logisticsOrderId}/assign`,
      { shipperId },
    );
    return res.data;
  },

  getMyShippers: async () => {
    const res = await api.get<LogisticsShipper[]>('/logistics/shipper');
    return res.data;
  },

  getCurrentShipper: async () => {
    const res = await api.get<LogisticsShipper>('/logistics/shipper/me');
    return res.data;
  },

  getCurrentShipperOrders: async () => {
    const res = await api.get<LogisticsOrderRecord[]>('/logistics/shipper/orders/me');
    return res.data;
  },

  updateCurrentShipperOrderStatus: async (
    logisticsOrderId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED',
  ) => {
    const res = await api.put<LogisticsOrderRecord>(
      `/logistics/shipper/orders/${logisticsOrderId}/status`,
      { status },
    );
    return res.data;
  },
};
