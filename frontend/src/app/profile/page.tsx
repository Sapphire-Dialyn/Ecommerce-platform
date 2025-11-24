'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link'; // Import Link để chuyển trang
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { userService } from '@/services/user.service';
import { loginSuccess } from '@/store/slices/authSlice'; 
import { toast } from 'react-hot-toast';
import { 
  User, Phone, Mail, Building2, Store, 
  Camera, Loader2, Save, ShieldCheck, Upload,
  Package, ChevronRight, Calendar, CreditCard, ShoppingBag
} from 'lucide-react';

// Mock data cho đơn hàng (Bạn có thể thay thế bằng API call sau này)
const MOCK_ORDERS = [
  { id: 'ORD-7782-XM', date: '2023-11-20', total: 1250000, status: 'DELIVERED', items: 3 },
  { id: 'ORD-9921-AB', date: '2023-11-22', total: 450000, status: 'SHIPPING', items: 1 },
  { id: 'ORD-1102-CP', date: '2023-11-24', total: 2890000, status: 'PENDING', items: 5 },
];

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

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

  // Helper function render trạng thái đơn hàng
  const renderOrderStatus = (status: string) => {
    switch(status) {
      case 'DELIVERED':
        return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">Hoàn thành</span>;
      case 'SHIPPING':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Đang giao</span>;
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">Chờ xử lý</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{status}</span>;
    }
  };

  if (!user) return null;

  const isSeller = user.role === 'SELLER';
  const isEnterprise = user.role === 'ENTERPRISE';

  // Style chung
  const labelClass = "block text-sm font-bold text-gray-900 uppercase tracking-wide mb-2";
  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200 shadow-sm disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">HỒ SƠ CÁ NHÂN</h1>
          <p className="text-gray-500 font-medium">Quản lý thông tin tài khoản và đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COL 1: AVATAR & BASIC INFO --- */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Avatar Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-fuchsia-50 transition-transform transform group-hover:scale-105">
                  <img 
                    src={avatarPreview || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Overlay Camera Icon */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <Camera className="text-white drop-shadow-md" size={32} />
                </div>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'avatar')}
                />
              </div>
              
              <h2 className="mt-6 text-2xl font-extrabold text-gray-900">{formData.name || 'Người dùng'}</h2>
              
              <div className="mt-3 inline-flex items-center px-4 py-1.5 rounded-full bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200">
                <ShieldCheck size={16} className="mr-2" />
                <span className="text-xs font-bold uppercase tracking-wider">{user.role}</span>
              </div>
            </div>

            {/* Role Specific Logo (Seller/Enterprise) */}
            {(isSeller || isEnterprise) && (
               <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 border-b-2 border-fuchsia-500 pb-1 inline-block">
                   Logo Thương Hiệu
                 </h3>
                 <div 
                   className="relative group cursor-pointer w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all duration-300" 
                   onClick={() => logoInputRef.current?.click()}
                 >
                   {logoPreview ? (
                       <>
                           <img src={logoPreview} className="w-full h-full object-contain p-2" alt="Logo" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                               <p className="text-white font-bold flex items-center gap-2"><Upload size={20}/> Đổi Logo</p>
                           </div>
                       </>
                   ) : (
                       <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-fuchsia-600 transition-colors">
                           <Building2 size={40} className="mb-2" />
                           <span className="text-sm font-bold uppercase">Tải lên Logo</span>
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

          {/* --- COL 2: FORM DETAILS & ORDERS --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SECTION: FORM INFO */}
            <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
              
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-100 gap-4">
                <h3 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                    <User className="text-fuchsia-600" size={28}/>
                    Thông tin chi tiết
                </h3>
                {/* Nút Save */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-fuchsia-700 transition shadow-lg shadow-fuchsia-200 disabled:opacity-70 transform active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><Save size={20} /> LƯU THAY ĐỔI</>}
                </button>
              </div>

              <div className="space-y-8">
                {/* 1. THÔNG TIN TÀI KHOẢN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className={labelClass}>Họ và tên</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                className={inputClass}
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Email (Cố định)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="email" 
                                disabled
                                className={`${inputClass} cursor-not-allowed opacity-80`}
                                value={formData.email}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}>Số điện thoại</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                className={inputClass}
                                placeholder="Cập nhật số điện thoại..."
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. THÔNG TIN DOANH NGHIỆP / CỬA HÀNG */}
                {(isSeller || isEnterprise) && <hr className="border-gray-100 my-4" />}

                {isSeller && (
                    <div className="space-y-6">
                        <h4 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                            <Store className="text-fuchsia-600" size={24}/> THÔNG TIN CỬA HÀNG
                        </h4>
                        <div>
                            <label className={labelClass}>Tên cửa hàng</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    className={`${inputClass} pl-4`}
                                    placeholder="Nhập tên cửa hàng..."
                                    value={formData.storeName}
                                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {isEnterprise && (
                    <div className="space-y-6">
                        <h4 className="font-extrabold text-xl text-gray-900 flex items-center gap-2">
                            <Building2 className="text-fuchsia-600" size={24}/> THÔNG TIN DOANH NGHIỆP
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Tên công ty</label>
                                <input 
                                    type="text" 
                                    className={`${inputClass} pl-4`}
                                    placeholder="Công ty TNHH..."
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Mã số thuế</label>
                                <input 
                                    type="text" 
                                    className={`${inputClass} pl-4 font-mono tracking-wider`}
                                    placeholder="0123456789"
                                    value={formData.taxCode}
                                    onChange={(e) => setFormData({...formData, taxCode: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Trạng thái xác thực</label>
                                <div className={`w-full px-4 py-3 rounded-xl border flex items-center gap-3 font-bold ${user.enterprise?.verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                                    <ShieldCheck size={20} />
                                    {user.enterprise?.verified ? 'ĐÃ XÁC THỰC' : 'ĐANG CHỜ DUYỆT'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </form>

            {/* --- SECTION: MY ORDERS (ĐƠN HÀNG CỦA TÔI) --- */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Package className="text-fuchsia-600" size={28}/>
                        Đơn hàng của tôi
                    </h3>
                    <Link href="/profile/orders" className="text-sm font-bold text-fuchsia-600 hover:text-fuchsia-800 hover:underline">
                        Xem tất cả
                    </Link>
                </div>

                <div className="space-y-4">
                    {MOCK_ORDERS.length > 0 ? (
                        MOCK_ORDERS.map((order) => (
                            <Link 
                                href={`/profile/orders/${order.id}`} 
                                key={order.id}
                                className="block group"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md hover:border-fuchsia-200 transition-all duration-200">
                                    {/* Left Info */}
                                    <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-fuchsia-600 group-hover:border-fuchsia-200 transition-colors">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-extrabold text-gray-900">{order.id}</span>
                                                {renderOrderStatus(order.status)}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                                <span className="flex items-center gap-1"><Calendar size={14}/> {order.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span>{order.items} sản phẩm</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Info & Action */}
                                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Tổng tiền</p>
                                            <p className="font-extrabold text-fuchsia-600 text-lg">
                                                {order.total.toLocaleString('vi-VN')}đ
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-fuchsia-600 group-hover:text-white group-hover:border-transparent transition-all">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <Package size={48} className="mx-auto mb-3 opacity-50"/>
                            <p>Bạn chưa có đơn hàng nào</p>
                        </div>
                    )}
                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}