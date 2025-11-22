'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu } from 'lucide-react';
import { useAppSelector } from '@/hook/useRedux'; 

export default function Navbar() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa hàng', path: '/shop/products' },
    { name: 'Câu chuyện', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-fuchsia-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* --- LOGO (Giữ nguyên to rõ) --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-fuchsia-100 group-hover:border-fuchsia-300 transition shadow-sm">
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-full h-full object-cover"
               onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=E')}
             />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-none group-hover:text-fuchsia-700 transition">
              beauty<span className="text-fuchsia-600 italic">&</span>skincare
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium group-hover:text-fuchsia-400 transition">
              Natural Cosmetics
            </span>
          </div>
        </Link>

        {/* --- DESKTOP MENU (SỬA LẠI Ở ĐÂY) --- */}
        {/* 1. Bỏ background xám chung */}
        {/* 2. Thêm gap-8 để các nút xa nhau ra */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              // Style cho từng nút riêng biệt:
              // - border-transparent: Mặc định không có viền
              // - hover:bg-fuchsia-50: Hover vào có nền hồng
              // - hover:shadow-md: Hover vào nổi lên
              className="px-6 py-3 rounded-full text-base font-bold text-gray-600 transition-all duration-300 border border-transparent hover:border-fuchsia-200 hover:text-fuchsia-700 hover:bg-fuchsia-50 hover:shadow-md hover:-translate-y-0.5"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* --- ICONS --- */}
        <div className="flex items-center gap-5">
          <button className="p-3 rounded-full hover:bg-fuchsia-50 text-gray-500 hover:text-fuchsia-600 transition">
            <Search size={24} />
          </button>
          
          <Link href="/cart" className="relative p-3 rounded-full hover:bg-fuchsia-50 text-gray-500 hover:text-fuchsia-600 transition group">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-fuchsia-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button className="md:hidden p-2 text-gray-600">
            <Menu size={28} />
          </button>
        </div>

      </div>
    </nav>
  );
}