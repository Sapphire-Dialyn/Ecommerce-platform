'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Trạng thái kiểm duyệt: Mặc định là đang tải (true) và chưa cấp quyền (false)
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
  const checkAdminAccess = async () => {
    // 🔥 Đợi đảm bảo client mount xong
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const user = await authService.getProfile();

      if (user.role === 'ADMIN') {
        setIsAuthorized(true);
      } else {
        toast.error('Bạn không có quyền truy cập trang quản trị!');
        router.push('/');
      }

    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 delay nhẹ để chắc chắn localStorage sẵn sàng
  setTimeout(checkAdminAccess, 50);

}, [router]);

  // 1. MÀN HÌNH CHỜ (Cực kỳ quan trọng)
  // Trong lúc đợi gọi API, hiển thị vòng xoay loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-fuchsia-600 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // 2. KHÔNG CÓ QUYỀN
  // Trả về null để giao diện trắng tinh trong lúc đợi router.push đá về trang khác
  if (!isAuthorized) {
    return null;
  }

  // 3. QUA ẢI THÀNH CÔNG -> RENDER GIAO DIỆN ADMIN
  return (
    <div className="admin-wrapper bg-gray-50 min-h-screen">
      {/* Nếu bạn có AdminSidebar hay Header dùng chung cho trang Admin thì bỏ vào đây 
         Ví dụ: <AdminSidebar /> 
      */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}