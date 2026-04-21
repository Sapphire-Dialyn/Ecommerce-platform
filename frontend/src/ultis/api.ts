import axios from 'axios';

// Lấy URL từ biến môi trường, nếu không có thì dùng localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Khởi tạo một instance duy nhất của Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// 1. REQUEST INTERCEPTOR: Tự động đính kèm Token vào mọi API gửi đi
// ============================================================================
api.interceptors.request.use(
  (config) => {
    // Chỉ thực thi trên môi trường Client (Trình duyệt)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false;

// ============================================================================
// 2. RESPONSE INTERCEPTOR: Xử lý dữ liệu trả về và Tự động Logout
// ============================================================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dùng cờ isRedirecting để đảm bảo dù có 10 API lỗi cùng lúc thì chỉ xử lý 1 lần duy nhất
      if (typeof window !== 'undefined' && !isRedirecting) {
        
        if (window.location.pathname !== '/login') {
          isRedirecting = true; // Khóa cửa, không cho các API lỗi phía sau kích hoạt nữa
          localStorage.removeItem('accessToken');

          const errData = error.response.data;
          
          // 🔥 FIX 1: Quét mã lỗi (nếu có)
          const errorCode = errData?.code || errData?.message?.code;
          
          // 🔥 FIX 2: Bắt luôn theo câu chữ (Dành cho trường hợp FileUploadExceptionFilter phá cấu trúc JSON)
          const errorText = typeof errData?.message === 'string' 
            ? errData.message 
            : JSON.stringify(errData);

          // Nếu có mã code HOẶC có chứa dòng chữ đặc biệt thì đều tính là bị kick
          const isKicked = errorCode === 'CONCURRENT_LOGIN' || errorText.includes('Tài khoản đã được truy cập ở nơi khác');
          
          if (isKicked) {
            // 🔥 FIX 3: Dùng Regex để "bóc" IP ra khỏi chuỗi text bị Filter làm biến dạng
            const ipMatch = errorText.match(/\[IP_ADDR: (.*?)\]/);
            
            // Lấy IP, ưu tiên JSON chuẩn trước, nếu bị filter xóa mất thì lấy từ chuỗi bóc được
            const ipAddress = errData?.ip || errData?.message?.ip || (ipMatch ? ipMatch[1] : 'Không xác định');
            const msg = `Tài khoản của bạn đã được truy cập ở một thiết bị khác (IP: ${ipAddress}). Bạn buộc phải đăng xuất.`;
            
            window.location.href = `/login?error=${encodeURIComponent(msg)}&type=kicked`;
          } else {
            // Hết hạn token tự nhiên
            const errorMessage = encodeURIComponent('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            window.location.href = `/login?error=${errorMessage}`;
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;