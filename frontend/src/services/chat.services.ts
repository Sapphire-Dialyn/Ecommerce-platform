import api from '@/ultis/api';

export const chatService = {
  // Gửi toàn bộ lịch sử chat lên backend
  sendMessage: async (history: { role: string; content: string }[]) => {
    const response = await api.post('/chat', { history });
    return response.data;
  },
};