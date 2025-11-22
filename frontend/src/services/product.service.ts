import axios from 'axios';

const API_URL = 'http://localhost:3000';
const api = axios.create({ baseURL: API_URL });

// Interceptor để gắn Token vào header (Bắt buộc với Seller/Enterprise)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productService = {
  // 1. Lấy danh mục (Để hiển thị trong dropdown khi thêm SP)
  getCategories: async () => {
    const res = await api.get('/products/categories');
    return res.data;
  },

  // 2. Lấy tất cả sản phẩm (Public) - Sau đó ta sẽ lọc theo Seller ID ở Frontend
  getAllProducts: async () => {
    const res = await api.get('/products');
    return res.data;
  },

  // 3. Lấy sản phẩm theo ID (Public)
  getById: async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  // 4. Tạo sản phẩm mới (Dùng FormData để upload ảnh)
  createProduct: async (productData: any, file?: File) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('basePrice', productData.basePrice);
    formData.append('stock', productData.stock);
    formData.append('categoryId', productData.categoryId);
    
    // Nếu có file ảnh thì append vào
    if (file) {
      formData.append('file', file); // Key 'file' phải khớp với backend NestJS FileInterceptor
    }

    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 5. Cập nhật sản phẩm
  updateProduct: async (id: string, productData: any) => {
    // Nếu muốn update ảnh, cần dùng FormData tương tự createProduct
    const res = await api.patch(`/products/${id}`, productData);
    return res.data;
  },

  // 6. Xóa sản phẩm
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
  getProductsByEnterprise: async (enterpriseId: string) => {
    const res = await api.get(`/products/enterprise/${enterpriseId}`);
    return res.data;
  },
};
