import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  // LẤY ID TỪ DỮ LIỆU API BẠN GỬI:
  const GIVENCHY_ID = "cmialsium000pvr8w4xp0888l";    // Givenchy Beauty
  const MAYBELLINE_ID = "cmialsu83001vvr8w5gpowhzx";  // Maybelline New York
  const NACIFIC_ID = "cmialsna6001dvr8wrgkzzn1t";     // Nacific Official

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-fuchsia-50 to-white pt-52 pb-24 flex flex-col items-center">
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl overflow-x-clip">
        
       {/* HEADER */}
      <div className="mb-36 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute -top-8 -right-8 text-pink-400 text-4xl animate-pulse">
            ✦
          </div>

          <h1 className="text-7xl md:text-9xl font-serif font-extrabold text-center leading-none tracking-tighter">
            <span className="block text-2xl text-gray-900 mb-2">Câu chuyện</span>
            <span className="block text-4xl md:text-6xl text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 via-pink-500 to-purple-600 drop-shadow-sm">
              THƯƠNG HIỆU
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4 mt-8 opacity-60">
          <div className="w-20 h-px bg-linear-to-r from-transparent to-fuchsia-500"></div>
          <div className="w-2 h-2 rotate-45 bg-fuchsia-500"></div>
          <div className="w-20 h-px bg-linear-to-l from-transparent to-fuchsia-500"></div>
        </div>
      </div>

        {/* --- PHẦN 1: GIVENCHY --- */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 mb-32">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight text-center md:text-left">
              Khởi nguồn của <br/>
              <span className="text-fuchsia-600">Vẻ đẹp đích thực</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-justify">
              Beauty & Skincare là nền tảng thương mại điện tử hàng đầu trong lĩnh vực mỹ phẩm chăm sóc da. 
              Chúng tôi được thành lập với niềm đam mê mãnh liệt về cái đẹp và mong muốn mang đến những giải pháp 
              chăm sóc da toàn diện nhất cho người Việt.
            </p>
            {/* Link chữ */}
            <Link href={`/shop/products?enterpriseId=${GIVENCHY_ID}`} className="inline-block text-fuchsia-600 font-bold hover:underline cursor-pointer text-lg">
               Xem các sản phẩm Givenchy &rarr;
            </Link>
          </div>
          
          {/* Link Ảnh: Bấm vào là chuyển trang */}
          <Link 
            href={`/shop/products?enterpriseId=${GIVENCHY_ID}`}
            className="w-full md:w-1/2 relative group cursor-pointer block"
          >
            <div className="absolute inset-0 bg-fuchsia-200 rounded-3xl transform rotate-3 group-hover:rotate-6 transition duration-500"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
              <Image 
                src="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/3/1100376/Aespa-5A.jpg"
                alt="AESPAxGivenchy"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
              />
              {/* Hiệu ứng Hover nút Mua Ngay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10">
                <span className="bg-white text-fuchsia-700 px-6 py-3 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition">
                  Khám phá ngay
                </span>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2 rounded-xl shadow-lg z-20">
                <span className="text-gray-900 font-bold text-sm tracking-wide">
                  ✨ AESPAxGivenchy
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* --- PHẦN 2: MAYBELLINE --- */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16 mb-32">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight text-center md:text-left">
              Sứ mệnh & <br/>
              <span className="text-fuchsia-600">Lời hứa từ trái tim</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-justify">
              Mục tiêu của chúng tôi là giúp mỗi khách hàng tìm thấy những sản phẩm chăm sóc da phù hợp nhất 
              với nhu cầu và loại da riêng biệt. Chúng tôi tin rằng vẻ đẹp thực sự đến từ việc thấu hiểu và 
              chăm sóc bản thân một cách đúng đắn.
            </p>
            <Link href={`/shop/products?enterpriseId=${MAYBELLINE_ID}`} className="inline-block text-fuchsia-600 font-bold hover:underline cursor-pointer text-lg">
               Gian hàng Maybelline New York &rarr;
            </Link>
          </div>

          <Link 
            href={`/shop/products?enterpriseId=${MAYBELLINE_ID}`}
            className="w-full md:w-1/2 relative group cursor-pointer block"
          >
            <div className="absolute inset-0 bg-fuchsia-200 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition duration-500"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
              <Image 
                src="https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fa20923c961e8928d624a4f985e9fce12148e5de0-2000x1125.jpg%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=3840&q=90"
                alt="Itzy Maybeline Newyork"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10">
                <span className="bg-white text-fuchsia-700 px-6 py-3 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition">
                  Mua ngay
                </span>
              </div>
               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2 rounded-xl shadow-lg z-20">
                <span className="text-gray-900 font-bold text-sm tracking-wide">
                  💄 Itzy Maybeline Newyork
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* --- PHẦN 3: NACIFIC --- */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight text-center md:text-left">
              Tại sao bạn nên <br/>
              <span className="text-fuchsia-600">Đồng hành cùng chúng tôi?</span>
            </h2>
            <ul className="space-y-4">
              {[
                "Sản phẩm chính hãng 100% từ các thương hiệu uy tín toàn cầu.",
                "Giá cả cạnh tranh cùng vô vàn chương trình khuyến mãi hấp dẫn.",
                "Dịch vụ giao hàng nhanh chóng, đóng gói cẩn thận, an toàn.",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 group/item">
                  <div className="mt-1 w-8 h-8 rounded-full bg-fuchsia-100 flex items-center justify-center group-hover/item:bg-fuchsia-600 transition duration-300 shrink-0">
                    <span className="text-fuchsia-600 font-bold text-sm group-hover/item:text-white transition">✓</span>
                  </div>
                  <span className="text-lg text-gray-700 leading-snug group-hover/item:text-gray-900 transition">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
             <Link href={`/shop/products?enterpriseId=${NACIFIC_ID}`} className="inline-block text-fuchsia-600 font-bold hover:underline cursor-pointer text-lg">
               Bộ sưu tập Nacific x StrayKids &rarr;
            </Link>
          </div>

          <Link 
            href={`/shop/products?enterpriseId=${NACIFIC_ID}`}
            className="w-full md:w-1/2 relative group cursor-pointer block"
          >
            <div className="absolute inset-0 bg-fuchsia-200 rounded-3xl transform rotate-3 group-hover:rotate-6 transition duration-500"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
              <Image 
                src="https://thekshop.ca/cdn/shop/products/NacificxStrayKidsYouMadeMySKZDaySpecialCollaborationVeganHandButterSet_main.jpg?v=1675823128"
                alt="NacificXStrayKids"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center z-10">
                <span className="bg-white text-fuchsia-700 px-6 py-3 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition">
                  Mua ngay
                </span>
              </div>
               <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-white/50 px-4 py-2 rounded-xl shadow-lg z-20">
                <span className="text-gray-900 font-bold text-sm tracking-wide">
                  🌿 NacificXStrayKids
                </span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}