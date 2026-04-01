'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hook/useRedux';
import { loginSuccess } from '@/store/slices/authSlice';
import { userService } from '@/services/user.service'; // Đảm bảo bạn đã có service này
import { toast } from 'react-hot-toast';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoginSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // 1. Lưu tạm token vào localStorage để axios interceptor có thể lấy gửi kèm trong header
        localStorage.setItem('accessToken', token);

        // 2. Gọi API lấy thông tin User chính thức từ Backend
        // Việc này đảm bảo ta có object 'User' xịn để pass vào Redux, fix lỗi TypeScript 'null'
        const userData = await userService.getMe();

        // 3. Dispatch vào Redux khi đã có đầy đủ dữ liệu
        dispatch(loginSuccess({
          token: token,
          user: userData // userData lúc này đã khớp kiểu 'User'
        }));

        toast.success(`Chào mừng ${userData.name} đã quay trở lại! ✨`);

        // 4. Chuyển hướng
        if (['ADMIN', 'SELLER', 'ENTERPRISE', 'SHIPPER'].includes(userData.role)) {
          router.push('/admin');
        } else {
          router.push('/');
        }

      } catch (error: any) {
        console.error("Lỗi xác thực Google:", error);
        localStorage.removeItem('accessToken');
        toast.error("Không thể lấy thông tin tài khoản. Vui lòng thử lại.");
        router.push('/login');
      }
    };

    handleAuth();
  }, [searchParams, router, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <div className="relative flex flex-col items-center">
        <div className="absolute inset-0 bg-fuchsia-200 blur-3xl rounded-full opacity-20 animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-fuchsia-600 animate-spin mb-6 relative z-10" />
        <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-2 relative z-10">
          <Sparkles className="text-fuchsia-500" size={20}/>
          Đang xác thực danh tính...
        </h2>
        <p className="text-gray-400 text-sm mt-2 italic relative z-10">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}