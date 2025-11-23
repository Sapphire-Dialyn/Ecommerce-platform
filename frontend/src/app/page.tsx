'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import Link from 'next/link';
import { ArrowRight, Star, Heart, CheckCircle, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800 selection:bg-fuchsia-200">
      
      {/* --- 1. HERO SECTION: Tinh gọn & Tập trung hình ảnh --- */}
<section className="relative min-h-[90vh] flex items-center pt-4 pb-10 overflow-hidden bg-fuchsia-50">
  
  {/* Background Decor (Giữ nguyên nhưng làm mờ hơn để tôn ảnh chính) */}
  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
  <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>

  <div className="container mx-auto px-6 relative z-10">
    <div className="flex flex-col-reverse md:flex-row items-center gap-8 lg:gap-16">
      
      {/* 1. TEXT CONTENT (Chiếm 40% - Gọn gàng bên trái) */}
      <div className="w-full md:w-5/12 space-y-10 text-center md:text-left"> 
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-fuchsia-200 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-600"></span>
          </span>
          <span className="text-xs font-bold text-fuchsia-800 uppercase tracking-widest">New Collection 2025</span>
        </div>
        
        {/* Headline: Sửa leading để chữ không bị chồng lên nhau */}
        <h1 className="text-3xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.1]">
          Vẻ đẹp từ <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-500 italic">
            Sự Thuần Khiết
          </span>
        </h1>
        
        {/* Description: Bỏ translate lạ, căn chỉnh margin chuẩn */}
        <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0 font-medium"> 
          Đánh thức làn da rạng rỡ với bộ sưu tập chăm sóc da cao cấp, chiết xuất 100% từ thiên nhiên, nâng niu vẻ đẹp Á Đông.
        </p>
        
        {/* Buttons: Gọn gàng hơn */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"> 
          <Link 
            href="/shop/products" 
            className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg hover:bg-fuchsia-600 hover:shadow-fuchsia-500/30 transition-all transform hover:-translate-y-1 text-center"
          >
            Mua ngay
          </Link>
          <Link 
            href="/about" 
            className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold shadow-sm hover:bg-fuchsia-50 hover:text-fuchsia-700 hover:border-fuchsia-200 transition-all transform hover:-translate-y-1 text-center"
          >
            Tìm hiểu thêm
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500 font-medium pt-2"> 
            <div className="flex items-center gap-2"><CheckCircle size={18} className="text-fuchsia-600"/> Chính hãng 100%</div>
            <div className="flex items-center gap-2"><Truck size={18} className="text-fuchsia-600"/> Miễn phí vận chuyển</div>
        </div>
      </div>

      {/* IMAGE CONTENT - Ảnh to & Nổi bật */}
            <div className="w-full lg:w-7/12 relative">
                <div className="absolute inset-0 bg-linear-to-tr from-fuchsia-200/30 to-transparent rounded-[3rem] rotate-2 transform scale-95 -z-10"></div>
                {/* THAY ĐỔI: Tăng chiều cao của div bao quanh ảnh */}
                {/* Dùng h-[550px] hoặc h-[600px] tùy ý muốn */}
                <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white/60 group h-[550px] sm:h-[650px] md:h-[700px] lg:h-[650px]">
                  <img 
                    src="https://ayanaus.com/wp-content/uploads/2025/03/12312412312.png" 
                    alt="Hero Product" 
                    className="w-full h-full object-cover transform transition duration-1000 group-hover:scale-105"
                  />
                </div>
                
                 {/* Floating Tag */}
                 {/* <div className="absolute bottom-10 -left-4 md:left-8 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white hidden md:flex items-center gap-3 animate-bounce duration-3000">
                    <div className="bg-green-100 p-2 rounded-full">
                        <Sparkles className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Thành phần</p>
                        <p className="text-sm font-bold text-gray-900">100% Thiên nhiên</p>
                    </div>
                </div> */}
            </div>

    </div>
  </div>
</section>

      {/* --- 2. DANH MỤC NỔI BẬT (Categories) --- */}
      <section className="py-5 bg-pink-50 pb-2">
        <div className="container mx-auto px-10 flex flex-col items-center">
          <h2 className="text-center text-3xl font-serif font-extrabold text-gray-900 mb-30 leading-10">
            {/* KHỐI MỚI: Thêm <div> để tạo khung viền */}
            <div className="p-6 border-6 border-fuchsia-700 bg-pink-50 rounded-4xl shadow-xl">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-500">
                Danh mục yêu thích
              </span>
            </div>
          </h2>
          
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl w-full leading-20">
            {[
              { 
                id: "cmials0wu0000vr8wtzaycoo0", 
                name: "Chăm sóc da mặt", 
                img: "https://www.laneige.com.vn/media/catalog/product/2/5/250624_final_vn_wb_hyaluronic_cleansing_foam_thumbnail_600x600.jpg?optimize=low&fit=bounds&height=&width=&canvas=:" 
              },
              { 
                id: "cmials0wz0001vr8w8j2u5ein", 
                name: "Trang điểm", 
                img: "https://file.hstatic.net/200000073977/article/my-pham-trang-diem_ffc49920bf144f08886d93fb22f15cbf.jpg" 
              },
              { 
                id: "cmials0x00002vr8w0kxu4cqr", 
                name: "Chăm sóc cơ thể", 
                img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=200&q=80" 
              },
            ].map((cat) => (
              <Link 
                href={`/shop/products?categoryId=${cat.id}`} 
                key={cat.id} 
                className="group flex flex-col items-center gap-6 cursor-pointer"
              >
                {/* --- SỬA Ở ĐÂY: Tăng kích thước vòng tròn --- */}
                {/* w-48 h-48 (mobile) -> w-60 h-60 (desktop) cho TO RÕ */}
                {/* border-4: Viền dày hơn cho nổi bật */}
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-full p-2 border-4 border-dashed border-fuchsia-300 group-hover:border-fuchsia-600 transition duration-500 bg-white shadow-lg group-hover:shadow-fuchsia-200">
                  
                  <div className="w-full h-full rounded-full overflow-hidden bg-white relative flex items-center justify-center">
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      // scale-110 sẵn để ảnh to hơn chút, hover thì to thêm
                      className="w-full h-full object-cover transform scale-105 group-hover:scale-125 transition duration-700 ease-in-out" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Category";
                      }}
                    />
                  </div>

                </div>
                
                {/* Tên danh mục to hơn một chút */}
                <span className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-fuchsia-700 transition font-serif">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. SẢN PHẨM BÁN CHẠY (Grid System) --- */}
      <section className="py-10 bg-fuchsia-50/30">
        <div className="container mx-auto px-4">
    {/* THAY THẾ KHỐI TIÊU ĐỀ CŨ BẰNG KHỐI MỚI - CĂN GIỮA VÀ NỔI BẬT */}
    <div className="flex flex-col items-center mb-20"> {/* ĐÃ THAY: justify-between items-end mb-10 thành flex-col items-center mb-20 */}
        
        {/* Dòng 1: BEST SELLER (Chữ nhỏ, màu nhấn) */}
        <p className="text-xl md:text-2xl font-sans uppercase text-fuchsia-700 tracking-widest mb-2">
            BEST SELLER
        </p>
        
        {/* Dòng 2: SẢN PHẨM NỔI BẬT (Chữ lớn, Gradient) */}
        <h2 className="text-2xl md:text-6xl font-serif font-extrabold leading-tight tracking-tight bg-linear-to-r from-fuchsia-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Sản phẩm nổi bật
        </h2>
    </div>

          {loading ? (
            <div className="flex justify-center py-5">
               <div className="animate-spin rounded-full h-5 w-10 border-b-2 border-fuchsia-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9">
              {/* Chỉ lấy 4 sản phẩm đầu tiên */}
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl p-3 border border-transparent hover:border-fuchsia-100 hover:shadow-xl transition duration-300 flex flex-col">
                  {/* Ảnh sản phẩm */}
                  <div className="relative aspect-4/5 bg-gray-50 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                      alt={product.name} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition duration-500"
                    />
                    
                    {/* Nút tim */}
                    {/* <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full shadow hover:bg-red-50 hover:text-red-500 transition">
                       <Heart size={18} />
                    </button> */}

                    {/* Nút thêm vào giỏ (Hiện khi hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300">
                       <Link href={`/shop/products/${product.id}`} className="block w-full bg-white/90 backdrop-blur text-gray-900 font-bold text-center py-3 rounded-lg shadow hover:bg-fuchsia-600 hover:text-white transition text-sm">
                          Xem chi tiết
                       </Link>
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="text-center flex-1 flex flex-col">
                    <Link href={`/shop/products/${product.id}`}>
                       <h3 className="font-bold text-gray-800 text-lg mb-1 truncate hover:text-fuchsia-600 transition cursor-pointer">
                         {product.name}
                       </h3>
                    </Link>
                    <div className="flex justify-center gap-1 mb-2 text-yellow-400">
                       {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor"/>)}
                    </div>
                    <div className="mt-auto pt-2">
                       <span className="text-xl font-bold text-fuchsia-600 font-serif">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants?.[0]?.price || 0)}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- 4. BRAND STORY - NỔI BẬT NHƯ FIGMA --- */}
<section className="relative pt-15 md:pt-32 pb-2 bg-pink-100 overflow-hidden">

    
    {/* Background Image Overlay - Màu hồng nhạt */}
    <div className="absolute inset-0 bg-pink-100 opacity-80 z-0"></div>
    <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0" 
        style={{ backgroundImage: "url('https://kienvua.com/wp-content/uploads/2021/08/thiet-ke-logo-shop-my-pham.jpg')" }}
    ></div>

    <div className="container px-6 relative z-10"> {/* z-10 để nội dung nằm trên background */}
        
        {/* Tiêu đề chính của Section */}
        <div className="bg-white/10 backdrop-blur-md border-2 border-pink-100 px-10 py-1 rounded-3xl shadow-xl mb-6 -mt-12 md:-mt-24 z-20 relative">
                     <h2 className="text-center text-4xl md:text-2xl font-serif font-extrabold text-gray-900 leading-tight uppercase tracking-wide">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-700 to-pink-600">
                            Câu chuyện
                        </span>
                        <br/>
                        <span className="text-gray-900 text-3xl md:text-5xl">
                            Thương hiệu
                        </span>
                    </h2>
                </div>

        {/* Khối nội dung chính - Các phần ảnh và text như Figma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* Khối Text/Giới thiệu ban đầu */}
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-8 bg-white/70 backdrop-blur-sm rounded-xl shadow-lg">
                <h3 className="text-2xl md:text-4xl font-serif font-bold text-gray-800">
                    Sứ mệnh của chúng tôi
                </h3>
                <p className="text-gray-700 max-w-xl text-lg md:text-xl leading-relaxed font-light italic">
                    "Chúng tôi tin rằng mỗi người phụ nữ đều sở hữu một vẻ đẹp riêng biệt. Sứ mệnh của chúng tôi là giúp bạn tỏa sáng theo cách của riêng mình."
                </p>
                <Link 
    href="/about" 
    className="
        inline-flex items-center justify-center
        px-20 py-6
        bg-white/70 text-gray-800 
        rounded-full 
        font-bold text-lg 
        shadow-xl 
        hover:bg-fuchsia-600 transition transform hover:-translate-y-1
    "
>
    Tìm hiểu thêm
</Link>
            </div>

            {/* Khối Hình ảnh lớn bên cạnh */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                {/* Bạn thay lại đường dẫn ảnh của bạn vào đây nhé */}
                <img 
                    src="https://thanhnien.mediacdn.vn/Uploaded/quochungqc/2022_12_13/1-3555.jpg" 
                    alt="Brand Story Image" 
                    // THAY ĐỔI: Thêm group-hover:blur-sm để làm mờ ảnh khi hover
                    className="w-full h-80 md:h-96 object-cover group-hover:scale-105 group-hover:blur-sm transition-transform duration-500 ease-in-out"
                />
                
                {/* THAY ĐỔI: Bỏ bg-black bg-opacity-30 ở đây */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* THAY ĐỔI: Thêm nền đen mờ cho chữ, tăng padding cho đẹp */}
                    <span className="text-white text-2xl font-bold bg-black/50 px-6 py-3 rounded-xl">
                        Khai phá
                    </span>
                </div>
            </div>
            
        </div> {/* End grid */}

        {/* Phần Gallery/Hình ảnh bổ sung (nếu cần như Figma) */}
        {/* Ví dụ: 3 ảnh nhỏ dưới dạng grid */}
        <div className="mt-10 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* --- ẢNH 1 --- */}
    <div className="relative rounded-xl overflow-hidden shadow-lg group">
        <img 
            src="https://i.pinimg.com/736x/3f/7f/41/3f7f41c17175bc619adc1dbec482d039.jpg" 
            alt="Gallery Image 1" 
            // QUAN TRỌNG: w-full h-72 object-cover (đảm bảo ảnh phủ kín khung và bằng nhau)
            className="w-full h-72 object-cover transform group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">Tri thức</span>
        </div>
    </div>

    {/* --- ẢNH 2 --- */}
    <div className="relative rounded-xl overflow-hidden shadow-lg group">
        <img 
            src="https://images.squarespace-cdn.com/content/v1/53883795e4b016c956b8d243/f1d313a6-9480-433d-acc9-14e7c201b6b4/20604667_1901002723259976_1653435101074820527_n.jpg" 
            alt="Gallery Image 2" 
            // Class y hệt ảnh 1
            className="w-full h-72 object-cover transform group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">Vui vẻ</span>
        </div>
    </div>

    {/* --- ẢNH 3 --- */}
    <div className="relative rounded-xl overflow-hidden shadow-lg group">
        <img 
            src="https://bloganchoi.com/wp-content/uploads/2023/10/aespa-ningning-1.jpg" 
            alt="Gallery Image 3" 
            // Class y hệt ảnh 1 & 2 -> Tự động crop ảnh dọc thành ngang để bằng 2 ảnh kia
            className="w-full h-72 object-cover transform group-hover:scale-105 group-hover:blur-sm transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">Đẹp thuần khiết</span>
        </div>
    </div>
</div>

    </div> {/* End container */}
</section>

    </main>
  );
}