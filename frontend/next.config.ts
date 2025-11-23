import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media-cdn-v2.laodong.vn' },
      { protocol: 'https', hostname: 'jingdaily.com' },
      { protocol: 'https', hostname: 'thekshop.ca' },
      // Nếu bạn dùng ảnh từ cloudinary hoặc nơi khác thì thêm vào đây luôn
      { protocol: 'https', hostname: 'res.cloudinary.com' }, 
      { protocol: 'https', hostname: 'via.placeholder.com' },
      {
        protocol: "https",
        hostname: "media-cdn-v2.laodong.vn",
      },
      {
        protocol: "https",
        hostname: "jingdaily.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "thekshop.ca",
      }
    ],
  },
};

export default nextConfig;
