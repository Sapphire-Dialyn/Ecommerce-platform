'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  RefreshCcw,
  Truck,
  XCircle,
} from 'lucide-react';
import { Order } from '@/types/order';

const renderStatusBadge = (status: string) => {
  const styles: Record<
    string,
    { bg: string; text: string; icon: ReactNode; label: string }
  > = {
    PENDING: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      icon: <Clock size={16} />,
      label: 'Cho xac nhan',
    },
    PROCESSING: {
      bg: 'bg-sky-100',
      text: 'text-sky-700',
      icon: <Package size={16} />,
      label: 'Dang xu ly',
    },
    SHIPPING: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-700',
      icon: <Truck size={16} />,
      label: 'Dang giao hang',
    },
    DELIVERED: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      icon: <CheckCircle size={16} />,
      label: 'Da giao',
    },
    CANCELLED: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      icon: <XCircle size={16} />,
      label: 'Da huy',
    },
  };

  const current = styles[status] || styles.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${current.bg} ${current.text}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPayLoading, setIsPayLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      if (params?.id) {
        const data = await orderService.getOrderById(params.id as string);
        setOrder(data);
      }
    } catch (error) {
      console.error('Order detail error:', error);
      toast.error('Khong tim thay don hang');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [params?.id]);

  const handleRepay = async () => {
    if (!order) {
      return;
    }

    setIsPayLoading(true);
    try {
      const res = await paymentService.createPayment(order.id, 'VNPAY');
      const paymentUrl = typeof res === 'string' ? res : res?.paymentUrl;

      if (!paymentUrl) {
        toast.error('Khong tao duoc lien ket thanh toan');
        return;
      }

      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Repay error:', error);
      toast.error('Khong ket noi duoc toi cong thanh toan');
    } finally {
      setIsPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-700" size={40} />
      </div>
    );
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Don hang khong ton tai</div>;
  }

  const paymentStatus = order.payment?.status;
  const isPaid = paymentStatus === 'SUCCESS';
  const showRepayButton =
    order.status === 'PENDING' &&
    order.payment?.method === 'VNPAY' &&
    !isPaid;

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile/orders" className="p-2 bg-white rounded-full shadow-sm hover:bg-stone-100 transition">
            <ArrowLeft size={20} className="text-stone-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Chi tiet don hang</h1>
            <p className="text-sm text-stone-500 font-mono">Ma don: {order.id}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={fetchOrder}
              className="p-2 text-stone-400 hover:text-emerald-700 transition"
              title="Lam moi"
            >
              <RefreshCcw size={18} />
            </button>
            {renderStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-700" />
              Dia chi nhan hang
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-stone-900">
                {order.recipientName || order.user?.name || 'Khach hang'}
              </p>
              <p className="text-stone-500 text-sm">
                {order.recipientPhone || order.user?.phone || 'Chua co so dien thoai'}
              </p>
              <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                {order.deliveryAddress || 'Chua co dia chi giao hang'}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-700" />
                Thanh toan
              </h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-500 text-sm">Phuong thuc</span>
                <span className="font-bold text-stone-900">{order.payment?.method || 'COD'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-sm">Trang thai</span>
                <span className={`font-bold text-sm ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                  {isPaid ? 'Da thanh toan' : 'Chua thanh toan'}
                </span>
              </div>
            </div>

            {showRepayButton && (
              <div className="mt-4">
                <button
                  onClick={handleRepay}
                  disabled={isPayLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isPayLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CreditCard size={20} />
                  )}
                  Thanh toan ngay
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 mb-6">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Truck size={18} className="text-emerald-700" />
            Van chuyen
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
              <div className="text-stone-500 mb-1">Don vi van chuyen</div>
              <div className="font-bold text-stone-900">
                {order.selectedLogisticsPartner?.name ||
                  order.selectedLogisticsPartnerName ||
                  'Chua chon'}
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
              <div className="text-stone-500 mb-1">Tracking</div>
              <div className="font-bold text-stone-900">
                {order.logisticsOrder?.trackingCode || 'Chua tao van don'}
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
              <div className="text-stone-500 mb-1">Trang thai giao van</div>
              <div className="font-bold text-stone-900">
                {order.logisticsOrder?.status || 'Chua tiep nhan'}
              </div>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200">
              <div className="text-stone-500 mb-1">Shipper</div>
              <div className="font-bold text-stone-900">
                {order.logisticsOrder?.shipper?.user?.name || 'Chua phan cong'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden mb-6">
          <div className="p-6 border-b border-stone-100 bg-stone-50/80">
            <h3 className="font-bold text-stone-900">
              San pham da dat ({order.orderItems?.length || 0})
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="p-6 flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-stone-100 shrink-0 overflow-hidden border border-stone-200">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Package />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-stone-900 text-base mb-1 line-clamp-2">
                    {item.product?.name}
                  </h4>
                  <p className="text-sm text-stone-500 mb-2">
                    Phan loai: {item.variant?.size || 'Tieu chuan'}
                    {item.variant?.color ? ` - ${item.variant.color}` : ''}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-stone-100 px-2 py-1 rounded text-stone-600">
                      x{item.quantity}
                    </span>
                    <span className="font-bold text-stone-900">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Tong tien hang</span>
              <span>{order.subtotal?.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Phi van chuyen</span>
              <span>{order.shippingFee?.toLocaleString('vi-VN')}đ</span>
            </div>
            {order.totalDiscount > 0 && (
              <div className="flex justify-between text-stone-500">
                <span>Giam gia</span>
                <span className="text-green-600">-{order.totalDiscount?.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
            <div className="border-t border-stone-100 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-stone-900 text-lg">Thanh tien</span>
              <span className="font-extrabold text-emerald-700 text-2xl">
                {order.totalAmount?.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
