import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL Backend của bạn
const api = axios.create({ baseURL: API_URL });

// Thêm interceptor nếu cần Token (nếu backend tắt guard thì không cần)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminService = {
  // 1. Lấy TOÀN BỘ Users (Backend trả về list hỗn hợp)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // 2. Các hành động Verify / Khóa (Giữ nguyên logic)
  toggleUserStatus: async (id: string, isActive: boolean) => {
    // Backend đang hứng body { active: boolean }
    const response = await api.patch(`/admin/users/${id}/status`, { active: isActive });
    return response.data;
  },

  verifyAccount: async (id: string, type: 'sellers' | 'enterprise' | 'logistics', verified: boolean) => {
    const response = await api.patch(`/admin/${type}/${id}/verify`, { verified });
    return response.data;
  },
  deleteUser: async (id: string) => {
      // API này backend chưa có trong list bạn gửi, nếu có thì dùng dòng dưới:
      // const response = await api.delete(`/admin/users/${id}`);
      console.log("Mock delete:", id);
      return true; 
  }
};