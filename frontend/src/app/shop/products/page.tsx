'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = categoryId ? { categoryId } : {}; 
        const data = await productService.getAll(params);
        setProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Cuộn nhẹ lên đầu lưới sản phẩm thay vì đầu trang web để trải nghiệm mượt hơn
    const productGrid = document.getElementById('product-grid-start');
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  // --- HÀM RENDER PHÂN TRANG (Tái sử dụng cho cả trên và dưới) ---
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 py-4">
        {/* Nút Trước */}
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg border transition ${
            currentPage === 1 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-600'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition border ${
              currentPage === number
                ? 'bg-fuchsia-200 text-fuchsia-900 border-fuchsia-300 shadow-inner' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-fuchsia-600 hover:text-fuchsia-600'
            }`}
          >
            {number}
          </button>
        ))}

        {/* Nút Sau */}
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg border transition ${
            currentPage === totalPages 
              ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
              : 'border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-600'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-8 min-h-screen">
      
      {/* --- OPTION 2: ROYAL GRADIENT --- */}
<div className="py-20 flex flex-col items-center justify-center">
  
  <div className="relative">
    {/* Các ngôi sao trang trí lấp lánh */}
    <div className="absolute -top-8 -right-8 text-pink-400 text-4xl animate-pulse">✦</div>
    
    <h1 className="text-7xl md:text-9xl font-serif font-extrabold text-center leading-none tracking-tighter">
      <span className="block text-2xl text-gray-900">DANH SÁCH</span>
      {/* Chữ Gradient với viền text (text-stroke) ảo diệu */}
      <span className="block text-4xl text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 via-pink-500 to-purple-600 drop-shadow-sm">
        SẢN PHẨM
      </span>
    </h1>
  </div>

  {/* Đường kẻ trang trí */}
  <div className="flex items-center gap-4 mt-8 opacity-60">
    <div className="w-20 h-px bg-linear-to-r from-transparent to-fuchsia-500"></div>
    <div className="w-2 h-2 rotate-45 bg-fuchsia-500"></div>
    <div className="w-20 h-px bg-linear-to-l from-transparent to-fuchsia-500"></div>
  </div>

</div>


      {/* --- PHÂN TRANG TRÊN ĐẦU (VỊ TRÍ MỚI) --- */}
      <div className="mb-8">
        {renderPagination()}
      </div>

      {/* Điểm neo để cuộn tới khi chuyển trang */}
      <div id="product-grid-start"></div>

      {/* --- NỘI DUNG DANH SÁCH --- */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
            <p className="text-xl">Chưa có sản phẩm nào trong danh mục này.</p>
            <Link href="/" className="text-fuchsia-600 hover:underline mt-4 inline-block">Quay về trang chủ</Link>
        </div>
      ) : (
        <>
          {/* GRID SẢN PHẨM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-fuchsia-50 hover:shadow-xl hover:border-fuchsia-200 hover:-translate-y-1 transition duration-300 group h-full flex flex-col">
                <div className="aspect-square bg-gray-50 mb-4 rounded-xl overflow-hidden relative">
                   <img 
                     src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                     alt={product.name} 
                     className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                   />
                </div>
                <h3 className="font-bold text-gray-900 truncate text-lg mb-1 group-hover:text-fuchsia-700 transition">
                  {product.name}
                </h3>
                {product.variants?.[0] && (
                  <p className="text-fuchsia-600 font-bold text-lg mb-4">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants[0].price)}
                  </p>
                )}
                <Link href={`/shop/products/${product.id}`} className="mt-auto block text-center bg-fuchsia-50 text-fuchsia-700 py-2.5 rounded-lg hover:bg-fuchsia-600 hover:text-white font-bold transition duration-300">
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>

          {/* --- PHÂN TRANG DƯỚI CÙNG (GIỮ LẠI CHO UX TỐT HƠN) --- */}
          <div className="pb-12">
            {renderPagination()}
          </div>
        </>
      )}
    </div>
  );
}