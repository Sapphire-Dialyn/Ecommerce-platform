'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hook/useRedux';
import { loginSuccess } from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Gọi API
      const data = await authService.login(formData.email, formData.password);
      
      // 2. Lưu vào Redux (Navbar sẽ tự cập nhật)
      // Backend trả về cấu trúc: { user: {...}, accessToken: "..." } (hoặc access_token)
      // Hãy chắc chắn backend trả về đúng key, nếu là 'access_token' thì sửa lại dòng dưới
      dispatch(loginSuccess({ 
          user: data.user, 
          token: data.accessToken || data.access_token 
      }));

      toast.success(`Chào mừng trở lại, ${data.user.name}!`);
      
      // 3. Điều hướng dựa trên Role
      if (['ADMIN', 'SELLER', 'ENTERPRISE', 'SHIPPER'].includes(data.user.role)) {
         router.push('/admin'); // Hoặc trang quản lý tương ứng
      } else {
         router.push('/'); // Khách hàng về trang chủ
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-fuchsia-50 to-pink-50 px-4 py-10">
    <div className="w-full max-w-md">

      {/* CARD LOGIN */}
      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-fuchsia-100">
        
        {/* LOGO + TITLE */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="text-4xl font-serif font-bold text-gray-900 tracking-wide"
          >
            beauty
            <span className="text-fuchsia-600 italic">&</span>
            skincare
          </Link>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            Đăng nhập tài khoản
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 transition"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-11 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50/50 
                  focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300 transition"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-3 py-3 rounded-xl border border-gray-300 bg-gray-50/50 
                  focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300 transition"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 transition"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-fuchsia-600 to-pink-500 
              shadow-lg shadow-pink-200 hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Đăng nhập <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
);
}