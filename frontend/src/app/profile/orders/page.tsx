'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/order';
import { 
  Search, Truck, Package, CheckCircle2, 
  ShoppingBag, AlertCircle, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

// ... (Giữ nguyên phần constants TABS)
const TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'PENDING', label: 'Chờ thanh toán' },
  { id: 'PROCESSING', label: 'Đang xử lý' },
  { id: 'SHIPPING', label: 'Đang giao' },
  { id: 'DELIVERED', label: 'Hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ... (Giữ nguyên phần useEffect và helper functions)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getMyOrders(activeTab as OrderStatus | 'ALL');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  const getStatusLabel = (status: OrderStatus) => {
      // ... (Giữ nguyên logic status label như cũ)
      switch (status) {
        case 'PENDING': return { text: 'Chờ thanh toán', color: 'text-orange-500', bg: 'bg-orange-50', icon: <Package size={16}/> };
        case 'PROCESSING': return { text: 'Đang chuẩn bị', color: 'text-blue-500', bg: 'bg-blue-50', icon: <Package size={16}/> };
        case 'SHIPPING': return { text: 'Đang giao', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: <Truck size={16}/> };
        case 'DELIVERED': return { text: 'Hoàn thành', color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle2 size={16}/> };
        case 'CANCELLED': return { text: 'Đã hủy', color: 'text-red-500', bg: 'bg-red-50', icon: <AlertCircle size={16}/> };
        default: return { text: status, color: 'text-gray-500', bg: 'bg-gray-50', icon: null };
      }
  };

  const displayedOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderItems.some(item => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-4">
        
        {/* ... (Giữ nguyên phần Header, Tabs, Search) */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="text-fuchsia-600" /> Đơn hàng của tôi
            </h1>
        </div>

        {/* TABS & SEARCH UI GIỮ NGUYÊN NHƯ CŨ ... */}
        {/* ... */}
        
        {/* LIST */}
        <div className="space-y-5 mt-6">
          {loading ? (
             <div className="text-center py-20">Đang tải...</div>
          ) : displayedOrders.length === 0 ? (
             <div className="text-center py-20 text-gray-500">Chưa có đơn hàng nào</div>
          ) : (
            displayedOrders.map((order) => {
              const statusMeta = getStatusLabel(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  
                  {/* 👇👇👇 SỬA LINK Ở ĐÂY: Thêm /profile vào trước 👇👇👇 */}
                  <Link href={`/profile/orders/${order.id}`} className="block">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3 bg-gray-50/30 cursor-pointer hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900 text-sm">Mã: {order.id.slice(-8).toUpperCase()}</span>
                        <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
                        <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-bold uppercase px-3 py-1 rounded-full w-fit ${statusMeta.bg} ${statusMeta.color}`}>
                        {statusMeta.icon}
                        <span>{statusMeta.text}</span>
                        </div>
                    </div>
                  </Link>

                  {/* Items (Giữ nguyên) */}
                  <div className="px-6">
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="flex gap-4 py-5 border-b border-gray-50 last:border-0">
                        <div className="w-20 h-20 border border-gray-100 rounded-xl overflow-hidden bg-gray-50 relative">
                            <img 
                            src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover" 
                            />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.product?.name}</h3>
                            <div className="text-xs text-gray-500">x{item.quantity}</div>
                            </div>
                        </div>
                        <div className="text-right py-1">
                            <div className="text-sm font-bold text-fuchsia-600">{formatCurrency(item.price)}</div>
                        </div>
                        </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">{order.orderItems.length} sản phẩm</div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="text-xs text-gray-500 block">Tổng thanh toán</span>
                                <span className="text-lg font-bold text-fuchsia-600">{formatCurrency(order.totalAmount)}</span>
                            </div>
                            {/* 👇👇👇 SỬA LINK Ở ĐÂY NỮA 👇👇👇 */}
                            <Link 
                                href={`/profile/orders/${order.id}`}
                                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm font-bold rounded-lg hover:border-fuchsia-600 hover:text-fuchsia-600 transition flex items-center gap-1"
                            >
                                Chi tiết <ChevronRight size={16}/>
                            </Link>
                        </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}