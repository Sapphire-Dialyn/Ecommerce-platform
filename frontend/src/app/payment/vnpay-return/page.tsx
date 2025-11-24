'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { paymentService } from '@/services/payment.service';
// 1. Import thêm orderService để gọi API cập nhật đơn hàng
import { orderService } from '@/services/order.service';

// Component con để dùng useSearchParams (Tránh lỗi build Next.js)
function PaymentResultContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderInfo, setOrderInfo] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      try {
        // Chuyển searchParams thành object
        const params: any = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        // Lấy thông tin mã giao dịch để hiển thị
        const txnRef = params['vnp_TxnRef'];
        setOrderInfo(txnRef || '');

        // Gọi backend xác thực (verify chữ ký bảo mật)
        await paymentService.verifyVNPay(params);

        // Nếu backend không báo lỗi, kiểm tra mã phản hồi của VNPAY
        if (params['vnp_ResponseCode'] === '00') {
            
          // ============================================================
          // 2. BƯỚC QUAN TRỌNG CHO LOCALHOST:
          // Chủ động gọi API báo Server cập nhật đơn hàng thành PAID
          // vì IPN của VNPAY không thể gọi vào localhost của bạn được.
          // ============================================================
          if (txnRef) {
            try {
                await orderService.updatePaymentStatus({
                    orderId: txnRef,
                    status: 'PAID', // Hoặc trạng thái enum tương ứng trong DB của bạn
                    paymentMethod: 'VNPAY'
                });
                console.log("Đã cập nhật trạng thái đơn hàng thành công");
            } catch (updateError) {
                console.error("Lỗi cập nhật trạng thái đơn hàng:", updateError);
                // Vẫn cho hiện success vì tiền đã trừ, nhưng log lỗi để debug
            }
          }

          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error("Verify Error:", error);
        setStatus('failed');
      }
    };

    if (searchParams.toString()) {
      verify();
    }
  }, [searchParams]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
      
      {status === 'loading' && (
        <div className="py-10">
          <Loader2 className="w-16 h-16 text-fuchsia-600 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800">Đang xác thực giao dịch...</h2>
          <p className="text-gray-500 mt-2 text-sm">Vui lòng không tắt trình duyệt.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">Đơn hàng của bạn đã được xác nhận.</p>
          
          {orderInfo && (
             <div className="bg-gray-50 p-3 rounded-lg mb-6 text-sm text-gray-500 font-mono">
                Mã giao dịch: {orderInfo}
             </div>
          )}

          <div className="space-y-3">
            <Link href="/profile/orders" className="block w-full py-3 bg-fuchsia-600 text-white rounded-xl font-bold hover:bg-fuchsia-700 transition shadow-lg shadow-fuchsia-200">
              Xem đơn hàng của tôi
            </Link>
            <Link href="/" className="block w-full py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition">
              Về trang chủ
            </Link>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="py-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Thanh toán thất bại</h2>
          <p className="text-gray-600 mb-6">Giao dịch bị hủy hoặc có lỗi xảy ra từ ngân hàng.</p>
          
          <div className="flex gap-3">
             <Link href="/cart" className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
               <ArrowLeft size={18}/> Giỏ hàng
             </Link>
             <Link href="/" className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
               Trang chủ
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Page chính bọc Suspense
export default function PaymentReturnPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-fuchsia-50/30 p-4">
      <Suspense fallback={<div className="text-fuchsia-600 font-bold">Đang tải...</div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}