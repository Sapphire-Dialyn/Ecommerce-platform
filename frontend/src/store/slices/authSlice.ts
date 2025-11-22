import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu User khớp với Prisma Schema của bạn
export type UserRole = 'ADMIN' | 'SELLER' | 'ENTERPRISE' | 'CUSTOMER' | 'SHIPPER' | 'LOGISTICS' | 'GUEST';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true, // Mặc định là true
};

// Hàm lấy dữ liệu ban đầu từ LocalStorage (để F5 không bị mất đăng nhập)
// const getInitialState = (): AuthState => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('accessToken');
//     const userStr = localStorage.getItem('currentUser');
//     if (token && userStr) {
//       return { 
//         isAuthenticated: true, 
//         token, 
//         user: JSON.parse(userStr) 
//       };
//     }
//   }
//   return { user: null, isAuthenticated: false, token: null };
// };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false; // Đã load xong
      // Lưu LocalStorage
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false; // Đã load xong (dù là ko có user)
      // Xóa LocalStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    },
    // Action mới để báo đã kiểm tra xong LocalStorage
    stopLoading: (state) => {
      state.isLoading = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('currentUser', JSON.stringify(state.user));
      }
    }
  },
});


export const { loginSuccess, logout, updateProfile,stopLoading } = authSlice.actions;
export default authSlice.reducer;