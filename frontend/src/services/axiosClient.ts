import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptors để xử lý token ở đây sau này
export default axiosClient;