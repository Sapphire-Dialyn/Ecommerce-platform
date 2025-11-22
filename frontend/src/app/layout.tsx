import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Import các thành phần hạ tầng
import ReduxProvider from "@/store/ReduxProvider";
import AuthProvider from "@/providers/AuthProvider"; // 👈 1. Import AuthProvider
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Toaster } from "react-hot-toast"; 

// Cấu hình Font chữ
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", 
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "beauty&skincare | Đánh thức vẻ đẹp thuần khiết",
  description: "Nền tảng thương mại điện tử mỹ phẩm chính hãng, uy tín hàng đầu.",
  icons: {
    icon: "/logo.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen`}
      >
        {/* Bọc toàn bộ ứng dụng trong Redux để quản lý State */}
        <ReduxProvider>
          
          {/* 👈 2. Bọc nội dung bên trong AuthProvider.
             AuthProvider cần nằm TRONG ReduxProvider (để dùng dispatch) 
             nhưng nằm NGOÀI Navbar (để Navbar có dữ liệu mà dùng)
          */}
          <AuthProvider>

            {/* Thanh điều hướng nằm cố định trên cùng */}
            <Navbar />

            {/* Nội dung chính của từng trang (Page) */}
            <main className="grow pt-24"> 
              {children}
            </main>

            {/* Chân trang nằm cố định dưới cùng */}
            <Footer />

            {/* Cấu hình thông báo Toast */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#fdf4ff', // fuchsia-50
                    color: '#c026d3',      // fuchsia-600
                    border: '1px solid #f0abfc',
                    fontWeight: '500',
                  },
                  iconTheme: {
                    primary: '#c026d3',
                    secondary: '#fff',
                  },
                },
                error: {
                  style: {
                    background: '#fff1f2',
                    color: '#e11d48',
                    border: '1px solid #fecdd3',
                  },
                },
              }}
            />
            
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}