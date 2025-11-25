'use client';

import { useAppDispatch } from '@/hook/useRedux';
import { toggleChat } from '@/store/slices/chatSlice';

export default function NavbarChatButton() {
  const dispatch = useAppDispatch();

  // Avatar Cantarella (Dùng DiceBear để tạo hình consistent với ChatWidget)
  const CANTARELLA_AVATAR = "https://i.pinimg.com/736x/79/2c/65/792c65eaa80ffae684ec7125bc31bdd8.jpg";

  return (
    <button
      onClick={() => dispatch(toggleChat())}
      className="group relative flex items-center gap-3 px-1.5 py-1.5 pr-4 bg-white border border-gray-200 hover:border-fuchsia-300 text-gray-800 rounded-full transition-all duration-300 ml-4 shadow-sm hover:shadow-md"
      title="Chat với em nhé!"
    >
      {/* --- 1. Avatar Container --- */}
      <div className="relative">
        {/* Hình ảnh */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-fuchsia-500 shadow-sm group-hover:scale-110 transition-transform duration-300 bg-fuchsia-50">
          <img 
            src={CANTARELLA_AVATAR} 
            alt="Cantarella AI" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Chấm xanh Online */}
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
        
        {/* Hiệu ứng sóng lan tỏa (Ping) khi hover */}
        <span className="absolute -inset-1 rounded-full bg-fuchsia-400 opacity-20 group-hover:animate-ping"></span>
      </div>

      {/* --- 2. Text Info --- */}
      <div className="flex flex-col items-start text-left">
        <span className="text-xs font-extrabold text-fuchsia-700 uppercase tracking-wide leading-none">Can tổng</span>
        <span className="text-[10px] font-medium text-gray-500 leading-none mt-0.5">Trợ lý ảo</span>
      </div>
      
      {/* --- 3. Tooltip bong bóng (Hiện khi hover) --- */}
      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-max bg-gray-900 text-white text-xs font-medium py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl transform translate-y-2 group-hover:translate-y-0 duration-200">
        Cần tư vấn? Hỏi ta ngay nhé!
        {/* Mũi tên tam giác của tooltip */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </button>
  );
}