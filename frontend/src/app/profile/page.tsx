'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { userService } from '@/services/user.service';
import { loginSuccess } from '@/store/slices/authSlice'; // Để cập nhật lại Redux sau khi sửa
import { toast } from 'react-hot-toast';
import { 
  User, Phone, Mail, Building2, Store, 
  Camera, Loader2, Save, MapPin, ShieldCheck 
} from 'lucide-react';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Mặc định cho phép sửa luôn cho tiện

  // State dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Seller
    storeName: '',
    // Enterprise
    companyName: '',
    taxCode: '',
  });

  // State ảnh
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Ref input file
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        // Gọi API lấy thông tin mới nhất (có thể user trong redux chưa đủ chi tiết seller/enterprise)
        const fullUserData = await userService.getMe(); 
        
        setFormData({
          name: fullUserData.name || '',
          email: fullUserData.email || '',
          phone: fullUserData.phone || '',
          storeName: fullUserData.seller?.storeName || '',
          companyName: fullUserData.enterprise?.companyName || '',
          taxCode: fullUserData.enterprise?.taxCode || '',
        });

        setAvatarPreview(fullUserData.avatar);
        setLogoPreview(fullUserData.seller?.logoUrl || fullUserData.enterprise?.logoUrl);

      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [user]);

  // Xử lý chọn ảnh
  const handleFileChange = (e: any, type: 'avatar' | 'logo') => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(url);
      } else {
        setLogoFile(file);
        setLogoPreview(url);
      }
    }
  };

  // Submit cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await userService.updateProfile(formData, avatarFile, logoFile);
      
      // Cập nhật lại Redux store để Header/Navbar nhận diện thay đổi mới
      // Lưu ý: Backend trả về cấu trúc { user: ... } hay trực tiếp user thì sửa lại cho khớp
      dispatch(loginSuccess({ 
          user: updatedUser, 
          token: localStorage.getItem('accessToken') || '' 
      }));

      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi cập nhật hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const isSeller = user.role === 'SELLER';
  const isEnterprise = user.role === 'ENTERPRISE';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-500">Quản lý thông tin tài khoản và bảo mật</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COL 1: AVATAR & BASIC INFO --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Avatar Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-fuchsia-100 shadow-inner">
                  <img 
                    src={avatarPreview || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Overlay Camera Icon */}
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'avatar')}
                />
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">{formData.name || 'Người dùng'}</h2>
              <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full mt-2">
                {user.role}
              </p>
            </div>

            {/* Role Specific Logo (Seller/Enterprise) */}
            {(isSeller || isEnterprise) && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                 <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Logo Thương Hiệu</h3>
                 <div className="relative group cursor-pointer w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-fuchsia-400 transition bg-gray-50" onClick={() => logoInputRef.current?.click()}>
                    {logoPreview ? (
                        <img src={logoPreview} className="w-full h-full object-contain" alt="Logo" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Building2 size={32} />
                            <span className="text-xs mt-2">Tải lên Logo</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={logoInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'logo')}
                    />
                 </div>
               </div>
            )}

          </div>

          {/* --- COL 2: FORM DETAILS --- */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Thông tin chi tiết</h3>
                {/* Nút Save */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-fuchsia-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-fuchsia-700 transition shadow-lg shadow-fuchsia-200 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Lưu thay đổi</>}
                </button>
              </div>

              <div className="space-y-6">
                
                {/* 1. THÔNG TIN TÀI KHOẢN (Read only Email) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không thể đổi)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                disabled
                                className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                                value={formData.email}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none transition"
                                placeholder="Thêm số điện thoại"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* 2. THÔNG TIN DOANH NGHIỆP / CỬA HÀNG (Conditional) */}
                {isSeller && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Store className="text-fuchsia-600" size={20}/> Thông tin Cửa hàng
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none"
                                value={formData.storeName}
                                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {isEnterprise && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                            <Building2 className="text-fuchsia-600" size={20}/> Thông tin Doanh nghiệp
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-fuchsia-500 outline-none font-mono"
                                    value={formData.taxCode}
                                    onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái xác thực</label>
                                <div className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-500 flex items-center gap-2">
                                    <ShieldCheck size={18} className={user.enterprise?.verified ? 'text-green-500' : 'text-gray-400'} />
                                    {user.enterprise?.verified ? 'Đã xác thực' : 'Đang chờ duyệt / Chưa xác thực'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}