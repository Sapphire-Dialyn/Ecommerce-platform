"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useParallax from "@/hook/useParallax";

export default function AboutPage() {
  useParallax(0.25);

  const GIVENCHY_ID = "cmialsium000pvr8w4xp0888l";
  const MAYBELLINE_ID = "cmialsu83001vvr8w5gpowhzx";
  const NACIFIC_ID = "cmialsna6001dvr8wrgkzzn1t";

  return (
    <div className="w-full bg-white overflow-hidden">

      {/* ================= SECTION 1: AESPA x Givenchy ================= */}
      <SlidingSection
        reverse={true} 
        title="Câu chuyện thương hiệu"
        description="Beauty & Skincare khởi nguồn từ niềm đam mê với vẻ đẹp tinh tế và hành trình mang lại sự tự tin cho người Việt."
        link={{ href: `/shop/products?enterpriseId=${GIVENCHY_ID}`, label: "Khám phá Givenchy →" }}
        img="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/3/1100376/Aespa-5A.jpg"
        overlayText="AESPA x Givenchy" // 👈 Text hiện khi hover
      />

      {/* ================= SECTION 2: ITZY x Maybelline ================= */}
      <SlidingSection
        title="Sứ mệnh từ trái tim"
        description="Chúng tôi tin rằng mỗi làn da đều có một câu chuyện riêng."
        link={{ href: `/shop/products?enterpriseId=${MAYBELLINE_ID}`, label: "Bộ sưu tập Maybelline →" }}
        img="https://cdn.sanity.io/images/f8lauh0h/production/a20923c961e8928d624a4f985e9fce12148e5de0-2000x1125.jpg?fit=max&auto=format"
        overlayText="ITZY x Maybelline New York" // 👈 Text hiện khi hover
      />

      {/* ================= SECTION 3: Stray Kids x Nacific ================= */}
      <SlidingSection
        reverse
        title="Đồng hành cùng bạn"
        list={["✓ Sản phẩm chính hãng", "✓ Giá tốt & ưu đãi lớn", "✓ Giao hàng nhanh"]}
        link={{ href: `/shop/products?enterpriseId=${NACIFIC_ID}`, label: "Bộ sưu tập Nacific →" }}
        img="https://thekshop.ca/cdn/shop/products/NacificxStrayKidsYouMadeMySKZDaySpecialCollaborationVeganHandButterSet_main.jpg?v=1675823128"
        overlayText="Stray Kids x Nacific" // 👈 Text hiện khi hover
      />
    </div>
  );
}

/* ================= STORY SLIDE SECTIONS (Đã cập nhật) ================= */
function SlidingSection({ title, description, list, link, img, reverse = false, overlayText }: any) {
  const xStart = reverse ? 120 : -120;
  const xStartText = reverse ? -120 : 120;

  // Tilt state
  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // X relative
    const y = e.clientY - rect.top;  // Y relative
    const rotateY = ((x / rect.width) - 0.5) * 20; // max ±10°
    const rotateX = ((y / rect.height) - 0.5) * -20; // max ±10°, ngược trục Y
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <section
      className={`w-full min-h-screen flex flex-col md:flex-row items-center ${reverse ? "md:flex-row-reverse" : ""} overflow-hidden`}
    >
      {/* IMAGE SIDE */}
      <motion.div
        initial={{ opacity: 0, x: xStart }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full h-[60vh] md:h-screen md:w-1/2 perspective-1000 p-4 md:p-0"
      >
        {/* 👇 Bọc Link để click vào ảnh chuyển trang */}
        <Link href={link.href} className="block w-full h-full">
            <div 
                className="relative w-full h-full group overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
            >
                {/* Ảnh nền */}
                <Image 
                    src={img} 
                    alt="story" 
                    fill 
                    className="object-cover transition-all duration-700 ease-in-out 
                               group-hover:scale-110 group-hover:blur-[3px] group-hover:brightness-50" 
                />

                {/* 👇 Text Overlay hiện khi Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                    <span className="text-white text-2xl md:text-4xl font-serif font-bold tracking-widest text-center px-4 uppercase drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {overlayText}
                    </span>
                </div>
            </div>
        </Link>
      </motion.div>

      {/* TEXT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: xStartText }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.08 }}
        className="w-full md:w-1/2 p-12 md:p-24"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">{title}</h2>

        {description && <p className="text-lg text-gray-700 mb-6">{description}</p>}

        {list && (
          <ul className="space-y-3 text-lg text-gray-700 mb-6">
            {list.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}

        {link && (
          <Link href={link.href} className="text-fuchsia-600 text-lg font-semibold hover:underline">
            {link.label}
          </Link>
        )}
      </motion.div>
    </section>
  );
}