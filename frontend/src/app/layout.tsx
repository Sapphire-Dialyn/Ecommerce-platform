import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Import các thành phần hạ tầng
import Providers from "@/component/Providers"; 
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import ChatWidget from "@/component/ChatWidget"; // Chatbot
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
  title: {
    template: '%s | Beauty & Skincare', 
    default: 'Beauty & Skincare | Đánh thức vẻ đẹp thuần khiết',
  },
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
    <html lang="vi" className="scroll-smooth"> 
      <body
        // Theme màu hồng fuchsia đồng bộ toàn app
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-fuchsia-50 text-gray-900 flex flex-col min-h-screen selection:bg-fuchsia-200 selection:text-fuchsia-900`}
      >
        {/* Bọc toàn bộ app trong Providers (Redux + Auth + Chat State) */}
        <Providers>
          
          {/* Navbar cố định */}
          <Navbar />
          
          {/* Main Content */}
          <main className="grow min-h-screen flex flex-col">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Chat Widget - Trợ lý ảo Cantarella (Luôn hiển thị) */}
          <ChatWidget />

          {/* Cấu hình Toast thông báo đẹp mắt */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: 'backdrop-blur-md bg-white/80 border border-gray-100 shadow-xl',
              style: {
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                style: {
                  background: '#fdf4ff', // fuchsia-50
                  color: '#c026d3',      // fuchsia-600
                  border: '1px solid #f0abfc',
                  fontWeight: '600',
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
                  fontWeight: '600',
                },
              },
            }}
          />
          
        </Providers>
      </body>
    </html>
  );
}