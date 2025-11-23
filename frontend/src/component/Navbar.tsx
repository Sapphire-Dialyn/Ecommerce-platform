'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  ShoppingBag, Search, Menu, User, LogOut, 
  LayoutDashboard, Store, Building2, Truck, FileText 
} from 'lucide-react'; 
import { useAppSelector, useAppDispatch } from '@/hook/useRedux'; 
import { logout, UserRole } from '@/store/slices/authSlice';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // 1. LẤY DỮ LIỆU TỪ REDUX STORE
  // Lấy user và trạng thái loading từ Auth Slice
  const { user, isLoading } = useAppSelector((state) => state.auth); 
  
  // Lấy giỏ hàng từ Cart Slice
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 2. XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    dispatch(logout()); // Xóa Redux & LocalStorage
    router.push('/login'); // Chuyển về trang đăng nhập
  };

  // 3. LOGIC ĐIỀU HƯỚNG DỰA TRÊN ROLE
  // Giúp đưa người dùng về đúng trang quản lý của họ
  const getDashboardLink = (role: UserRole) => {
    switch (role) {
        case 'ADMIN': return '/admin';
        case 'SELLER': return '/seller';       
        case 'ENTERPRISE': return '/enterprise'; 
        case 'SHIPPER': return '/shipper'; 
        case 'LOGISTICS': return '/logistics';
        default: return '/profile'; // CUSTOMER về trang cá nhân
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa hàng', path: '/shop/products' },
    { name: 'Câu chuyện', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-fuchsia-100 shadow-sm transition-all duration-300">

      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* --- 1. LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-fuchsia-100 group-hover:border-fuchsia-300 transition shadow-sm">
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-full h-full object-cover"
               onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=B')}
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif font-bold text-gray-900 leading-none group-hover:text-fuchsia-700 transition">
              beauty<span className="text-fuchsia-600 italic">&</span>skincare
            </span>
          </div>
        </Link>

        {/* --- 2. DESKTOP MENU --- */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className="text-base font-bold text-gray-600 transition-all duration-300 hover:text-fuchsia-600 relative group/link"
            >
              {link.name}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-fuchsia-600 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </div>

        {/* --- 3. RIGHT ACTIONS --- */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Search Button */}
          <button className="p-2 rounded-full hover:bg-fuchsia-50 text-gray-500 hover:text-fuchsia-600 transition hidden sm:block">
            <Search size={22} />
          </button>

          {/* --- KHU VỰC AUTHENTICATION --- */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* CASE A: ĐANG TẢI (F5 trang) -> Hiện khung xương */}
            {isLoading ? (
               <div className="w-32 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            ) : user ? (
              
              // CASE B: ĐÃ ĐĂNG NHẬP -> Hiện Avatar & Dropdown
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden xl:block">
                   <p className="text-[10px] uppercase font-bold text-fuchsia-600 tracking-wider">{user.role}</p>
                   <p className="text-sm font-bold text-gray-900 max-w-[120px] truncate">{user.name}</p>
                </div>
                
                <div className="relative group py-2">
                    {/* Avatar Clickable */}
                    <Link href={getDashboardLink(user.role)} className="cursor-pointer">
                        <img 
                            src={user.avatar || 'https://via.placeholder.com/40'} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full border border-fuchsia-200 object-cover hover:ring-2 hover:ring-fuchsia-400 transition" 
                        />
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-4 group-hover:translate-y-0 origin-top-right overflow-hidden z-50">
                        
                        {/* Header Mobile (chỉ hiện khi menu xổ xuống) */}
                        <div className="px-4 py-3 border-b border-gray-50 xl:hidden">
                            <p className="text-xs font-bold text-fuchsia-600">{user.role}</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        </div>

                        <div className="p-2 space-y-1">
                            {/* Menu Quản Lý (Chỉ hiện cho Admin/Seller/Enterprise...) */}
                            {user.role !== 'CUSTOMER' && (
                                <Link href={getDashboardLink(user.role)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                                    {user.role === 'ADMIN' && <LayoutDashboard size={18} />}
                                    {user.role === 'SELLER' && <Store size={18} />}
                                    {user.role === 'ENTERPRISE' && <Building2 size={18} />}
                                    {(user.role === 'SHIPPER' || user.role === 'LOGISTICS') && <Truck size={18} />}
                                    Trang quản lý
                                </Link>
                            )}

                            {/* Menu Chung */}
                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                                <User size={18} /> Hồ sơ cá nhân
                            </Link>
                            
                            {/* Menu Riêng cho Khách hàng */}
                            {user.role === 'CUSTOMER' && (
                                <Link href="/profile/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                                    <FileText size={18} /> Đơn hàng của tôi
                                </Link>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-50">
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition">
                                <LogOut size={18}/> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
              </div>

            ) : (
              
              // CASE C: CHƯA ĐĂNG NHẬP -> Hiện nút Login/Register
              <div className="flex items-center gap-3">
                <Link href="/login" className="px-5 py-3 text-sm font-bold text-gray-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 rounded-full transition-all duration-300">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-8 py-3 text-sm font-bold text-white bg-linear-to-r from-fuchsia-600 to-pink-600 rounded-full shadow-md shadow-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-300 hover:-translate-y-0.5 hover:opacity-90 transition-all duration-300">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* --- 4. GIỎ HÀNG --- */}
          <Link href="/cart" className="relative p-2 rounded-full hover:bg-fuchsia-50 text-gray-500 hover:text-fuchsia-600 transition group">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-fuchsia-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-gray-600">
            <Menu size={28} />
          </button>
        </div>

      </div>
    </nav>
  );
}