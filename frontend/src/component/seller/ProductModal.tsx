'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

// Cấu hình URL Backend (Đảm bảo không có dấu / ở cuối)
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

  // --- HÀM XỬ LÝ URL ẢNH (ROBUST) ---
  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    // 1. Nếu là link tuyệt đối (cloudinary, firebase...) hoặc blob (preview)
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    
    // 2. Xử lý path tương đối từ backend
    // Loại bỏ dấu / ở đầu path nếu có để nối cho chuẩn
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // Kết quả: http://localhost:3000/uploads/image.jpg
    return `${API_BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    if (initialData) {
      // Ưu tiên lấy giá/kho từ variant đầu tiên nếu data gốc không có
      const price = initialData.basePrice ?? initialData.variants?.[0]?.price ?? '';
      const stock = initialData.stock ?? initialData.variants?.[0]?.stock ?? '';

      setFormData({
        name: initialData.name || '',
        basePrice: price,
        stock: stock,
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
      });

      // Xử lý ảnh cũ
      const oldImage = initialData.imageUrl || initialData.images?.[0];
      setPreview(getImageUrl(oldImage));
      
      setFile(null);
    } else {
      // Reset form khi tạo mới
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

  // Class chung cho input để đồng bộ giao diện
  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200 shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-900 uppercase tracking-wide mb-2";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {initialData ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* UPLOAD ẢNH */}
          <div className="flex justify-center">
            <label className="relative w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-fuchsia-50 hover:border-fuchsia-400 transition overflow-hidden group bg-gray-50">
              {preview ? (
                <div className="relative w-full h-full p-2">
                    <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-full h-full object-contain rounded-xl" 
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300?text=No+Image')}
                    />
                    {/* Overlay khi hover vào ảnh đã có */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl m-2">
                        <p className="text-white font-bold flex items-center gap-2"><Upload size={20}/> Thay đổi ảnh</p>
                    </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 group-hover:text-fuchsia-600 transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                     <ImageIcon size={32} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide">Tải ảnh sản phẩm</p>
                  <p className="text-xs font-normal opacity-70 mt-1">PNG, JPG, WEBP tối đa 5MB</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* TÊN & DANH MỤC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tên sản phẩm</label>
              <input 
                required 
                type="text" 
                placeholder="Nhập tên sản phẩm..."
                className={inputClass}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Danh mục</label>
              <div className="relative">
                <select 
                    required 
                    className={`${inputClass} appearance-none cursor-pointer`}
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                    <option value="" disabled className="text-gray-400">-- Chọn danh mục --</option>
                    {Array.isArray(categories) && categories.map((c: any) => (
                    <option key={c.id} value={c.id} className="text-gray-900 font-medium">{c.name}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* GIÁ & TỒN KHO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Giá bán (VNĐ)</label>
              <input 
                required 
                type="number" 
                min="0" 
                placeholder="0"
                className={inputClass}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
            <div>
              <label className={labelClass}>Tồn kho</label>
              <input 
                required 
                type="number" 
                min="0" 
                placeholder="0"
                className={inputClass}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
              />
            </div>
          </div>

          {/* MÔ TẢ */}
          <div>
            <label className={labelClass}>Mô tả chi tiết</label>
            <textarea 
                rows={4} 
                placeholder="Mô tả chi tiết về sản phẩm..."
                className={`${inputClass} resize-none`}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* BUTTON ACTIONS */}
          <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-fuchsia-600 text-white text-lg font-bold rounded-xl hover:bg-fuchsia-700 transition shadow-lg shadow-fuchsia-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
                {isLoading ? <Loader2 className="animate-spin"/> : (initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm mới')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}