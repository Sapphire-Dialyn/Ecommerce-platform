import axiosClient from './axiosClient';

export const productService = {
  getAll: async (params?: any) => {
    const response = await axiosClient.get('/products', { params });
    return response.data;
  },
  getById: async (id: string) => {
    // Gọi API: http://localhost:3000/products/123
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },
  getRelated: async (id: string) => {
    // Giả lập lấy sp liên quan (hoặc gọi API thật nếu có)
    const response = await axiosClient.get('/products?limit=4');
    return response.data;
  }
};