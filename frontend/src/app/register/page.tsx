'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        setIsLoading(false);
        return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
    } catch (error: any) {
      toast.error('Đăng ký thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-fuchsia-50 py-10">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-[500px] px-4">
        
        {/* CARD CONTAINER */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-10 px-6 sm:px-12">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-3xl font-serif font-bold text-gray-900 tracking-tight hover:scale-105 transition-transform"
            >
              <Sparkles className="w-6 h-6 text-fuchsia-500" strokeWidth={2.5} />
              <span>beauty<span className="text-fuchsia-600 italic">&</span>skincare</span>
            </Link>
            <h2 className="mt-4 text-xl font-bold text-gray-800">Tạo tài khoản mới</h2>
            <p className="mt-2 text-sm text-gray-500">
                Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 transition">
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          {/* FORM - Thêm flex col và items-center để căn giữa */}
          <form onSubmit={handleRegister} className="flex flex-col items-center space-y-5 w-full">
            
            {/* Wrapper chung để giới hạn độ rộng cho input */}
            {/* w-full sm:w-[90%] nghĩa là: mobile full, màn hình to hơn thì chỉ lấy 90% chiều rộng */}
            
            {/* 1. HỌ VÀ TÊN */}
            <div className="w-full sm:w-[90%] space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Họ và tên</label>
              <div className="relative group">
                {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div> */}
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="block w-full pl-11 pr-4 py-3.5 
                             bg-white border border-gray-200 rounded-2xl 
                             text-gray-900 text-sm font-medium placeholder:text-gray-400/80
                             focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 focus:bg-white
                             hover:border-fuchsia-300
                             outline-none transition-all duration-200 shadow-sm"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* 2. EMAIL */}
            <div className="w-full sm:w-[90%] space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div> */}
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

            {/* 3. MẬT KHẨU */}
            <div className="w-full sm:w-[90%] space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
              <div className="relative group">
                {/* <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                </div> */}
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Tối thiểu 6 ký tự"
                  className="block w-full pl-11 pr-12 py-3.5 
                             bg-white border border-gray-200 rounded-2xl 
                             text-gray-900 text-sm font-medium placeholder:text-gray-400/80
                             focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 focus:bg-white
                             hover:border-fuchsia-300
                             outline-none transition-all duration-200 shadow-sm"
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
              
              <div className="flex gap-2 items-center mt-1 ml-1">
                 {formData.password.length >= 6 ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                 ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                 )}
                 <span className={`text-xs ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                    Tối thiểu 6 ký tự
                 </span>
              </div>
            </div>

            {/* BUTTON - Cũng giới hạn width giống input */}
            <div className="w-full sm:w-[90%] pt-2">
                <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl font-bold text-white 
                            bg-linear-to-r from-fuchsia-600 to-pink-600 
                            shadow-lg shadow-fuchsia-500/30 
                            hover:from-fuchsia-500 hover:to-pink-500 hover:scale-[1.01] hover:shadow-fuchsia-500/40
                            active:scale-[0.98] 
                            transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                    Đăng ký tài khoản <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                )}
                </button>
            </div>

            {/* TERMS TEXT */}
            <div className="w-full sm:w-[90%]">
                <p className="text-xs text-center text-gray-500 leading-relaxed">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="/help/return-policy" className="underline decoration-gray-300 underline-offset-2 hover:text-fuchsia-600">Điều khoản dịch vụ</a>
                {' '}và{' '}
                <a href="/help/privacy-policy" className="underline decoration-gray-300 underline-offset-2 hover:text-fuchsia-600">Chính sách bảo mật</a>
                </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}