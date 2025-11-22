'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hook/useRedux';
import { loginSuccess, stopLoading } from '@/store/slices/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Kiểm tra LocalStorage ngay khi ứng dụng khởi chạy
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('currentUser');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Nếu tìm thấy dữ liệu, nạp lại vào Redux ngay
        dispatch(loginSuccess({ user, token }));
      } catch (error) {
        // Dữ liệu lỗi thì thôi, tắt loading
        dispatch(stopLoading());
      }
    } else {
      // Không có dữ liệu, tắt loading để hiện nút Đăng nhập
      dispatch(stopLoading());
    }
  }, [dispatch]);

  return <>{children}</>;
}