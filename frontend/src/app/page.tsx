'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import Link from 'next/link';
import { ArrowRight, Star, Heart, CheckCircle, Truck, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
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
      
      {/* --- 1. HERO SECTION: Gradient Tím Hồng Sang Trọng --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradient chéo */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-50 via-purple-50 to-white -z-10"></div>
        
        {/* Hình tròn trang trí mờ ảo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-12 z-12 text-center"> 
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-fuchsia-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-pulse"></span>
              <span className="text-2xl font-bold text-fuchsia-800 uppercase tracking-widest">New Collection 2025</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 leading-6"> {/* THAY ĐỔI: Tăng kích thước chữ lên md:text-8xl */}
              Vẻ đẹp từ <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-500 italic">
                Sự Thuần Khiết
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 max-w-lg leading-8 mx-auto translate-x-25 font-sans font-semibold"> 
    Đánh thức làn da rạng rỡ với bộ sưu tập chăm sóc da cao cấp, chiết xuất 100% từ thiên nhiên.
</p>
            
            <div className="flex gap-12 pt-16 justify-center "> 
              <Link 
                href="/shop/products" 
                className="px-12 py-9 bg-white/70 text-gray-800 rounded-full font-bold shadow-lg hover:bg-fuchsia-600 hover:shadow-fuchsia-200 transition transform hover:-translate-y-1"
              >
                Mua ngay
              </Link>
              <Link 
                href="/about" 
                className="px-12 py-9 bg-white/70 text-gray-800 rounded-full font-bold shadow-lg hover:bg-fuchsia-600 hover:shadow-fuchsia-200 transition transform hover:-translate-y-1"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Trust Indicators nhỏ */}
            <div className="flex gap-6 pt-4 text-sm text-gray-500 font-medium justify-center"> 
                <div className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Chính hãng 100%</div>
                <div className="flex items-center gap-2"><Truck size={16} className="text-blue-500"/> Free ship</div>
            </div>
          </div>

          {/* Image Content */}
          <div className="md:w-1/2 relative">
              <div className="relative z-10 rounded-[50px] overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition duration-500">
                <img 
                  src="https://ayanaofficial.com/wp-content/uploads/2025/09/anh-banner-size-cn-2.png" 
                  alt="Hero" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
          </div>
        </div>
      </section>

      {/* --- 2. DANH MỤC NỔI BẬT (Categories) --- */}
      <section className="py-20 bg-pink-50">
        <div className="container mx-auto px-18 flex flex-col items-center">
          <h2 className="text-center text-3xl font-serif font-extrabold text-gray-900 mb-30 leading-10">
            {/* KHỐI MỚI: Thêm <div> để tạo khung viền */}
            <div className="p-12 border-8 border-fuchsia-700 bg-pink-50 rounded-3xl shadow-xl">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 to-pink-500">
                Danh mục yêu thích
              </span>
            </div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full leading-20">
            {[
              { 
                id: "cmi8n5pb20000vrsc405a285t", 
                name: "Chăm sóc da mặt", 
                img: "https://www.laneige.com.vn/media/catalog/product/2/5/250624_final_vn_wb_hyaluronic_cleansing_foam_thumbnail_600x600.jpg?optimize=low&fit=bounds&height=&width=&canvas=:" 
              },
              { 
                id: "cmi8n5pb70001vrscran3x3mw", 
                name: "Trang điểm", 
                img: "https://file.hstatic.net/200000073977/article/my-pham-trang-diem_ffc49920bf144f08886d93fb22f15cbf.jpg" 
              },
              { 
                id: "cmi8n5pb80002vrscho5v6zy3", 
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
      <section className="py-20 bg-fuchsia-50/30">
        <div className="container mx-auto px-6">
    {/* THAY THẾ KHỐI TIÊU ĐỀ CŨ BẰNG KHỐI MỚI - CĂN GIỮA VÀ NỔI BẬT */}
    <div className="flex flex-col items-center mb-40"> {/* ĐÃ THAY: justify-between items-end mb-10 thành flex-col items-center mb-20 */}
        
        {/* Dòng 1: BEST SELLER (Chữ nhỏ, màu nhấn) */}
        <p className="text-xl md:text-2xl font-sans uppercase text-fuchsia-700 tracking-widest mb-2">
            BEST SELLER
        </p>
        
        {/* Dòng 2: SẢN PHẨM NỔI BẬT (Chữ lớn, Gradient) */}
        <h2 className="text-5xl md:text-9xl font-serif font-extrabold leading-tight tracking-tight bg-linear-to-r from-fuchsia-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Sản phẩm nổi bật
        </h2>
    </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* Chỉ lấy 4 sản phẩm đầu tiên */}
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl p-4 border border-transparent hover:border-fuchsia-100 hover:shadow-xl transition duration-300 flex flex-col">
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
<section className="relative py-20 md:py-32 bg-pink-100 overflow-hidden">
    
    {/* Background Image Overlay - Màu hồng nhạt */}
    <div className="absolute inset-0 bg-pink-100 opacity-80 z-0"></div>

    {/* Background Image (với opacity thấp để tạo hiệu ứng mờ ảo) */}
    {/* Bạn sẽ thay thế 'url(/path/to/your/background-image.jpg)' bằng ảnh của bạn */}
    <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0" 
        style={{ backgroundImage: "url('https://kienvua.com/wp-content/uploads/2021/08/thiet-ke-logo-shop-my-pham.jpg')" }}
    ></div>

    <div className="container mx-auto px-6 relative z-10"> {/* z-10 để nội dung nằm trên background */}
        
        {/* Tiêu đề chính của Section */}
        <div className="bg-white border-2 border-pink-100 px-10 py-5 rounded-3xl shadow-xl mb-6 -mt-12 md:-mt-24 z-20 relative">
                     <h2 className="text-center text-4xl md:text-6xl font-serif font-extrabold text-gray-900 leading-tight uppercase tracking-wide">
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
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
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
        <div className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
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