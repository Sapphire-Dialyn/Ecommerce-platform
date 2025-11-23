'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hook/useRedux'; 
import { loginSuccess } from '@/store/slices/authSlice'; 
import { authService } from '@/services/auth.service'; 
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(formData.email, formData.password);

      dispatch(loginSuccess({
        user: data.user,
        token: data.accessToken || data.access_token
      }));

      toast.success(`Chào mừng, ${data.user.name}!`);

      if (['ADMIN', 'SELLER', 'ENTERPRISE', 'SHIPPER'].includes(data.user.role)) {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-fuchsia-50">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[480px] px-4">
        {/* Tăng rounded và chỉnh padding giống form Register */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-10 px-6 sm:px-12">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 text-3xl font-serif font-bold text-gray-900 tracking-tight hover:scale-105 transition-transform duration-300"
            >
              <Sparkles className="w-6 h-6 text-fuchsia-500" strokeWidth={2.5} />
              <span>beauty<span className="text-fuchsia-600 italic">&</span>skincare</span>
            </Link>
            <p className="text-gray-500 text-sm mt-2">
              Đánh thức vẻ đẹp tiềm ẩn của bạn
            </p>
          </div>

          {/* Form: Thêm flex-col items-center để căn giữa */}
          <form onSubmit={handleLogin} className="flex flex-col items-center space-y-6 w-full">
            
            {/* Email Field - Giới hạn width sm:w-[90%] */}
            <div className="w-full sm:w-[90%] space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                {/* Đã bật lại Icon để đẹp hơn */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 
                             bg-white border border-gray-200 rounded-2xl 
                             text-gray-900 text-sm font-medium placeholder:text-gray-400/80
                             focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 focus:bg-white
                             hover:border-fuchsia-300
                             outline-none transition-all duration-200 shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field - Giới hạn width sm:w-[90%] */}
            <div className="w-full sm:w-[90%] space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
                <button
                  type="button"
                  className="text-xs font-medium text-fuchsia-600 hover:text-fuchsia-700 transition-colors"
                  onClick={() => toast.success('Tính năng đang cập nhật!')}
                >
                  Quên mật khẩu?
                </button>
              </div>
              
              <div className="relative group">
                {/* Đã bật lại Icon */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 
                             bg-white border border-gray-200 rounded-2xl 
                             text-gray-900 text-sm font-medium placeholder:text-gray-400/80
                             focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 focus:bg-white
                             hover:border-fuchsia-300
                             outline-none transition-all duration-200 shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {/* Eye Icon Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button - Giới hạn width sm:w-[90%] */}
            <div className="w-full sm:w-[90%] pt-2">
                <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white 
                            bg-linear-to-r from-fuchsia-600 to-pink-600 
                            shadow-lg shadow-fuchsia-500/30 
                            hover:from-fuchsia-500 hover:to-pink-500 hover:scale-[1.01] hover:shadow-fuchsia-500/40
                            active:scale-[0.98] 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 
                            transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                    Đăng nhập <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </span>
                )}
                </button>
            </div>

            {/* Register Link - Giới hạn width sm:w-[90%] */}
            <div className="w-full sm:w-[90%] text-center">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-fuchsia-600 hover:text-fuchsia-500 transition-colors"
                >
                  Đăng ký miễn phí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}