"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import useParallax from "@/hook/useParallax";
import { productService } from "@/services/product.service"; // 👈 Thêm service

export default function AboutPage() {
  useParallax(0.25);

  // 1. Quản lý state cho các ID động thay vì gán tĩnh
  const [brandIds, setBrandIds] = useState({
    givenchy: "",
    maybelline: "",
    nacific: ""
  });

  // 2. Logic tự động săn tìm ID từ Database
  useEffect(() => {
    const fetchDynamicIds = async () => {
      try {
        // Tải danh sách sản phẩm để tìm các hãng "đang có hàng"
        const products = await productService.getAllProducts();
        
        // Lọc ra danh sách Enterprise không bị trùng lặp
        const uniqueEnterprises = Array.from(
          new Map(
            products
              .filter((p: any) => p.enterprise) // Bỏ qua nếu sp không có enterprise
              .map((p: any) => [p.enterprise.id, p.enterprise])
          ).values()
        ) as any[];

        // Hàm thông minh: Tìm theo tên, nếu không thấy thì lấy ID đầu tiên/thứ 2/thứ 3 làm fallback
        const findId = (keyword: string, fallbackIndex: number) => {
          const match = uniqueEnterprises.find((e) => 
            e.companyName.toLowerCase().includes(keyword)
          );
          return match ? match.id : (uniqueEnterprises[fallbackIndex]?.id || "");
        };

        // Gán ID thật vào state
        setBrandIds({
          givenchy: findId("givenchy", 0),
          maybelline: findId("maybelline", 1),
          nacific: findId("nacific", 2)
        });

      } catch (error) {
        console.error("Lỗi khi tải ID thương hiệu:", error);
      }
    };

    fetchDynamicIds();
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden">

      {/* ================= SECTION 1: AESPA x Givenchy ================= */}
      <SlidingSection
        reverse={true} 
        title="Câu chuyện thương hiệu"
        description="Beauty & Skincare khởi nguồn từ niềm đam mê với vẻ đẹp tinh tế và hành trình mang lại sự tự tin cho người Việt."
        link={{ 
          href: `/shop/products?enterpriseId=${brandIds.givenchy}`, // 👈 ID tự động
          label: "Khám phá Givenchy →" 
        }}
        img="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/3/1100376/Aespa-5A.jpg"
        overlayText="AESPA x Givenchy" 
      />

      {/* ================= SECTION 2: ITZY x Maybelline ================= */}
      <SlidingSection
        title="Sứ mệnh từ trái tim"
        description="Chúng tôi tin rằng mỗi làn da đều có một câu chuyện riêng."
        link={{ 
          href: `/shop/products?enterpriseId=${brandIds.maybelline}`, // 👈 ID tự động
          label: "Bộ sưu tập Maybelline →" 
        }}
        img="https://cdn.sanity.io/images/f8lauh0h/production/a20923c961e8928d624a4f985e9fce12148e5de0-2000x1125.jpg?fit=max&auto=format"
        overlayText="ITZY x Maybelline New York" 
      />

      {/* ================= SECTION 3: Stray Kids x Nacific ================= */}
      <SlidingSection
        reverse
        title="Đồng hành cùng bạn"
        list={["✓ Sản phẩm chính hãng", "✓ Giá tốt & ưu đãi lớn", "✓ Giao hàng nhanh"]}
        link={{ 
          href: `/shop/products?enterpriseId=${brandIds.nacific}`, // 👈 ID tự động 
          label: "Bộ sưu tập Nacific →" 
        }}
        img="https://thekshop.ca/cdn/shop/products/NacificxStrayKidsYouMadeMySKZDaySpecialCollaborationVeganHandButterSet_main.jpg?v=1675823128"
        overlayText="Stray Kids x Nacific" 
      />
    </div>
  );
}

/* ================= STORY SLIDE SECTIONS (Giữ nguyên không đổi) ================= */
function SlidingSection({ title, description, list, link, img, reverse = false, overlayText }: any) {
  const xStart = reverse ? 120 : -120;
  const xStartText = reverse ? -120 : 120;

  const [tilt, setTilt] = React.useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    const rotateY = ((x / rect.width) - 0.5) * 20; 
    const rotateX = ((y / rect.height) - 0.5) * -20; 
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => setTilt({ rotateX: 0, rotateY: 0 });

  return (
    <section
      className={`w-full min-h-screen flex flex-col md:flex-row items-center ${reverse ? "md:flex-row-reverse" : ""} overflow-hidden pt-10`}
    >
      {/* IMAGE SIDE */}
      <motion.div
        initial={{ opacity: 0, x: xStart }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full h-[60vh] md:h-screen md:w-1/2 perspective-1000 p-4 md:p-0"
      >
        {/* Nút bấm tự động ẩn (pointer-events-none) nếu DB chưa có thương hiệu nào */}
        <Link href={link.href} className={`block w-full h-full ${!link.href.includes('=') || link.href.endsWith('=') ? 'pointer-events-none opacity-90' : ''}`}>
            <div 
                className="relative w-full h-full group overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
            >
                <Image 
                    src={img} 
                    alt="story" 
                    fill 
                    className="object-cover transition-all duration-700 ease-in-out 
                               group-hover:scale-110 group-hover:blur-[3px] group-hover:brightness-50" 
                />
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

        {/* Ẩn dòng chữ link nếu chưa tải được ID */}
        {link && link.href.includes('=') && !link.href.endsWith('=') && (
          <Link href={link.href} className="text-fuchsia-600 text-lg font-semibold hover:underline">
            {link.label}
          </Link>
        )}
      </motion.div>
    </section>
  );
}