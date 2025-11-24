import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Định nghĩa kiểu dữ liệu User khớp với Prisma Schema của bạn
export type UserRole = 'ADMIN' | 'SELLER' | 'ENTERPRISE' | 'CUSTOMER' | 'SHIPPER' | 'LOGISTICS' | 'GUEST';

// Thêm interface phụ cho Seller/Enterprise
interface SellerProfile {
  id: string;
  storeName: string;
  verified: boolean;
  logoUrl?: string;
}

interface EnterpriseProfile {
  id: string;
  companyName: string;
  taxCode?: string;
  verified: boolean;
  logoUrl?: string;
}

// Mở rộng interface User
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string; // Thêm phone
  role: UserRole;
  // Thêm các relation (có thể null nếu user ko có role đó)
  seller?: SellerProfile | null;
  enterprise?: EnterpriseProfile | null;
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
  isLoading: true, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false; 
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false; 
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    // Cho phép update từng phần của User (bao gồm cả nested seller/enterprise nếu cần)
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('currentUser', JSON.stringify(state.user));
      }
    }
  },
});

export const { loginSuccess, logout, updateProfile, stopLoading } = authSlice.actions;
export default authSlice.reducer;