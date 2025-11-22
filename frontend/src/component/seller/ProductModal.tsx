'use client';
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

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

  // Nếu edit → fill data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        basePrice:
          initialData.variants?.[0]?.price ?? initialData.basePrice ?? '',
        stock:
          initialData.variants?.[0]?.stock ?? initialData.stock ?? '',
        description: initialData.description || '',
        categoryId: initialData.categoryId || '',
      });

      // Ảnh
      setPreview(initialData.imageUrl || initialData.images?.[0] || null);
      setFile(null);
    } else {
      // Reset khi tạo mới
      setFormData({
        name: '',
        basePrice: '',
        stock: '',
        description: '',
        categoryId: ''
      });
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

    // ⚠️ Chuyển đúng key cho backend
    const payload = {
      name: formData.name,
      basePrice: Number(formData.basePrice),
      stock: Number(formData.stock),
      description: formData.description,
      categoryId: formData.categoryId
    };

    await onSubmit(payload, file);
    setIsLoading(false);
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
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-gray-400 group-hover:text-fuchsia-500">
                  <Upload size={40} className="mx-auto mb-2"/>
                  <p className="text-sm font-medium">Nhấn để tải ảnh sản phẩm</p>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          </div>

          {/* TÊN – DANH MỤC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tên sản phẩm</label>
              <input required type="text" className="w-full px-4 py-2 border"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
              <select required className="w-full px-4 py-2 border"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* GIÁ – STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Giá bán (VNĐ)</label>
              <input required type="number" className="w-full px-4 py-2 border"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tồn kho</label>
              <input required type="number" className="w-full px-4 py-2 border"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea rows={4} className="w-full px-4 py-2 border"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* BUTTON */}
          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-fuchsia-600 text-white font-bold rounded-xl hover:bg-fuchsia-700 transition shadow-lg flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin"/> : (initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm')}
          </button>

        </form>
      </div>
    </div>
  );
}
