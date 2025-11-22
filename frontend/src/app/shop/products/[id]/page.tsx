'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { useAppDispatch } from '@/hook/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { Star, Heart, Truck, ShieldCheck, Minus, Plus, Check } from 'lucide-react';
import toast from 'react-hot-toast';
export default function ProductDetailPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  // Lấy dữ liệu từ DB
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        const data = await productService.getById(params.id as string);
        setProduct(data);
        
        // Mặc định chọn biến thể đầu tiên để hiển thị giá
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Lấy giá từ variant đang chọn, nếu không có variant thì lấy giá mặc định (nếu DB cấu trúc khác)
    const finalPrice = selectedVariant ? selectedVariant.price : 0;
    const variantName = selectedVariant ? (selectedVariant.size || selectedVariant.color) : '';

    dispatch(addToCart({
      id: `${product.id}-${selectedVariant?.id || 'def'}`, // ID duy nhất cho cart item
      productId: product.id,
      name: product.name,
      price: finalPrice,
      image: product.images?.[0] || '',
      quantity: quantity,
      variant: variantName
    }));

    // Thông báo nhỏ (có thể thay bằng Toast)
    toast.success('Đã thêm vào giỏ hàng thành công!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-fuchsia-600">Đang tải dữ liệu...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Sản phẩm không tồn tại</div>;

  return (
    <div className="min-h-screen bg-white pb-20 pt-10">
      <div className="container mx-auto px-6">
        {/* Breadcrumb nhỏ */}
        <div className="text-sm text-gray-400 mb-8">
           Trang chủ / Cửa hàng / <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
          <div className="space-y-6">
            <div className="aspect-3/4 bg-linear-to-b from-fuchsia-50 to-white rounded-[30px] overflow-hidden border border-fuchsia-100 relative group shadow-sm">
               <img 
                 src={product.images?.[0] || 'https://via.placeholder.com/500'} 
                 alt={product.name} 
                 className="w-full h-full object-cover group-hover:scale-110 transition duration-700 mix-blend-multiply"
               />
               <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase">
                  Chính hãng
               </div>
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img: string, idx: number) => (
                        <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:border-fuchsia-500 transition">
                            <img src={img} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* --- CỘT PHẢI: THÔNG TIN --- */}
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-4">
                {product.enterprise && (
                    <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {product.enterprise.companyName}
                    </span>
                )}
                <div className="flex items-center text-yellow-400 text-sm">
                    <Star size={16} fill="currentColor" /> 
                    <span className="text-gray-500 ml-1">4.9 (Đánh giá)</span>
                </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif font-medium text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* GIÁ TIỀN (Thay đổi theo Variant) */}
            <div className="flex items-end gap-4 mb-8">
                <span className="text-3xl font-bold text-fuchsia-600 font-serif">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || 0)}
                </span>
                {/* Giả lập giá cũ nếu muốn */}
                {/* <span className="text-lg text-gray-400 line-through decoration-gray-400 mb-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((selectedVariant?.price || 0) * 1.2)}
                </span> */}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 font-light text-lg">
               {product.description || "Mô tả đang được cập nhật..."}
            </p>

            {/* CHỌN BIẾN THỂ (Variant Selector) */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-8 p-5 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100">
                    <span className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                        Tùy chọn ({product.variants.length})
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {product.variants.map((v: any) => {
                            const isActive = selectedVariant?.id === v.id;
                            return (
                                <button 
                                    key={v.id}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`px-4 py-2 rounded-lg border transition flex items-center gap-2 ${
                                        isActive
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-fuchsia-400'
                                    }`}
                                >
                                    <span>{v.size || v.color}</span>
                                    {isActive && <Check size={14} />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ACTIONS: Số lượng & Thêm giỏ */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
                <div className="flex items-center justify-between border border-gray-300 rounded-full px-4 py-3 w-full sm:w-40">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-fuchsia-600 transition"><Minus size={18} /></button>
                    <span className="font-bold text-gray-900 text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-fuchsia-600 transition"><Plus size={18} /></button>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-fuchsia-600 text-white font-bold text-lg py-4 rounded-full hover:bg-fuchsia-700 transition shadow-xl shadow-fuchsia-200 transform active:scale-95"
                >
                    Thêm vào giỏ hàng
                </button>
                {/* <button className="p-4 border border-gray-200 rounded-full hover:border-fuchsia-400 hover:text-fuchsia-600 transition">
                    <Heart size={24} />
                </button> */}
            </div>

            {/* TABS: Mô tả & Thông số */}
            <div className="border-t border-gray-100 pt-8">
                <div className="flex gap-8 mb-6 border-b border-gray-100">
                    <button 
                        onClick={() => setActiveTab('desc')}
                        className={`pb-4 font-serif text-lg transition ${activeTab === 'desc' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Thông tin sản phẩm
                    </button>
                    <button 
                        onClick={() => setActiveTab('specs')}
                        className={`pb-4 font-serif text-lg transition ${activeTab === 'specs' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Thông số kỹ thuật
                    </button>
                </div>

                <div className="text-gray-600 leading-relaxed animate-fadeIn">
                    {activeTab === 'desc' ? (
                        <div>
                            {product.description}
                        </div>
                    ) : (
                        <div className="bg-fuchsia-50/50 rounded-xl p-6">
                            {product.specifications ? (
                                <table className="w-full text-sm text-left">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([key, value]: any, idx) => (
                                            <tr key={idx} className="border-b border-fuchsia-100 last:border-0">
                                                <td className="py-3 font-bold text-gray-800 w-1/3">{key}</td>
                                                <td className="py-3 text-gray-600">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Chưa có thông số kỹ thuật.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Cam kết */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <ShieldCheck className="text-fuchsia-600" /> 100% Chính hãng
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Truck className="text-fuchsia-600" /> Giao hàng toàn quốc
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}