'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/services/product.service';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho tiêu đề động
  const [pageTitle, setPageTitle] = useState("DANH SÁCH SẢN PHẨM");
  const [subTitle, setSubTitle] = useState("Khám phá");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const enterpriseId = searchParams.get('enterpriseId'); // Lấy enterpriseId từ URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data = [];

        // TRƯỜNG HỢP 1: Lọc theo Thương hiệu (Enterprise)
        if (enterpriseId) {
          // Gọi API riêng cho Enterprise mà bạn vừa thêm vào service
          data = await productService.getProductsByEnterprise(enterpriseId);
          
          // Cập nhật tiêu đề trang theo tên hãng
          if (data.length > 0 && data[0].enterprise) {
            setSubTitle("Gian hàng chính hãng");
            setPageTitle(data[0].enterprise.companyName.toUpperCase());
          } else {
             setSubTitle("Thương hiệu");
             setPageTitle("SẢN PHẨM CHÍNH HÃNG");
          }
        } 
        // TRƯỜNG HỢP 2: Lọc theo Danh mục (Category)
        else if (categoryId) {
          const allProducts = await productService.getAllProducts();
          data = allProducts.filter((p: any) => p.categoryId === categoryId);
          
          if (data.length > 0 && data[0].category) {
            setSubTitle("Danh mục");
            setPageTitle(data[0].category.name.toUpperCase());
          } else {
            setSubTitle("Danh mục");
            setPageTitle("SẢN PHẨM");
          }
        } 
        // TRƯỜNG HỢP 3: Xem tất cả
        else {
          data = await productService.getAllProducts();
          setSubTitle("DANH SÁCH");
          setPageTitle("SẢN PHẨM");
        }

        setProducts(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, enterpriseId]); // Chạy lại khi URL thay đổi

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const productGrid = document.getElementById('product-grid-start');
    if (productGrid) productGrid.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 py-0">
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );

  return (
    <div className="container mx-auto p-8 min-h-screen pt-1"> {/* Thêm pt-32 để tránh Header che */}
      
      {/* HEADER */}
      <div className="py-2 flex flex-col items-center justify-center mb-2">
        <div className="relative text-center">
          <div className="absolute -top-2 -right-6 text-pink-400 text-2xl animate-pulse">
            ✦
          </div>

          {/* Bỏ leading-none ở cha để tránh ép dòng quá chặt */}
          <h1 className="font-serif font-extrabold text-center tracking-tighter">
            
            {/* SỬA 1: Tăng mb-1.5 lên mb-4 để giãn cách xa ra */}
            <span className="block text-sm text-gray-500 font-sans mb-1 tracking-widest uppercase font-bold leading-2">
              {subTitle}
            </span>

            {/* SỬA 2: Thêm 'leading-tight' và 'pb-2' để chữ không bị cắt ngọn/cắt chân do hiệu ứng màu */}
            <span className="block text-2xl md:text-3xl text-transparent bg-clip-text bg-linear-to-r from-fuchsia-600 via-pink-500 to-purple-600 drop-shadow-sm leading-normal py-2">
              {pageTitle}
            </span>
          </h1>
        </div>  

        <div className="flex items-center gap-3 mt-2 opacity-60">
          <div className="w-16 h-px bg-linear-to-r from-transparent to-fuchsia-500"></div>
          <div className="w-1.5 h-1.5 rotate-45 bg-fuchsia-500"></div>
          <div className="w-16 h-px bg-linear-to-l from-transparent to-fuchsia-500"></div>
        </div>
      </div>

      {/* PHÂN TRANG TRÊN */}
      <div className="mb-8">{renderPagination()}</div>
      <div id="product-grid-start"></div>

      {/* GRID SẢN PHẨM */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl">
          <p className="text-xl">Chưa có sản phẩm nào trong danh mục này.</p>
          <Link
            href="/"
            className="text-fuchsia-600 hover:underline mt-4 inline-block font-bold"
          >
            Quay về trang chủ
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {currentProducts.map((product) => {
              const displayPrice =
                product.variants?.[0]?.price ?? product.basePrice ?? 0;
              
              return (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-fuchsia-50 hover:shadow-xl hover:border-fuchsia-200 hover:-translate-y-1 transition duration-300 group h-full flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 mb-4 rounded-xl overflow-hidden relative">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Badge Official Mall nếu có enterpriseId */}
                    {product.enterpriseId && (
                       <span className="absolute top-2 left-2 bg-fuchsia-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md z-10">
                         Official Mall
                       </span>
                    )}
                  </div>
                  
                  {/* Tên Hãng (Nhỏ) */}
                  <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">
                    {product.enterprise?.companyName || product.specifications?.['Thương hiệu'] || ''}
                  </div>

                  <h3 className="font-bold text-gray-900 truncate text-lg mb-1 group-hover:text-fuchsia-700 transition">
                    {product.name}
                  </h3>
                  
                  <p className="text-fuchsia-600 font-bold text-lg mb-2 mt-auto">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(displayPrice)}
                  </p>

                  <Link
                    href={`/shop/products/${product.id}`}
                    className="mt-3 block text-center bg-fuchsia-50 text-fuchsia-700 py-2.5 rounded-lg hover:bg-fuchsia-600 hover:text-white font-bold transition duration-300"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              );
            })}
          </div>

          {/* PHÂN TRANG DƯỚI */}
          <div className="pb-12">{renderPagination()}</div>
        </>
      )}
    </div>
  );
}