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

  // --- HELPER: Tạo FormData dùng chung cho Create/Update ---
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

  // 4. Tạo sản phẩm
  createProduct: async (productData: any, file?: File) => {
    const formData = productService._createFormData(productData, file);
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // 5. Cập nhật sản phẩm (ĐÃ SỬA SIGNATURE ĐỂ ĐỒNG BỘ)
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