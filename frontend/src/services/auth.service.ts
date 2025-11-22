import axios from 'axios';

const API_URL = 'http://localhost:3000'; // URL Backend NestJS
const api = axios.create({ baseURL: API_URL });

export const authService = {
  // API Đăng nhập
  login: async (email: string, password: string) => {
    // Backend trả về: { accessToken: "...", user: { ... } }
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // API Đăng ký
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  }
};