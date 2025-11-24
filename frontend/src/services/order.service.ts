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
  // Lấy danh sách
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

  // Lấy chi tiết
  getOrderById: async (id: string) => {
    try {
      const res = await api.get<Order>(`/orders/${id}`);
      return res.data;
    } catch (error) {
      throw error; // Ném lỗi để trang chi tiết xử lý
    }
  }
};