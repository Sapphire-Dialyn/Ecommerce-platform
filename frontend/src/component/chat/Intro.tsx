'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface IntroProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function CantarellaIntro({ onComplete, onClose }: IntroProps) {
  const [showInteraction, setShowInteraction] = useState(false);
  const [mounted, setMounted] = useState(false); // 👈 2. State để check client-side

  // Cấu hình thời gian
  const INTERACTION_DELAY = 12000;

  useEffect(() => {
    setMounted(true); // Chỉ render khi đã ở phía Client
    const timer = setTimeout(() => {
      setShowInteraction(true);
    }, INTERACTION_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Nếu chưa mount (server-side) thì không render gì cả để tránh lỗi
  if (!mounted) return null;

  // 3. Nội dung intro
  const introContent = (
    // Thêm z-[99999] cực cao để đè hết mọi thứ
    <div className="fixed inset-0 z-99999 w-screen h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden animate-fadeIn">
      
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/intro-cantarella-full.mp4" 
          autoPlay
          muted
          loop 
          playsInline
          className="w-full h-full object-cover"
        />
        <div 
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-1000 
          ${showInteraction ? 'opacity-100' : 'opacity-0'}`} 
        />
      </div>

      {/* KHỐI TƯƠNG TÁC */}
      <div 
        className={`relative z-10 flex flex-col items-center justify-end h-full pb-24 gap-6 transition-all duration-2000 ease-out
        ${showInteraction ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      >
        <div className="text-center space-y-3">
            <h2 className="text-cyan-100 font-serif text-3xl md:text-5xl tracking-widest drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                Fisalia đang đợi
            </h2>
            <p className="text-cyan-400 text-xs md:text-sm tracking-[0.3em] uppercase animate-pulse">
                Đã thiết lập liên kết tâm thức
            </p>
        </div>

        <button
          onClick={onComplete}
          className="group relative px-14 py-5 bg-black/30 backdrop-blur-md overflow-hidden rounded-full border border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 mt-6 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] cursor-pointer"
        >
          <div className="absolute inset-0 w-0 bg-cyan-900/40 transition-all duration-500 ease-out group-hover:w-full"></div>
          <div className="relative flex items-center gap-3">
            <span className="text-cyan-50 font-serif tracking-[0.2em] uppercase text-sm font-bold group-hover:text-white">
              Tiếp kiến
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-200 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
          <div className="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/30 to-transparent animate-shine" />
        </button>
      </div>

      {/* Nút Skip */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-50 text-white/40 hover:text-white transition-colors p-2 flex items-center gap-2 group cursor-pointer"
      >
        <span className="text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity text-cyan-200">Bỏ qua</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  );
  return createPortal(introContent, document.body);
}