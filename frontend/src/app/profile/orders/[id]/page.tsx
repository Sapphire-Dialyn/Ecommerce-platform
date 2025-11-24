'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types/order';
import { 
  ArrowLeft, MapPin, CreditCard, Receipt, 
  Package, Truck, CheckCircle2, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string; 
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-600"></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="text-gray-400 p-4 bg-white rounded-full shadow-sm">
            <Package size={48} />
        </div>
        <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng.</p>
        
        {/* 👇👇👇 SỬA NÚT BACK Ở ĐÂY 👇👇👇 */}
        <Link href="/profile/orders" className="text-fuchsia-600 font-bold hover:underline">
            Quay lại danh sách
        </Link>
    </div>
  );

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const formatDateTime = (dateStr: string) => 
    new Date(dateStr).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });

  const steps: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
  const currentStepIndex = order.status === 'CANCELLED' ? -1 : steps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-6">
            {/* 👇👇👇 SỬA NÚT BACK (MŨI TÊN) Ở ĐÂY 👇👇👇 */}
            <Link href="/profile/orders" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition text-gray-600">
                <ArrowLeft size={20} />
            </Link>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                <p className="text-sm text-gray-500">Mã đơn: {order.id.slice(-8).toUpperCase()}</p>
            </div>
        </div>

        {/* CÁC PHẦN CÒN LẠI (Status Tracker, Info, Items...) GIỮ NGUYÊN CODE CŨ */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
            {isCancelled ? (
                 <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                    <AlertCircle size={24} />
                    <div>
                        <h3 className="font-bold">Đơn hàng đã bị hủy</h3>
                        <p className="text-sm opacity-80">Vào lúc: {formatDateTime(order.updatedAt)}</p>
                    </div>
                 </div>
            ) : (
                <div className="flex justify-between items-center relative py-4">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 z-0 rounded-full"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-fuchsia-600 z-0 transition-all duration-500 rounded-full"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                    {steps.map((step, index) => {
                        const isActive = index <= currentStepIndex;
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${isActive ? 'border-fuchsia-600 text-fuchsia-600' : 'border-gray-200 text-gray-300'}`}>
                                    {index === 0 && <Receipt size={14} />}
                                    {index === 1 && <Package size={14} />}
                                    {index === 2 && <Truck size={14} />}
                                    {index === 3 && <CheckCircle2 size={14} />}
                                </div>
                                <span className={`text-xs font-bold hidden sm:block ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step === 'PENDING' && 'Chờ xác nhận'}
                                    {step === 'PROCESSING' && 'Đang chuẩn bị'}
                                    {step === 'SHIPPING' && 'Đang giao'}
                                    {step === 'DELIVERED' && 'Hoàn thành'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                    <MapPin className="text-fuchsia-600" size={18} /> Địa chỉ nhận hàng
                </h3>
                <div className="text-sm text-gray-600 space-y-1.5 pl-1">
                    <p className="font-bold text-gray-900 text-base">{order.user?.name || 'Khách hàng'}</p>
                    <p className="text-gray-500">{order.user?.phone || '(Chưa có số điện thoại)'}</p>
                    <p className="text-gray-500">{order.user?.email}</p>
                    <div className="h-px bg-gray-100 my-2 w-1/2"></div>
                    <p className="opacity-80 italic">Giao tới địa chỉ mặc định</p> 
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                    <CreditCard className="text-fuchsia-600" size={18} /> Thanh toán
                </h3>
                <div className="space-y-3 text-sm pl-1">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Phương thức</span>
                        <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{order.payment?.method || 'COD'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Trạng thái</span>
                        <span className={`font-bold px-2 py-1 rounded ${order.payment?.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            {order.payment?.status === 'SUCCESS' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-gray-900 text-sm uppercase">Sản phẩm đã đặt ({order.orderItems.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
                {order.orderItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-6 hover:bg-gray-50/50 transition">
                        <div className="w-20 h-20 border border-gray-100 rounded-lg overflow-hidden shrink-0 bg-white">
                            <img src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} alt={item.product?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{item.product?.name}</h4>
                            <div className="text-xs text-gray-500 mb-2">
                                {item.variant ? `Size: ${item.variant.size} • Màu: ${item.variant.color}` : 'Phân loại mặc định'}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">x{item.quantity}</span>
                                <span className="text-sm font-bold text-fuchsia-600">{formatCurrency(item.price)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky bottom-0 z-10">
            <div className="space-y-3 pb-4 border-b border-gray-100 text-sm max-w-sm ml-auto">
                <div className="flex justify-between text-gray-500"><span>Tổng tiền hàng</span><span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Phí vận chuyển</span><span>{formatCurrency(order.shippingFee)}</span></div>
                {order.totalDiscount > 0 && (<div className="flex justify-between text-green-600 font-medium"><span>Giảm giá</span><span>-{formatCurrency(order.totalDiscount)}</span></div>)}
            </div>
            <div className="flex justify-between items-center pt-4 max-w-sm ml-auto">
                <span className="font-bold text-gray-900 text-base">Thành tiền</span>
                <span className="text-2xl font-bold text-fuchsia-600">{formatCurrency(order.totalAmount)}</span>
            </div>
        </div>

      </div>
    </div>
  );
}