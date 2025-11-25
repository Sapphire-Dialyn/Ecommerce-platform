'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Search, Menu, User, LogOut, 
  LayoutDashboard, Store, Building2, Truck, FileText, X, Loader2 
} from 'lucide-react'; 
import { useAppSelector, useAppDispatch } from '@/hook/useRedux'; 
import { logout, UserRole } from '@/store/slices/authSlice';
import { productService } from '@/services/product.service'; // Import service để tìm kiếm
import NavbarChatButton from '@/component/NavbarChatButton';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  
  // --- REDUX STATES ---
  const { user, isLoading } = useAppSelector((state) => state.auth); 
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // --- SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // Lưu kết quả tìm kiếm
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Ref để xử lý click ra ngoài thì đóng dropdown
  const searchRef = useRef<HTMLDivElement>(null);

  // --- XỬ LÝ TÌM KIẾM (DEBOUNCE) ---
  useEffect(() => {
    // Chỉ tìm khi có từ khóa
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          // Gọi API lấy tất cả sp rồi lọc (Hoặc gọi API search riêng nếu Backend có)
          const allProducts = await productService.getAllProducts();
          
          // Lọc client-side đơn giản (Case insensitive)
          const filtered = allProducts.filter((p: any) => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          setSearchResults(filtered.slice(0, 5)); // Chỉ lấy 5 kết quả đầu
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500); // Đợi 500ms sau khi ngừng gõ mới tìm

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  // --- LOGOUT ---
  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  // --- DASHBOARD LINK ---
  const getDashboardLink = (role: UserRole) => {
    switch (role) {
        case 'ADMIN': return '/admin';
        case 'SELLER': return '/seller';       
        case 'ENTERPRISE': return '/enterprise'; 
        case 'SHIPPER': return '/shipper'; 
        case 'LOGISTICS': return '/logistics';
        default: return '/profile';
    }
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Cửa hàng', path: '/shop/products' },
    { name: 'Câu chuyện', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-fuchsia-100 shadow-sm transition-all duration-300">

      <div className="container mx-auto px-6 h-24 flex items-center justify-between gap-4">
        
        {/* --- 1. LOGO --- */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-fuchsia-100 group-hover:border-fuchsia-300 transition shadow-sm">
             <img 
               src="/logo.png" 
               alt="Logo" 
               className="w-full h-full object-cover"
               onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=B')}
             />
          </div>
          <div className="flex flex-col sm:flex">
            <span className="text-xl md:text-2xl font-serif font-bold text-gray-900 leading-none group-hover:text-fuchsia-700 transition">
              beauty<span className="text-fuchsia-600 italic">&</span>skincare
            </span>
          </div>
        </Link>
        <div className="flex items-center">
  {/* ... các icon khác */}
  <NavbarChatButton />
</div>

        {/* --- 2. SEARCH BAR (HIỂN THỊ TRUNG TÂM) --- */}
        <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="w-full py-2.5 pl-10 pr-10 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all text-sm text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fuchsia-500 transition-colors" size={18} />
                
                {/* Nút xóa text/loading */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isSearching ? (
                        <Loader2 className="animate-spin text-fuchsia-500" size={16} />
                    ) : searchQuery ? (
                        <button onClick={() => { setSearchQuery(''); setShowDropdown(false); }} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* DROPDOWN KẾT QUẢ TÌM KIẾM */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                        <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Sản phẩm gợi ý</p>
                        {searchResults.map((product) => (
                            <div 
                                key={product.id}
                                onClick={() => {
                                    router.push(`/shop/products/${product.id}`);
                                    setShowDropdown(false);
                                    setSearchQuery(''); // Xóa search sau khi click
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-fuchsia-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                            >
                                <img 
                                    src={product.images?.[0] || 'https://via.placeholder.com/40'} 
                                    alt={product.name} 
                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-fuchsia-600 font-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants?.[0]?.price || product.basePrice || 0)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => {
                                router.push(`/shop/products?search=${searchQuery}`);
                                setShowDropdown(false);
                            }}
                            className="w-full py-2 text-center text-xs font-bold text-fuchsia-600 hover:underline"
                        >
        
                        </button>
                    </div>
                </div>
            )}
            
            {/* State Không tìm thấy */}
            {showDropdown && searchQuery && !isSearching && searchResults.length === 0 && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-center text-sm text-gray-500">
                    Không tìm thấy sản phẩm nào.
                 </div>
            )}
        </div>

        {/* --- 3. RIGHT ACTIONS --- */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">

          {/* Desktop Menu Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
               const isActive = link.path === '/' 
                 ? pathname === '/' 
                 : pathname.startsWith(link.path);
               return (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`text-sm font-bold transition-all duration-300 relative group/link whitespace-nowrap
                      ${isActive ? 'text-fuchsia-600' : 'text-gray-600 hover:text-fuchsia-600'}
                    `}
                  >
                    {link.name}
                    <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-fuchsia-600 transform transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'}`}></span>
                  </Link>
               );
            })}
          </div>

          {/* AUTH & CART */}
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200">
            {isLoading ? (
               <div className="w-32 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="relative group py-2">
                   <Link href={getDashboardLink(user.role)} className="cursor-pointer block">
                       <img 
                           src={user.avatar || 'https://via.placeholder.com/40'} 
                           alt={user.name} 
                           className="w-9 h-9 rounded-full border border-fuchsia-200 object-cover hover:ring-2 hover:ring-fuchsia-400 transition" 
                       />
                   </Link>

                   {/* Dropdown User Menu */}
                   <div className="absolute right-0 top-full mt-0 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-4 group-hover:translate-y-0 origin-top-right overflow-hidden z-50">
                       <div className="px-4 py-3 border-b border-gray-50">
                           <p className="text-[10px] font-bold text-fuchsia-600 uppercase">{user.role}</p>
                           <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                       </div>
                       <div className="p-2 space-y-1">
                           {user.role !== 'CUSTOMER' && (
                               <Link href={getDashboardLink(user.role)} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                                   <LayoutDashboard size={16} /> Trang quản lý
                               </Link>
                           )}
                           <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                               <User size={16} /> Hồ sơ cá nhân
                           </Link>
                           {user.role === 'CUSTOMER' && (
                               <Link href="/profile/orders" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-fuchsia-50 hover:text-fuchsia-600 transition">
                                   <FileText size={16} /> Đơn hàng
                               </Link>
                           )}
                       </div>
                       <div className="p-2 border-t border-gray-50">
                           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition">
                               <LogOut size={16}/> Đăng xuất
                           </button>
                       </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-fuchsia-700 hover:bg-fuchsia-50 rounded-full transition">
                  Đăng nhập
                </Link>
                <Link href="/register" className="px-5 py-2 text-xs font-bold text-white bg-fuchsia-600 rounded-full shadow-md shadow-fuchsia-200 hover:bg-fuchsia-700 transition">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* GIỎ HÀNG */}
          <Link href="/cart" className={`relative p-2 rounded-full transition group ${pathname === '/cart' ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-gray-500 hover:bg-fuchsia-50 hover:text-fuchsia-600'}`}>
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-fuchsia-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-gray-600">
            <Menu size={26} />
          </button>
        </div>

      </div>
    </nav>
  );
}