'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles, 
  Building2, Store, FileText, CheckCircle2 
} from 'lucide-react';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State quản lý Role
  const [role, setRole] = useState<'CUSTOMER' | 'SELLER' | 'ENTERPRISE'>('CUSTOMER');

  // State dữ liệu form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    storeName: '',
    companyName: '',
    taxCode: '',
  });

  // State file upload
  const [files, setFiles] = useState<{
    businessLicense: File | null;
    brandRegistration: File | null;
    taxDocument: File | null;
    businessDocument: File | null;
    identityDocument: File | null;
    addressDocument: File | null;
  }>({
    businessLicense: null,
    brandRegistration: null,
    taxDocument: null,
    businessDocument: null,
    identityDocument: null,
    addressDocument: null,
  });

  // --- CSS CLASS CHO INPUT (Thay thế style jsx) ---
  const inputClassName = "block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium placeholder:text-gray-400/80 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 focus:bg-white hover:border-fuchsia-300 outline-none transition-all duration-200 shadow-sm";

  // Hàm xử lý chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự');
        setIsLoading(false);
        return;
    }

    try {
      const payload = new FormData();
      
      // Common fields
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('name', formData.fullName);
      payload.append('role', role);

      // Logic riêng từng role
      if (role === 'SELLER') {
        payload.append('storeName', formData.storeName || formData.fullName);
        if (files.businessDocument) payload.append('businessDocument', files.businessDocument);
        if (files.identityDocument) payload.append('identityDocument', files.identityDocument);
        if (files.addressDocument) payload.append('addressDocument', files.addressDocument);
      }

      if (role === 'ENTERPRISE') {
        payload.append('companyName', formData.companyName);
        payload.append('taxCode', formData.taxCode);
        payload.append('verified', 'false'); 
        payload.append('officialBrand', 'true');

        if (files.businessLicense) payload.append('businessLicense', files.businessLicense);
        if (files.brandRegistration) payload.append('brandRegistration', files.brandRegistration);
        if (files.taxDocument) payload.append('taxDocument', files.taxDocument);
      }

      // Gọi API
      await authService.register(payload); 
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/login');
      
    } catch (error: any) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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

      <div className="relative z-10 w-full max-w-[600px] px-4">
        
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
            <h2 className="mt-4 text-xl font-bold text-gray-800">Đăng ký tài khoản</h2>
          </div>

          {/* ROLE SELECTION TABS */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-white/50 rounded-2xl border border-gray-200 mb-8">
            {[
              { id: 'CUSTOMER', label: 'Khách hàng', icon: User },
              { id: 'SELLER', label: 'Người bán', icon: Store },
              { id: 'ENTERPRISE', label: 'Doanh nghiệp', icon: Building2 },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as any)}
                className={`
                  flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300
                  ${role === r.id 
                    ? 'bg-white text-fuchsia-600 shadow-md shadow-fuchsia-100 ring-1 ring-fuchsia-100 scale-[1.02]' 
                    : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'}
                `}
              >
                <r.icon size={20} className={role === r.id ? 'text-fuchsia-500' : 'text-gray-400'} strokeWidth={role === r.id ? 2.5 : 2}/>
                {r.label}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleRegister} className="flex flex-col items-center space-y-5 w-full">
            
            {/* 1. THÔNG TIN CHUNG */}
            <div className="w-full space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">
                        {role === 'ENTERPRISE' ? 'Tên người đại diện' : 'Họ và tên'}
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className={inputClassName}
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          className={inputClassName}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••"
                          className={`${inputClassName} pr-12`}
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
            </div>

            {/* 2. TRƯỜNG RIÊNG CHO SELLER */}
            {role === 'SELLER' && (
               <div className="w-full space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-gray-200 pt-5 mt-2">
                  <p className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider mb-2">Thông tin cửa hàng</p>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Tên cửa hàng (Store Name)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Store className="h-5 w-5 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Mỹ Phẩm Xinh"
                          className={inputClassName}
                          value={formData.storeName}
                          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                      <FileUploadField 
                          label="Giấy phép kinh doanh (Nếu có)" 
                          file={files.businessDocument} 
                          onChange={(e) => handleFileChange(e, 'businessDocument')} 
                      />
                      <FileUploadField 
                          label="CMND/CCCD/Hộ chiếu (Chủ shop)" 
                          file={files.identityDocument} 
                          onChange={(e) => handleFileChange(e, 'identityDocument')} 
                      />
                  </div>
               </div>
            )}

            {/* 3. TRƯỜNG RIÊNG CHO ENTERPRISE */}
            {role === 'ENTERPRISE' && (
                <div className="w-full space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-gray-200 pt-5 mt-2">
                    <p className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider mb-2">Hồ sơ doanh nghiệp</p>
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Tên công ty pháp lý</label>
                        <input
                            type="text" required
                            placeholder="Công Ty TNHH ABC..."
                            className={inputClassName}
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 ml-1">Mã số thuế</label>
                        <input
                            type="text" required
                            placeholder="0123456789"
                            className={`${inputClassName} font-mono`}
                            value={formData.taxCode}
                            onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <FileUploadField 
                            label="Giấy phép đăng ký kinh doanh *" 
                            file={files.businessLicense} 
                            onChange={(e) => handleFileChange(e, 'businessLicense')} 
                        />
                        <FileUploadField 
                            label="Giấy chứng nhận đăng ký thuế *" 
                            file={files.taxDocument} 
                            onChange={(e) => handleFileChange(e, 'taxDocument')} 
                        />
                        <FileUploadField 
                            label="Giấy chứng nhận thương hiệu (Nếu có)" 
                            file={files.brandRegistration} 
                            onChange={(e) => handleFileChange(e, 'brandRegistration')} 
                        />
                    </div>
                </div>
            )}

            {/* BUTTON */}
            <div className="w-full pt-4">
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
                    {role === 'ENTERPRISE' ? 'Gửi hồ sơ xét duyệt' : 'Đăng ký tài khoản'} 
                    <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                )}
                </button>
            </div>

            {/* Footer Links */}
            <div className="text-center">
                <p className="mt-2 text-sm text-gray-500">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700 transition">
                    Đăng nhập ngay
                    </Link>
                </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Component con để upload file cho gọn code
function FileUploadField({ label, file, onChange }: { label: string, file: File | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 ml-1">{label}</label>
            <label className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-300 transition group">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-400 group-hover:text-fuchsia-500 transition">
                        {file ? <CheckCircle2 size={18} className="text-green-500"/> : <FileText size={18}/>}
                    </div>
                    <span className={`text-sm truncate ${file ? 'text-fuchsia-700 font-medium' : 'text-gray-400'}`}>
                        {file ? file.name : 'Chọn tập tin (PDF, JPG...)'}
                    </span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-500 group-hover:text-fuchsia-600 shadow-sm">
                    Upload
                </div>
                <input type="file" className="hidden" onChange={onChange} accept=".pdf,.jpg,.png,.jpeg" />
            </label>
        </div>
    )
}