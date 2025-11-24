import axios from 'axios';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const paymentService = {
  // 1. Tạo thanh toán (Gửi orderId và method lên backend)
  createPayment: async (orderId: string, method: 'VNPAY' | 'COD' | 'PAYPAL') => {
    const response = await api.post('/payments', { orderId, method });
    return response.data; // Trả về { paymentUrl: '...' }
  },

  // 2. Xác thực sau khi VNPAY redirect về
  verifyVNPay: async (params: any) => {
    const response = await api.get('/payments/vnpay-callback', { params });
    return response.data;
  }
};