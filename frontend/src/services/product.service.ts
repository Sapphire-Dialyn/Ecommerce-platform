import axios from 'axios';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productService = {
  getCategories: async () => {
    const res = await api.get('/products/categories');
    return res.data;
  },

  getAllProducts: async () => {
    const res = await api.get('/products');
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  // --- HELPER: Tạo FormData dùng chung ---
  _createFormData: (productData: any, file?: File | null) => {
    const formData = new FormData();
    
    formData.append('name', productData.name || '');
    formData.append('description', productData.description || '');
    
    if (productData.categoryId && productData.categoryId !== 'undefined') {
      formData.append('categoryId', productData.categoryId);
    }

    const price = (productData.basePrice !== undefined && productData.basePrice !== null && productData.basePrice !== '') 
      ? String(productData.basePrice) : '0';
    const stock = (productData.stock !== undefined && productData.stock !== null && productData.stock !== '') 
      ? String(productData.stock) : '0';

    formData.append('basePrice', price);
    formData.append('stock', stock);

    if (file) {
      formData.append('file', file);
    }
    return formData;
  },

  // 4. Tạo sản phẩm (ĐÃ SỬA: Tự động thêm [Tên Shop])
  createProduct: async (productData: any, file?: File) => {
    // 1. Lấy thông tin user hiện tại từ LocalStorage
    const userStr = localStorage.getItem('currentUser');
    let prefix = '';

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        
        // 2. Kiểm tra Role để lấy tên Shop phù hợp
        if (user.role === 'SELLER' && user.seller?.storeName) {
          prefix = `[${user.seller.storeName}]`;
        } else if (user.role === 'ENTERPRISE' && user.enterprise?.companyName) {
          prefix = `[${user.enterprise.companyName}]`;
        }
      } catch (e) {
        console.error("Lỗi parse user từ localStorage", e);
      }
    }

    // 3. Gán tên mới: [Tên Shop] + Tên sản phẩm gốc
    // Ví dụ: "[Bánh Vẽ Khổng Lồ] Kem Dưỡng..."
    const finalName = prefix ? `${prefix} ${productData.name}` : productData.name;
    
    // Tạo object mới với tên đã sửa
    const dataWithPrefix = { ...productData, name: finalName };

    // 4. Gọi helper tạo form data
    const formData = productService._createFormData(dataWithPrefix, file);
    
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 5. Cập nhật sản phẩm (Giữ nguyên, KHÔNG thêm prefix khi update để tránh bị trùng lặp)
  updateProduct: async (id: string, productData: any, file?: File | null) => {
    const formData = productService._createFormData(productData, file);
    const res = await api.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  getProductsByEnterprise: async (enterpriseId: string) => {
    const res = await api.get(`/products/enterprise/${enterpriseId}`);
    return res.data;
  },
};