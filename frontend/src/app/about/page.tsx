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

      {/* ================= HERO PARALLAX (ảnh phải, text trái) ================= */}
      <SlidingSection
        reverse={true} // reverse để ảnh bên phải, text bên trái
        title="Câu chuyện thương hiệu"
        description="Beauty & Skincare khởi nguồn từ niềm đam mê với vẻ đẹp tinh tế và hành trình mang lại sự tự tin cho người Việt."
        link={{ href: `/shop/products?enterpriseId=${GIVENCHY_ID}`, label: "Khám phá Givenchy →" }}
        img="https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/10/3/1100376/Aespa-5A.jpg"
      />

      {/* ================= STORY SECTIONS ================= */}
      <SlidingSection
        title="Sứ mệnh từ trái tim"
        description="Chúng tôi tin rằng mỗi làn da đều có một câu chuyện riêng."
        link={{ href: `/shop/products?enterpriseId=${MAYBELLINE_ID}`, label: "Bộ sưu tập Maybelline →" }}
        img="https://cdn.sanity.io/images/f8lauh0h/production/a20923c961e8928d624a4f985e9fce12148e5de0-2000x1125.jpg?fit=max&auto=format"
      />

      <SlidingSection
        reverse
        title="Đồng hành cùng bạn"
        list={["✓ Sản phẩm chính hãng", "✓ Giá tốt & ưu đãi lớn", "✓ Giao hàng nhanh"]}
        link={{ href: `/shop/products?enterpriseId=${NACIFIC_ID}`, label: "Bộ sưu tập Nacific →" }}
        img="https://thekshop.ca/cdn/shop/products/NacificxStrayKidsYouMadeMySKZDaySpecialCollaborationVeganHandButterSet_main.jpg?v=1675823128"
      />
    </div>
  );
}


/* ================= HERO PARALLAX ================= */
function ParallaxHero({ title, desc, img }: any) {
  return (
    <section className="relative w-full h-screen flex items-end pb-24 px-10 overflow-hidden">
      <div
        data-parallax
        className="absolute inset-0"
      >
        <Image src={img} alt="hero" fill className="object-cover brightness-[0.65] parallax-img" />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

      <div className="relative z-20 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-white drop-shadow-2xl">
          {title}
        </h1>
        <p className="mt-6 text-xl text-white/80 max-w-xl">{desc}</p>
      </div>
    </section>
  );
}

/* ================= STORY SLIDE SECTIONS ================= */
function SlidingSection({ title, description, list, link, img, reverse = false }: any) {
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
      {/* IMAGE with 3D Tilt */}
      <motion.div
        initial={{ opacity: 0, x: xStart }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative w-full h-[60vh] md:h-screen md:w-1/2 perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <Image src={img} alt="story" fill className="object-cover rounded-3xl shadow-2xl" />
      </motion.div>

      {/* TEXT */}
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
