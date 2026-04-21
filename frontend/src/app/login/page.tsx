'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/hook/useRedux'; 
import { loginSuccess } from '@/store/slices/authSlice'; 
import { authService } from '@/services/auth.service'; 
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [formData, setFormData] = useState({ email: '', password: '' });

  // State dành riêng cho thông báo bị kích xuất (Single Session)
  const [isKicked, setIsKicked] = useState(false);
  const [kickedMessage, setKickedMessage] = useState('');

  // ✅ 1. BẮT LỖI TỪ BACKEND REDIRECT & INTERCEPTOR
  useEffect(() => {
    const error = searchParams.get('error');
    const type = searchParams.get('type');

    if (error) {
      const decodedError = decodeURIComponent(error);

      if (type === 'kicked') {
        // Mở Popup màu đỏ
        setIsKicked(true);
        setKickedMessage(decodedError);
      } else {
        // Lỗi bình thường thì dùng Toast
        toast.error(decodedError, {
          duration: 5000,
          icon: <ShieldAlert className="text-red-500" />,
        });
      }
      
      // 🔥 FIX: Xóa params trên URL bằng Web API thay vì dùng Next.js Router
      // Điều này giúp xóa URL mà không làm mất trạng thái Popup của React
      window.history.replaceState(null, '', '/login');
    }
  }, [searchParams]);

  // ✅ 2. XỬ LÝ ĐĂNG NHẬP GOOGLE
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const data = await authService.login(formData.email, formData.password);
    
    const token = data.accessToken || data.access_token;

    // ✅ 1. Lưu token TRƯỚC (quan trọng nhất)
    localStorage.setItem('accessToken', token);

    // ✅ 2. Lưu vào Redux
    dispatch(loginSuccess({
      user: data.user,
      token: token
    }));

    toast.success(`Chào mừng, ${data.user.name}!`);

    const role = data.user.role;

    // ✅ 3. Delay nhẹ để đảm bảo interceptor nhận token
    await new Promise((resolve) => setTimeout(resolve, 50));

    // ✅ 4. Dùng replace (tránh history lỗi)
    if (role === 'ADMIN') {
      router.replace('/admin');
    } else if (role === 'SHIPPER') {
      router.replace('/shipper'); 
    } else if (role === 'LOGISTICS') {
      router.replace('/logistics'); 
    } else if (['SELLER', 'ENTERPRISE'].includes(role)) {
      router.replace('/seller'); 
    } else {
      router.replace('/'); 
    }

    // ✅ 5. Force re-render toàn bộ app (fix luôn bug F5)
    router.refresh();

  } catch (error: any) {
    if (error.response?.status === 403) {
      toast.error(error.response.data.message || 'Tài khoản của bạn đã bị ban.');
    } else {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại.');
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-fuchsia-50">
      
      {/* ========================================================= */}
      {/* 🔥 POPUP CẢNH BÁO BẢO MẬT (Chỉ hiện khi bị kick) 🔥      */}
      {/* ========================================================= */}
      {isKicked && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-red-100 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertOctagon size={40} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Cảnh báo bảo mật</h3>
            <p className="text-gray-600 mb-8 font-medium leading-relaxed">{kickedMessage}</p>
            <button
              onClick={() => setIsKicked(false)}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              Đã hiểu & Thoát ra <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[480px] px-4">
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
            <p className="text-gray-500 text-sm mt-2 font-medium italic">
              Đánh thức vẻ đẹp tiềm ẩn của bạn
            </p>
          </div>

          {/* NÚT ĐĂNG NHẬP GOOGLE */}
          <div className="w-full sm:w-[90%] mx-auto mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 shadow-sm hover:bg-fuchsia-50 hover:border-fuchsia-200 transition-all duration-300 active:scale-[0.98]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm uppercase tracking-tighter">Tiếp tục với Google</span>
            </button>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-gray-400 bg-transparent px-4">
                Hoặc tài khoản nội bộ
              </div>
            </div>
          </div>

          {/* Form nội bộ */}
          <form onSubmit={handleLogin} className="flex flex-col items-center space-y-6 w-full">
            
            <div className="w-full sm:w-[90%] space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium placeholder:text-gray-400/80 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 outline-none transition-all duration-200 shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 outline-none transition-all duration-200 shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="w-full sm:w-[90%] pt-2">
                <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-linear-to-r from-fuchsia-600 to-pink-600 shadow-lg shadow-fuchsia-500/30 hover:from-fuchsia-500 hover:to-pink-500 hover:scale-[1.01] transition-all duration-200 disabled:opacity-70"
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