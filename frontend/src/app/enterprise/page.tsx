'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hook/useRedux';
import { productService } from '@/services/product.service';
import ProductModal from '@/component/seller/ProductModal';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SellerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load dữ liệu khi vào trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
            productService.getAllProducts(),
            productService.getCategories()
        ]);
        
        // Lọc sản phẩm chỉ của Seller hiện tại (Dựa trên quan hệ seller.userId hoặc sellerId)
        // Lưu ý: Bạn cần kiểm tra cấu trúc trả về của API getAllProducts để lọc đúng
        // Ví dụ: p.seller?.userId === user?.id HOẶC p.sellerId === user?.seller?.id
        
        // Tạm thời mình giả định API trả về tất cả, mình lọc ở Client
        const myProducts = prods.filter((p: any) => 
            // Logic lọc: Sản phẩm có sellerId trùng với id của Seller đang đăng nhập
            // Bạn cần đảm bảo user trong redux có thông tin sellerId
            p.seller?.userId === user?.id || p.enterprise?.userId === user?.id
        );

        setProducts(myProducts);
        setCategories(cats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Xử lý Thêm / Sửa
  const handleSubmitProduct = async (formData: any, file: File) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await productService.createProduct(formData, file);
        toast.success('Thêm sản phẩm mới thành công!');
      }
      
      // Refresh lại trang
      setIsModalOpen(false);
      setEditingProduct(null);
      window.location.reload(); // Reload nhanh để thấy data mới
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        toast.success('Đã xóa sản phẩm');
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  // Mở modal sửa
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Quản lý doanh nghiệp</h1>
            <p className="text-gray-500">Quản lý sản phẩm và kho hàng của bạn</p>
          </div>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-fuchsia-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-fuchsia-700 transition shadow-lg hover:-translate-y-1"
          >
            <Plus size={20} /> Thêm sản phẩm mới
          </button>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="p-10 text-center">Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
             <div className="p-16 flex flex-col items-center text-gray-400">
                <Package size={64} className="mb-4 opacity-20"/>
                <p>Bạn chưa có sản phẩm nào. Hãy thêm ngay!</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase">
                <tr>
                  <th className="p-4 font-medium">Sản phẩm</th>
                  <th className="p-4 font-medium">Giá bán</th>
                  <th className="p-4 font-medium text-center">Kho</th>
                  <th className="p-4 font-medium">Danh mục</th>
                  <th className="p-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-fuchsia-50/30 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                        <span className="font-bold text-gray-900 line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-fuchsia-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.variants?.[0]?.price || 0)}
                    </td>
                    <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            (product.variants?.[0]?.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {product.variants?.[0]?.stock || 0}
                        </span>
                    </td>
                    <td className="p-4 text-gray-500">{product.category?.name || '---'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit size={18}/></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSubmit={handleSubmitProduct}
        initialData={editingProduct}
      />
    </div>
  );
}