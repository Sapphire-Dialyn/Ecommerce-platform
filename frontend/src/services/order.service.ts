import axios from "axios";
import { Order, OrderStatus } from "@/types/order";

const API_URL = "http://localhost:3000"; 
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const orderService = {
  // 1. Lấy danh sách đơn hàng
  getMyOrders: async (status?: OrderStatus | "ALL") => {
    try {
      const params: any = {};
      if (status && status !== "ALL") params.status = status;
      const res = await api.get<Order[]>("/orders/my-orders", { params });
      return res.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; 
    }
  },

  // 2. Lấy chi tiết đơn hàng
  getOrderById: async (id: string) => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  // 3. TẠO ĐƠN HÀNG
  createOrder: async (orderData: any) => {
    // Gọi API POST /orders xuống Backend
    const res = await api.post("/orders", orderData);
    return res.data; 
  },

  // 4. CẬP NHẬT TRẠNG THÁI THANH TOÁN (Mới thêm để fix lỗi)
  updatePaymentStatus: async (payload: { orderId: string; status: string; paymentMethod: string }) => {
    // Gọi API PUT /orders/:id/payment-status xuống Backend
    // Lưu ý: Bạn cần đảm bảo Backend (NestJS/NodeJS) đã có endpoint xử lý logic này.
    const res = await api.put(`/orders/${payload.orderId}/payment-status`, payload);
    return res.data;
  }
};