import axios from 'axios';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const userService = {
  // Lấy thông tin chi tiết (bao gồm cả relation seller/enterprise)
  getMe: async () => {
    const res = await api.get('/users/me'); // Backend cần có endpoint này trả full info
    return res.data;
  },

  // Cập nhật thông tin (Dùng FormData để gửi cả file)
  updateProfile: async (data: any, avatarFile?: File | null, logoFile?: File | null) => {
    const formData = new FormData();

    // 1. User Info
    formData.append('name', data.name || '');
    formData.append('phone', data.phone || '');
    
    // 2. Role specific info
    if (data.storeName) formData.append('storeName', data.storeName);
    if (data.companyName) formData.append('companyName', data.companyName);
    if (data.taxCode) formData.append('taxCode', data.taxCode);

    // 3. Files
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    if (logoFile) {
      formData.append('logo', logoFile); // Backend cần xử lý key này để update vào Seller/Enterprise logoUrl
    }

    const res = await api.patch('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};