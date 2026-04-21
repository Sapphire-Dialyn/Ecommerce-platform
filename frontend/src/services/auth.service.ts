import api from '@/ultis/api';

export const authService = {
  // Đăng nhập: Thêm type string cho email và password
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    // Lưu token nếu cần thiết, hoặc để component xử lý
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response.data;
  },

  // Đăng ký: Nhận FormData
  register: async (formData: FormData) => {
    const response = await api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Bắt buộc để gửi file
      },
    });
    return response.data;
  },

  // Lấy thông tin user hiện tại (Profile)
  getProfile: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('accessToken');
  }
};