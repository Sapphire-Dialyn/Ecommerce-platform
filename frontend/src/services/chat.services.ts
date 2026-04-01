import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const chatService = {
  // Gửi toàn bộ lịch sử chat lên backend
  sendMessage: async (history: { role: string; content: string }[]) => {
    const response = await axios.post(`${API_URL}/chat`, { history });
    return response.data;
  },
};