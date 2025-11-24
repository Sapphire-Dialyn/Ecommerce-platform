import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL Backend của bạn
const api = axios.create({ baseURL: API_URL });

// Thêm interceptor nếu cần Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminService = {
  // --- USER MANAGEMENT ---
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${id}/status`, { active: isActive });
    return response.data;
  },

  verifyAccount: async (id: string, type: 'sellers' | 'enterprise' | 'logistics', verified: boolean) => {
    const response = await api.patch(`/admin/${type}/${id}/verify`, { verified });
    return response.data;
  },
  
  banUser: async (userId: string, banUntil: string, reason: string): Promise<void> => {
    const response = await api.post(`/admin/users/${userId}/ban`, {
        banUntil: banUntil, 
        reason: reason,
    });
    return response.data;
  },

  deleteUser: async (id: string) => {
      // const response = await api.delete(`/admin/users/${id}`);
      console.log("Mock delete:", id);
      return true; 
  },

  // --- ORDER MANAGEMENT (MỚI THÊM) ---
  
  // Lấy tất cả đơn hàng (GET /orders)
  getAllOrders: async () => {
    const response = await api.get('/orders'); 
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng (PATCH /orders/{id}/status)
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  // --- ANALYTICS ---
  // Lấy doanh thu/đơn hàng theo thời gian (period: '7d', '30d', etc.)
  getSalesOverTime: async (period: '7d' | '30d' = '7d') => {
    // Giả sử backend nhận query param ?period=7d
    const response = await api.get('/analytics/sales-over-time', {
        params: { period } 
    });
    return response.data;
  }
};