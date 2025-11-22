import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-rose-700 via-pink-600 to-fuchsia-700 pt-16 pb-8 border-t border-rose-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="Beauty & Skincare Logo" 
                width={40} 
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-serif font-bold text-white">
                beauty<span className="text-pink-200 italic">&</span>skincare
              </span>
            </Link>
            <p className="text-rose-100 text-sm leading-relaxed">
              Đánh thức vẻ đẹp tiềm ẩn của bạn với các sản phẩm chăm sóc da từ thiên nhiên, an toàn và lành tính.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white hover:text-fuchsia-700 transition shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6">Về chúng tôi</h4>
            <ul className="space-y-3 text-sm text-rose-100">
              <li><Link href="/about" className="hover:text-white transition">Câu chuyện thương hiệu</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Tuyển dụng</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-6">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm text-rose-100">
              <li><Link href="/help/how-to-buy" className="hover:text-white transition">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/help/return-policy" className="hover:text-white transition">Chính sách đổi trả</Link></li>
              <li><Link href="/help/privacy-policy" className="hover:text-white transition">Bảo mật thông tin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-rose-100">
              <li className="flex gap-3">
                <MapPin size={18} className="text-pink-200 shrink-0" />
                <span>Tầng 36, Tòa nhà Beauty, Quận 18, TP.HCM</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-pink-200 shrink-0" />
                <span>1900 0000</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-pink-200 shrink-0" />
                <span>support@beautyandskincare.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rose-600 pt-8 text-center text-sm text-rose-100">
          © 2025 beauty&skincare. All rights reserved.
        </div>
      </div>
    </footer>
  );
}