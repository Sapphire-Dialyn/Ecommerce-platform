'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Store, Building2, Search, Truck, Package,
  CheckCircle, XCircle, Trash2, ShieldCheck, Ban, Eye, Bike
} from 'lucide-react';
import { adminService } from '@/services/admin.service';

// --- TYPE DEFINITION (Khớp với Swagger & Frontend Logic) ---
type UserData = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: 'CUSTOMER' | 'SELLER' | 'ENTERPRISE' | 'ADMIN' | 'SHIPPER' | 'LOGISTICS';
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    
    // Quan hệ (Có thể null/undefined tùy role)
    seller?: { 
        id: string; 
        storeName: string; 
        verified: boolean; 
        rating: number;
        logoUrl?: string | null; // ✅ Đã thêm trường này để fix lỗi
    } | null;
    enterprise?: { 
        id: string; 
        companyName: string; 
        taxCode: string; 
        verified: boolean;
    } | null;
    logistics?: { 
        id: string; 
        name: string; 
        baseRate: number; 
        verified: boolean;
    } | null;
    shipper?: { 
        id: string; 
        status: string; 
        rating: number; 
        logisticsPartnerId: string;
    } | null;
};

export default function AdminUserManagement() {
  // State quản lý Tabs
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'SELLER' | 'ENTERPRISE' | 'LOGISTICS' | 'SHIPPER'>('CUSTOMER');
  
  // State dữ liệu
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [displayData, setDisplayData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- 2. FILTER LOGIC ---
  useEffect(() => {
    if (!allUsers.length) {
        setDisplayData([]);
        return;
    }
    const filtered = allUsers.filter(user => user.role === activeTab);
    setDisplayData(filtered);
  }, [activeTab, allUsers]);

  // --- 3. ACTIONS ---
  const handleVerify = async (id: string, type: 'sellers' | 'enterprise' | 'logistics') => {
      if(confirm("Xác nhận duyệt hồ sơ đối tác này?")) {
          try {
            // Lưu ý: Cần đảm bảo adminService.verifyAccount chấp nhận type 'logistics'
            await adminService.verifyAccount(id, type, true);
            alert("Đã duyệt thành công!");
            fetchAllData(); 
          } catch (e) { alert("Lỗi khi duyệt"); }
      }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
        await adminService.toggleUserStatus(id, !currentStatus);
        fetchAllData(); 
    } catch (e) { alert("Lỗi cập nhật trạng thái"); }
  };

  // --- 4. TABLE RENDERERS ---
  
  // Component Header chung cho gọn
  const TableHeader = ({ cols }: { cols: string[] }) => (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
        {cols.map((col, idx) => (
          <th key={idx} className={`py-4 px-6 font-semibold ${idx === cols.length - 1 ? 'text-right' : idx > 1 ? 'text-center' : 'text-left'}`}>
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );

  // Bảng 1: CUSTOMER
  const renderCustomerTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Khách hàng', 'Liên hệ', 'Ngày tham gia', 'Trạng thái', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map((user) => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-4 px-6">
               <div className="flex items-center gap-4">
                  <img src={user.avatar || 'https://via.placeholder.com/40'} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"/>
                  <span className="font-semibold text-gray-900">{user.name}</span>
               </div>
            </td>
            <td className="py-4 px-6">
               <div className="text-gray-900">{user.email}</div>
               <div className="text-gray-500 text-xs mt-0.5">{user.phone || '---'}</div>
            </td>
            <td className="py-4 px-6 text-center text-gray-500">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
            <td className="py-4 px-6 text-center">
               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {user.isActive ? 'Active' : 'Banned'}
               </span>
            </td>
            <td className="py-4 px-6 text-right">
               <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Ban size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Bảng 2: SELLER
  const renderSellerTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Shop', 'Chủ sở hữu', 'Xác thực', 'Trạng thái', 'Quản lý']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map((user) => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-4 px-6">
               <div className="flex items-center gap-4">
                   <img src={user.seller?.logoUrl || user.avatar || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-lg object-cover border shadow-sm"/> 
                   <div>
                       <div className="font-bold text-gray-900 text-base">{user.seller?.storeName || "Chưa đặt tên"}</div>
                       <div className="text-xs text-gray-400">ID: {user.id.slice(0,8)}...</div>
                   </div>
               </div>
            </td>
            <td className="py-4 px-6">
               <div className="text-gray-900 font-medium">{user.name}</div>
               <div className="text-gray-500 text-xs">{user.email}</div>
            </td>
            <td className="py-4 px-6 text-center">
               {user.seller?.verified ? (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200"><ShieldCheck size={14}/> Đã duyệt</span>
               ) : (
                 <button onClick={() => handleVerify(user.seller?.id!, 'sellers')} className="inline-flex items-center gap-1 px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md hover:shadow-lg transition">Duyệt ngay</button>
               )}
            </td>
            <td className="py-4 px-6 text-center">
                <span className={`w-2.5 h-2.5 rounded-full inline-block mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {user.isActive ? 'Active' : 'Banned'}
            </td>
            <td className="py-4 px-6 text-right"><button className="p-2 text-gray-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg"><Eye size={18}/></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Bảng 3: ENTERPRISE
  const renderEnterpriseTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Doanh nghiệp', 'Mã số thuế', 'Giấy tờ', 'Trạng thái', 'Quản lý']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map((user) => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-4 px-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm"><Building2 size={24}/></div>
                  <div>
                     <div className="font-bold text-gray-900 text-base">{user.enterprise?.companyName || user.name}</div>
                     <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
               </div>
            </td>
            <td className="py-4 px-6 font-mono text-gray-600 font-medium">{user.enterprise?.taxCode || 'N/A'}</td>
            <td className="py-4 px-6 text-center">
               {user.enterprise?.verified ? (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200"><CheckCircle size={14}/> Verified</span>
               ) : (
                 <button onClick={() => handleVerify(user.enterprise?.id!, 'enterprise')} className="inline-flex items-center gap-1 px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md hover:shadow-lg transition">Duyệt hồ sơ</button>
               )}
            </td>
            <td className="py-4 px-6 text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{user.isActive ? 'Hoạt động' : 'Đình chỉ'}</span>
            </td>
            <td className="py-4 px-6 text-right"><button className="p-2 text-gray-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg"><Eye size={18}/></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Bảng 4: LOGISTICS
  const renderLogisticsTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Đơn vị vận chuyển', 'Email liên hệ', 'Cước phí cơ bản', 'Xác thực', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map((user) => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-4 px-6">
               <div className="flex items-center gap-4">
                  <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-10 h-10 rounded-lg object-contain border bg-white p-1"/>
                  <div className="font-bold text-gray-900">{user.logistics?.name || user.name}</div>
               </div>
            </td>
            <td className="py-4 px-6 text-gray-600">{user.email}</td>
            <td className="py-4 px-6 text-center font-bold text-gray-800 text-base">
                {user.logistics?.baseRate ? `${user.logistics.baseRate.toLocaleString()}đ` : '---'}
            </td>
            <td className="py-4 px-6 text-center">
               {user.logistics?.verified ? (
                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-200"><ShieldCheck size={14}/> Đối tác</span>
               ) : (
                 <button onClick={() => handleVerify(user.logistics?.id!, 'logistics')} className="px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md">Duyệt</button>
               )}
            </td>
            <td className="py-4 px-6 text-right">
               <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Bảng 5: SHIPPER
  const renderShipperTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Tài xế', 'Số điện thoại', 'Trạng thái', 'Đánh giá', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map((user) => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-4 px-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                      <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-full h-full object-cover"/>
                  </div>
                  <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
               </div>
            </td>
            <td className="py-4 px-6 font-mono text-gray-600">{user.phone || 'N/A'}</td>
            <td className="py-4 px-6 text-center">
               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${user.shipper?.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {user.shipper?.status || 'OFFLINE'}
               </span>
            </td>
            <td className="py-4 px-6 text-center text-yellow-500 font-bold text-base">
                {user.shipper?.rating ? `★ ${user.shipper.rating.toFixed(1)}` : '---'}
            </td>
            <td className="py-4 px-6 text-right">
               <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header (Giữ nguyên) */}
      <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-gray-200 sticky top-0 z-20 shadow-sm">
         <div className="flex items-center gap-3">
            <div className="text-2xl font-serif font-bold text-gray-900">Beauty<span className="text-fuchsia-600">Admin</span></div>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold rounded">Platform</span>
         </div>
      </header>

      {/* Content - TRÀN VIỀN w-full */}
      <main className="p-6 w-full"> 
         
         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
             
             {/* TABS NAVIGATION - Giãn cách rộng, màu active chuẩn */}
             <div className="flex items-center justify-start border-b border-gray-200 bg-gray-50/50 p-2 gap-4 overflow-x-auto sticky top-0 z-10">
                 {['CUSTOMER', 'SELLER', 'ENTERPRISE', 'LOGISTICS', 'SHIPPER'].map((tab: any) => {
                    const active = activeTab === tab;
                    // Mapping icon cho từng tab
                    const Icon = tab === 'CUSTOMER' ? Users : tab === 'SELLER' ? Store : tab === 'ENTERPRISE' ? Building2 : tab === 'LOGISTICS' ? Truck : Bike;
                    const label = tab === 'CUSTOMER' ? 'Khách hàng' : tab === 'SELLER' ? 'Nhà bán hàng' : tab === 'ENTERPRISE' ? 'Doanh nghiệp' : tab === 'LOGISTICS' ? 'Vận chuyển' : 'Tài xế';
                    
                    return (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300
                                ${active 
                                    ? 'bg-fuchsia-100 text-fuchsia-700 shadow-sm ring-1 ring-fuchsia-200 translate-y-0' 
                                    : 'text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm'}
                            `}
                        >
                            <Icon size={18} className={active ? 'text-fuchsia-600' : 'text-gray-400'}/>
                            <span className="whitespace-nowrap">{label}</span>
                        </button>
                    )
                 })}
             </div>

             {/* TAB CONTENT */}
             <div className="flex-1 overflow-x-auto">
                 {loading ? (
                     <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600 mb-4"></div>
                        <p>Đang tải dữ liệu...</p>
                     </div>
                 ) : (
                     <>
                        {activeTab === 'CUSTOMER' && renderCustomerTable()}
                        {activeTab === 'SELLER' && renderSellerTable()}
                        {activeTab === 'ENTERPRISE' && renderEnterpriseTable()}
                        {activeTab === 'LOGISTICS' && renderLogisticsTable()}
                        {activeTab === 'SHIPPER' && renderShipperTable()}
                        
                        {displayData.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-gray-50/30">
                                <Package size={60} className="mb-4 opacity-20 text-fuchsia-900"/>
                                <p className="text-lg font-medium">Chưa có dữ liệu {activeTab}</p>
                            </div>
                        )}
                     </>
                 )}
             </div>
         </div>
      </main>
    </div>
  );
}