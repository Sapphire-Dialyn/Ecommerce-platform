import api from '@/ultis/api';

export const userService = {
  getMe: async () => {
    const res = await api.get('/users/me'); 
    return res.data;
  },

  updateProfile: async (data: any, avatarFile?: File | null, logoFile?: File | null) => {
    const formData = new FormData();

    formData.append('name', data.name || '');
    formData.append('phone', data.phone || '');
    
    if (data.storeName) formData.append('storeName', data.storeName);
    if (data.companyName) formData.append('companyName', data.companyName);
    if (data.taxCode) formData.append('taxCode', data.taxCode);

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    if (logoFile) {
      formData.append('logo', logoFile); 
    }

    const res = await api.patch('/users/profile', formData);
    
    return res.data;
  },

  // THÊM MỚI: Gọi API thêm địa chỉ
  addAddress: async (addressData: {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    isDefault?: boolean;
    label?: string;
  }) => {
    const res = await api.post('/users/profile/addresses', addressData);
    return res.data;
  }
};