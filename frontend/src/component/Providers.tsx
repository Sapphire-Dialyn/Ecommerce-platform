'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/index';
import AuthProvider from "@/providers/AuthProvider"; // Import AuthProvider của bạn

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // 1. Redux Provider (Quản lý Chat state, User state...)
    <Provider store={store}>
      {/* 2. Auth Provider (Quản lý phiên đăng nhập, Token...) */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}