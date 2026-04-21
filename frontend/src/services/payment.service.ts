import api from '@/ultis/api';

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