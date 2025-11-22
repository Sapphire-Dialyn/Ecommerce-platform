'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Gọi API Đăng ký
      await authService.register(formData.name, formData.email, formData.password);
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      
      // 2. Chuyển sang trang Login
      router.push('/login');

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fuchsia-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-fuchsia-100">
        
        <div className="text-center">
          <Link href="/" className="text-3xl font-serif font-bold text-gray-900">
            beauty<span className="text-fuchsia-600 italic">&</span>skincare
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-500 transition">
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-fuchsia-500 focus:border-fuchsia-500 transition"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-fuchsia-200 mt-6"
          >
            {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
            ) : (
                <span className="flex items-center gap-2">Đăng ký tài khoản <ArrowRight size={18}/></span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 mt-4">
            Bằng việc đăng ký, bạn đồng ý với <a href="#" className="underline hover:text-gray-900">Điều khoản dịch vụ</a> và <a href="#" className="underline hover:text-gray-900">Chính sách bảo mật</a> của chúng tôi.
        </div>

      </div>
    </div>
  );
}