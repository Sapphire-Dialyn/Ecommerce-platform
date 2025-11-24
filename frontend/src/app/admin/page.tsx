'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Store, Building2, Truck, Package, Bike,
  CheckCircle, ShieldCheck, Ban, Eye, ShoppingBag, Search, Filter, BarChart3
} from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { toast } from 'react-hot-toast';

// 👇 1. IMPORT RECHARTS
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps 
} from 'recharts';

// --- TYPE DEFINITIONS ---
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
  seller?: { id: string; storeName: string; verified: boolean; rating: number; logoUrl?: string | null } | null;
  enterprise?: { id: string; companyName: string; taxCode: string; verified: boolean } | null;
  logistics?: { id: string; name: string; baseRate: number; verified: boolean } | null;
  shipper?: { id: string; status: string; rating: number; logisticsPartnerId: string } | null;
};

type OrderData = {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  totalAmount: number;
  createdAt: string;
  user?: { name: string; email: string }; 
  payment?: { method: string; status: string };
  _count?: { orderItems: number }; 
};

// 👇 2. TYPE CHO CHART
type SalesData = {
  date: string;
  totalOrders: number;
  totalRevenue: number;
};

const TableHeader = ({ cols }: { cols: string[] }) => (
  <thead>
    <tr className="bg-gray-100/80 border-b border-gray-200 text-gray-700 text-xs uppercase tracking-wide font-extrabold">
      {cols.map((col, idx) => (
        <th key={idx} className={`py-4 px-6 ${idx === cols.length - 1 ? 'text-right' : idx > 1 ? 'text-center' : 'text-left'}`}>{col}</th>
      ))}
    </tr>
  </thead>
);

export default function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'SELLER' | 'ENTERPRISE' | 'LOGISTICS' | 'SHIPPER' | 'ORDERS'>('CUSTOMER');
  
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [allOrders, setAllOrders] = useState<OrderData[]>([]);
  
  // 👇 3. STATE CHART
  const [chartData, setChartData] = useState<SalesData[]>([]);
  
  const [displayData, setDisplayData] = useState<UserData[]>([]);
  const [displayOrders, setDisplayOrders] = useState<OrderData[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- HELPER: XỬ LÝ DỮ LIỆU CHART TỪ ĐƠN HÀNG ---
  const processOrdersToChart = (orders: OrderData[]) => {
    // Tạo mảng 7 ngày gần nhất
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), // VD: 24/11
            fullDate: d.toDateString() // Để so sánh chính xác
        };
    });

    return last7Days.map(({ dateStr, fullDate }) => {
        // Lọc các đơn hàng trong ngày đó (Bỏ qua đơn HỦY nếu muốn tính doanh thu thực)
        const ordersInDay = orders.filter(o => {
            const orderDate = new Date(o.createdAt).toDateString();
            return orderDate === fullDate && o.status !== 'CANCELLED';
        });

        return {
            date: dateStr,
            totalOrders: ordersInDay.length,
            totalRevenue: ordersInDay.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
        };
    });
  };

  // --- FETCH DATA ---
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllOrders()
      ]);
      setAllUsers(usersData);
      
      const orders = Array.isArray(ordersData) ? ordersData : [];
      setAllOrders(orders);

      // 👇 TÍNH TOÁN DATA CHO BIỂU ĐỒ
      const chartStats = processOrdersToChart(orders);
      setChartData(chartStats);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      toast.error("Lỗi tải dữ liệu hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, []);

  // --- FILTER DATA ---
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    if (activeTab === 'ORDERS') {
      const filtered = allOrders.filter(order => 
        order.id.toLowerCase().includes(term) || 
        (order.user?.name || '').toLowerCase().includes(term)
      );
      setDisplayOrders(filtered);
    } else {
      let filtered = allUsers.filter(user => user.role === activeTab);
      if (term) {
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(term) || 
          user.email.toLowerCase().includes(term)
        );
      }
      setDisplayData(filtered);
    }
  }, [activeTab, allUsers, allOrders, searchTerm]);

  // --- ACTIONS (Giữ nguyên) ---
  const handleVerify = async (id: string, type: 'sellers' | 'enterprise' | 'logistics') => {
    if(confirm("Xác nhận duyệt hồ sơ đối tác này?")) {
      try { 
        await adminService.verifyAccount(id, type, true); 
        fetchAllData(); 
        toast.success("Đã duyệt thành công!"); 
      } catch { toast.error("Lỗi khi duyệt"); }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try { 
      await adminService.toggleUserStatus(id, !currentStatus); 
      fetchAllData(); 
      toast.success(currentStatus ? "Đã khóa tài khoản" : "Đã mở khóa");
    } catch { toast.error("Lỗi cập nhật trạng thái"); }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    if(!confirm(`Cập nhật trạng thái đơn hàng sang ${newStatus}?`)) return;
    try {
      await adminService.updateOrderStatus(id, newStatus);
      fetchAllData();
      toast.success("Cập nhật đơn hàng thành công");
    } catch {
      toast.error("Lỗi cập nhật đơn hàng");
    }
  };

  // --- RENDER HELPER FUNCTIONS ---

  // 👇 CUSTOM TOOLTIP CHART
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl z-50">
          <p className="font-bold text-gray-900 mb-1">Ngày {label}</p>
          <p className="text-fuchsia-600 text-sm font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payload[0].value)}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Đơn hàng: {payload[0].payload.totalOrders}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderOrderTable = () => {
    const getStatusColor = (status: string) => {
      switch(status) {
        case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'SHIPPING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
        case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <table className="w-full border-collapse">
        <TableHeader cols={['Mã đơn / Ngày', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Cập nhật']} />
        <tbody className="text-sm divide-y divide-gray-100">
          {displayOrders.map(order => (
            <tr key={order.id} className="hover:bg-fuchsia-50/30 transition-colors group">
              <td className="py-5 px-6">
                <div className="font-mono font-extrabold text-gray-900 text-sm bg-gray-100 px-2 py-1 rounded w-fit mb-1 group-hover:bg-white transition">
                  {order.id.toUpperCase().slice(0, 8)}...
                </div>
                <div className="text-gray-500 text-xs font-medium">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
              </td>
              <td className="py-5 px-6">
                <div className="font-bold text-gray-900 text-base">{order.user?.name || 'Unknown'}</div>
                <div className="text-xs text-gray-500 font-medium">{order.user?.email}</div>
              </td>
              <td className="py-5 px-6 text-center">
                <div className="font-extrabold text-fuchsia-700 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                </div>
                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-wide bg-gray-100 inline-block px-2 rounded mt-1">
                  {order.payment?.method || 'COD'}
                </div>
              </td>
              <td className="py-5 px-6 text-center">
                <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="py-5 px-6 text-right">
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="text-xs font-bold border border-gray-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 cursor-pointer hover:border-fuchsia-400 transition"
                  disabled={['DELIVERED', 'CANCELLED', 'RETURNED'].includes(order.status)}
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang chuẩn bị</option>
                  <option value="SHIPPING">Đang giao</option>
                  <option value="DELIVERED">Đã giao</option>
                  <option value="CANCELLED">Hủy đơn</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCustomerTable = () => (
    <table className="w-full border-collapse">
      <TableHeader cols={['Khách hàng', 'Liên hệ', 'Ngày tham gia', 'Trạng thái', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map(user => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-5 px-6 flex items-center gap-4">
              <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 shadow-sm"/>
              <span className="font-bold text-gray-900 text-base">{user.name}</span>
            </td>
            <td className="py-5 px-6">
              <div className="text-gray-900 font-medium">{user.email}</div>
              <div className="text-gray-500 text-xs font-medium mt-0.5">{user.phone || '---'}</div>
            </td>
            <td className="py-5 px-6 text-center text-gray-600 font-medium">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
            <td className="py-5 px-6 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                {user.isActive ? 'Active' : 'Banned'}
              </span>
            </td>
            <td className="py-5 px-6 text-right">
              <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Ban size={20} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSellerTable = () => (
     <table className="w-full border-collapse">
      <TableHeader cols={['Shop', 'Chủ sở hữu', 'Xác thực', 'Trạng thái', 'Quản lý']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map(user => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-5 px-6 flex items-center gap-4">
              <img src={user.seller?.logoUrl || user.avatar || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-lg object-cover border shadow-sm"/> 
              <div>
                <div className="font-extrabold text-gray-900 text-base">{user.seller?.storeName || 'Chưa đặt tên'}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">ID: {user.id.slice(0,8)}...</div>
              </div>
            </td>
            <td className="py-5 px-6">
              <div className="text-gray-900 font-bold">{user.name}</div>
              <div className="text-gray-500 text-xs font-medium">{user.email}</div>
            </td>
            <td className="py-5 px-6 text-center">
              {user.seller?.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-extrabold border border-blue-200"><ShieldCheck size={14}/> Đã duyệt</span>
              ) : (
                <button onClick={() => handleVerify(user.seller?.id!, 'sellers')} className="inline-flex items-center gap-1 px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md">Duyệt ngay</button>
              )}
            </td>
            <td className="py-5 px-6 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{user.isActive ? 'Active' : 'Banned'}</span>
            </td>
            <td className="py-5 px-6 text-right">
              <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={20} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderEnterpriseTable = () => (
      <table className="w-full border-collapse">
      <TableHeader cols={['Doanh nghiệp', 'Mã số thuế', 'Giấy tờ', 'Trạng thái', 'Quản lý']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map(user => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-5 px-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-sm"><Building2 size={24}/></div>
              <div>
                <div className="font-extrabold text-gray-900 text-base">{user.enterprise?.companyName || user.name}</div>
                <div className="text-xs text-gray-500 font-medium">{user.email}</div>
              </div>
            </td>
            <td className="py-5 px-6 font-mono text-gray-700 font-bold">{user.enterprise?.taxCode || 'N/A'}</td>
            <td className="py-5 px-6 text-center">
              {user.enterprise?.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-xs font-extrabold border border-purple-200"><CheckCircle size={14}/> Verified</span>
              ) : (
                <button onClick={() => handleVerify(user.enterprise?.id!, 'enterprise')} className="inline-flex items-center gap-1 px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md">Duyệt hồ sơ</button>
              )}
            </td>
            <td className="py-5 px-6 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{user.isActive ? 'Hoạt động' : 'Đình chỉ'}</span>
            </td>
            <td className="py-5 px-6 text-right">
              <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={20} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  const renderLogisticsTable = () => (
      <table className="w-full border-collapse">
      <TableHeader cols={['Đơn vị vận chuyển', 'Email', 'Cước phí', 'Xác thực', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map(user => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-5 px-6 flex items-center gap-4">
              <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-11 h-11 rounded-lg object-contain border bg-white p-1"/>
              <div className="font-extrabold text-gray-900 text-base">{user.logistics?.name || user.name}</div>
            </td>
            <td className="py-5 px-6 text-gray-700 font-medium">{user.email}</td>
            <td className="py-5 px-6 text-center font-extrabold text-gray-900 text-base">{user.logistics?.baseRate ? `${user.logistics.baseRate.toLocaleString()}đ` : '---'}</td>
            <td className="py-5 px-6 text-center">
              {user.logistics?.verified ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-800 rounded-full text-xs font-extrabold border border-orange-200"><ShieldCheck size={14}/> Đối tác</span>
              ) : (
                <button onClick={() => handleVerify(user.logistics?.id!, 'logistics')} className="px-4 py-1.5 bg-fuchsia-600 text-white rounded-full text-xs font-bold hover:bg-fuchsia-700 shadow-md">Duyệt</button>
              )}
            </td>
            <td className="py-5 px-6 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${user.isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                {user.isActive ? 'Active' : 'Banned'}
              </span>
            </td>
            <td className="py-5 px-6 text-right">
              <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={20} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderShipperTable = () => (
      <table className="w-full border-collapse">
      <TableHeader cols={['Tài xế', 'SĐT', 'Trạng thái', 'Đánh giá', 'Hành động']} />
      <tbody className="text-sm divide-y divide-gray-100">
        {displayData.map(user => (
          <tr key={user.id} className="hover:bg-fuchsia-50/40 transition-colors duration-200">
            <td className="py-5 px-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                <img src={user.avatar || 'https://via.placeholder.com/40'} className="w-full h-full object-cover"/>
              </div>
              <div>
                <div className="font-extrabold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500 font-medium">{user.email}</div>
              </div>
            </td>
            <td className="py-5 px-6 font-mono text-gray-700 font-bold">{user.phone || 'N/A'}</td>
            <td className="py-5 px-6 text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${user.shipper?.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {user.shipper?.status || 'OFFLINE'}
              </span>
            </td>
            <td className="py-5 px-6 text-center text-yellow-500 font-black text-lg">{user.shipper?.rating ? `★ ${user.shipper.rating.toFixed(1)}` : '---'}</td>
            <td className="py-5 px-6 text-right">
              <button onClick={() => handleToggleStatus(user.id, user.isActive)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban size={20} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white h-16 px-6 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="text-xl font-serif font-bold text-gray-900">Beauty<span className="text-fuchsia-600">Admin</span></div>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded tracking-wider">Platform</span>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto">
        
        {/* 👇 HIỂN THỊ BIỂU ĐỒ KHI Ở TAB ORDERS */}
        {activeTab === 'ORDERS' && (
            <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Card Thống kê */}
                <div className="lg:col-span-1 bg-linear-to-br from-fuchsia-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-fuchsia-100 font-medium mb-1 flex items-center gap-2"><ShoppingBag size={18}/> Tổng đơn hàng (7 ngày)</h3>
                        <div className="text-4xl font-extrabold">
                            {chartData.reduce((a, b) => a + b.totalOrders, 0)}
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-fuchsia-100 font-medium mb-1">Doanh thu ước tính</h3>
                        <div className="text-2xl font-bold opacity-90">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(chartData.reduce((a, b) => a + b.totalRevenue, 0))}
                        </div>
                    </div>
                </div>

                {/* Biểu đồ Cột */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="text-fuchsia-600" size={20}/> 
                            Biểu đồ doanh thu 7 ngày qua
                        </h3>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#6b7280', fontSize: 12}} 
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#fdf4ff'}} />
                                <Bar 
                                    dataKey="totalRevenue" 
                                    fill="#c026d3" 
                                    radius={[6, 6, 0, 0]} 
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
          
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-gray-50/50 border-b border-gray-200 overflow-x-auto">
            {[
              { id: 'CUSTOMER', label: 'Khách hàng', icon: Users },
              { id: 'SELLER', label: 'Nhà bán hàng', icon: Store },
              { id: 'ENTERPRISE', label: 'Doanh nghiệp', icon: Building2 },
              { id: 'LOGISTICS', label: 'Vận chuyển', icon: Truck },
              { id: 'SHIPPER', label: 'Tài xế', icon: Bike },
              { id: 'ORDERS', label: 'Đơn hàng', icon: ShoppingBag },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-extrabold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-white text-fuchsia-600 shadow-sm ring-1 ring-gray-200' 
                    : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
              <input 
                type="text" 
                placeholder={activeTab === 'ORDERS' ? "Tìm mã đơn hàng, tên khách..." : "Tìm tên, email người dùng..."}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 rounded-xl text-sm font-medium transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mb-3"></div>
                <p className="text-sm font-medium">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                {activeTab === 'ORDERS' && renderOrderTable()}
                {activeTab === 'CUSTOMER' && renderCustomerTable()}
                {activeTab === 'SELLER' && renderSellerTable()}
                {activeTab === 'ENTERPRISE' && renderEnterpriseTable()}
                {activeTab === 'LOGISTICS' && renderLogisticsTable()}
                {activeTab === 'SHIPPER' && renderShipperTable()}
                
                {((activeTab === 'ORDERS' && displayOrders.length === 0) || (activeTab !== 'ORDERS' && displayData.length === 0)) && (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-gray-50/30">
                    <Package size={48} className="mb-3 opacity-20"/>
                    <p className="text-sm font-medium">Không tìm thấy dữ liệu phù hợp</p>
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