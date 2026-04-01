'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, MapPin, CreditCard, Package, 
  Truck, CheckCircle, XCircle, Clock, Loader2, RefreshCcw
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPayLoading, setIsPayLoading] = useState(false);

  // Hàm tải dữ liệu đơn hàng
  const fetchOrder = async () => {
    try {
      setLoading(true);
      if (params?.id) {
        const data = await orderService.getOrderById(params.id as string);
        setOrder(data);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
      toast.error("Không tìm thấy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params?.id]);

  // Xử lý nút "Thanh toán ngay"
  const handleRepay = async () => {
    if (!order) return;
    setIsPayLoading(true);
    try {
      const res = await paymentService.createPayment(order.id, 'VNPAY');
      const paymentUrl = typeof res === 'string' ? res : res?.paymentUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không tạo được liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Lỗi kết nối tới cổng thanh toán.");
    } finally {
      setIsPayLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const styles: any = {
      PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', icon: <Clock size={16}/>, label: 'Chờ xác nhận' },
      PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Package size={16}/>, label: 'Đang xử lý' },
      SHIPPING: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Truck size={16}/>, label: 'Đang giao hàng' },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={16}/>, label: 'Hoàn thành' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle size={16}/>, label: 'Hoàn thành' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle size={16}/>, label: 'Đã hủy' },
    };
    
    // Nếu status lạ, fallback về mặc định
    const s = styles[status] || styles.PENDING;
    
    return (
      <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${s.bg} ${s.text}`}>
        {s.icon} {s.label}
      </span>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-fuchsia-600" size={40}/></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Đơn hàng không tồn tại</div>;

  // ============================================================
  // 🔥 FIX LOGIC CHECK TRẠNG THÁI THANH TOÁN
  // ============================================================
  
  // Kiểm tra: Chấp nhận cả 'PAID' (chuẩn logic) và 'SUCCESS' (hiện tại trong DB)
  const paymentStatus = order.payment?.status;
  const isPaid = paymentStatus === 'PAID' || paymentStatus === 'SUCCESS';

  const isPending = order.status === 'PENDING';
  const isNotCancelled = order.status !== 'CANCELLED';
  const isVNPAY = order.payment?.method === 'VNPAY';
  
  // Chỉ hiện nút thanh toán lại nếu: Đơn chờ + Chưa hủy + VNPAY + CHƯA THANH TOÁN
  const showRepayButton = isPending && isNotCancelled && isVNPAY && !isPaid;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile/orders" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-600"/>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Chi tiết đơn hàng</h1>
            <p className="text-sm text-gray-500 font-mono">Mã đơn: {order.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {/* Nút Refresh dữ liệu thủ công (đề phòng cache) */}
            <button 
                onClick={fetchOrder} 
                className="p-2 text-gray-400 hover:text-fuchsia-600 transition" 
                title="Cập nhật trạng thái mới nhất"
            >
                <RefreshCcw size={18} />
            </button>
            {renderStatusBadge(order.status)}
          </div>
        </div>

        {/* --- 1. THÔNG TIN GIAO HÀNG & THANH TOÁN --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cột Trái: Địa chỉ */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-fuchsia-600"/> Địa chỉ nhận hàng
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-gray-900">{order.user?.name || "Khách hàng"}</p>
              <p className="text-gray-500 text-sm">{order.user?.phone || "Chưa có số điện thoại"}</p>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {order.address || "Giao tới địa chỉ mặc định của khách hàng"}
              </p>
            </div>
          </div>

          {/* Cột Phải: Thanh toán */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-fuchsia-600"/> Thanh toán
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Phương thức</span>
                <span className="font-bold text-gray-900">{order.payment?.method || "COD"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Trạng thái</span>
                {/* 👇 Hiển thị đúng trạng thái dựa trên biến isPaid đã fix */}
                <span className={`font-bold text-sm ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
            </div>

            {/* --- NÚT THANH TOÁN LẠI --- */}
            {showRepayButton && (
              <div className="mt-4">
                  <button 
                    onClick={handleRepay}
                    disabled={isPayLoading}
                    className="w-full py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold shadow-lg shadow-fuchsia-200 transition flex items-center justify-center gap-2 disabled:opacity-70 transform active:scale-95"
                  >
                    {isPayLoading ? <Loader2 className="animate-spin" size={20}/> : <CreditCard size={20}/>}
                    THANH TOÁN NGAY
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-2 italic">
                    * Nếu bạn vừa thanh toán, vui lòng bấm nút làm mới ↻ ở góc trên
                  </p>
              </div>
            )}
          </div>
        </div>

        {/* --- 2. DANH SÁCH SẢN PHẨM --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Sản phẩm đã đặt ({order.orderItems?.length || 0})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {order.orderItems?.map((item: any) => (
              <div key={item.id} className="p-6 flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200 relative">
                   {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Package/></div>
                   )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{item.product?.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">
                    Phân loại: {item.variant?.size || 'Tiêu chuẩn'} {item.variant?.color ? `- ${item.variant.color}` : ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">x{item.quantity}</span>
                    <span className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- 3. TỔNG KẾT TIỀN --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Tổng tiền hàng</span>
              <span>{order.subtotal?.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee?.toLocaleString('vi-VN')}đ</span>
            </div>
            {order.totalDiscount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Giảm giá</span>
                <span className="text-green-600">-{order.totalDiscount?.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Thành tiền</span>
              <span className="font-extrabold text-fuchsia-600 text-2xl">{order.totalAmount?.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}