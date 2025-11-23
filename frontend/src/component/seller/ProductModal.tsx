'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

// Cấu hình URL Backend
const API_BASE_URL = 'http://localhost:3000';

export default function ProductModal({ isOpen, onClose, onSubmit, categories, initialData }: any) {
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    stock: '',
    description: '',
    categoryId: ''
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- HÀM XỬ LÝ URL ẢNH (Đã nâng cấp) ---
  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    // 1. Nếu là link tuyệt đối hoặc blob (preview local) thì giữ nguyên
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    
    // 2. Xử lý nối chuỗi an toàn: Đảm bảo luôn có đúng 1 dấu '/' ở giữa
    const cleanBase = API_BASE_URL.replace(/\/+$/, ''); // Bỏ dấu / ở cuối domain nếu lỡ tay thêm
    const cleanPath = path.startsWith('/') ? path : `/${path}`; // Thêm dấu / vào đầu path nếu thiếu
    
    return `${cleanBase}${cleanPath}`;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        basePrice: initialData.variants?.[0]?.price ?? initialData.basePrice ?? '',
        stock: initialData.variants?.[0]?.stock ?? initialData.stock ?? '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
      });

      // Xử lý ảnh cũ
      const oldImage = initialData.imageUrl || initialData.images?.[0];
      setPreview(getImageUrl(oldImage));
      
      setFile(null);
    } else {
      // Reset form
      setFormData({ name: '', basePrice: '', stock: '', description: '', categoryId: '' });
      setPreview(null);
      setFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        basePrice: Number(formData.basePrice),
        stock: Number(formData.stock),
      };
      await onSubmit(submitData, file); 
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* UPLOAD ẢNH */}
          <div className="flex justify-center">
            <label className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-fuchsia-400 transition overflow-hidden group">
              {preview ? (
                <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                    // Fallback nếu ảnh lỗi thật sự (404)
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=Image+Error')}
                />
              ) : (
                <div className="text-center text-gray-400 group-hover:text-fuchsia-500">
                  <Upload size={40} className="mx-auto mb-2"/>
                  <p className="text-sm font-medium">Nhấn để tải ảnh sản phẩm</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* TÊN & DANH MỤC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm</label>
              <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
              <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">-- Chọn danh mục --</option>
                {Array.isArray(categories) && categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GIÁ & TỒN KHO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Giá bán (VNĐ)</label>
              <input required type="number" min="0" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tồn kho</label>
              <input required type="number" min="0" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
          </div>

          {/* MÔ TẢ */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* BUTTON */}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-fuchsia-600 text-white font-bold rounded-xl hover:bg-fuchsia-700 transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70">
            {isLoading ? <Loader2 className="animate-spin"/> : (initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm')}
          </button>

        </form>
      </div>
    </div>
  );
}