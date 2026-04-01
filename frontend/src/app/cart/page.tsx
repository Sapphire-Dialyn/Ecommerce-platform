'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { 
  Trash2, Minus, Plus, ArrowLeft, ShieldCheck, 
  Loader2, ShoppingBag, CreditCard 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import Services
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';

// ============================================================================
// HÀM TIỆN ÍCH TẠO VÀ MỞ HÓA ĐƠN PDF
// ============================================================================
const generateInvoiceHTML = (orderId: string, cartItems: any[], totalAmount: number, shippingFee: number) => {
  const today = new Date().toLocaleDateString('vi-VN');
  
  // Render danh sách sản phẩm thành các dòng HTML
  const itemsHtml = cartItems.map((item, index) => `
    <tr class="border-b border-gray-200">
      <td class="py-3 text-sm">${index + 1}</td>
      <td class="py-3 text-sm font-medium text-gray-900">${item.name} ${item.variant ? `<span class="text-xs text-gray-500">(${item.variant})</span>` : ''}</td>
      <td class="py-3 text-sm text-center">${item.quantity}</td>
      <td class="py-3 text-sm text-right">${item.price.toLocaleString('vi-VN')} đ</td>
      <td class="py-3 text-sm text-right font-medium">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hóa đơn #${orderId.slice(-8).toUpperCase()}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 15mm; }
          }
        </style>
    </head>
    <body class="bg-gray-50 p-8 font-sans">
        <div class="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-sm border border-gray-200">
            <div class="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                <div>
                    <h1 class="text-3xl font-serif font-bold text-fuchsia-700">beauty&skincare</h1>
                    <p class="text-gray-500 mt-1 text-sm">Vẻ đẹp từ sự thuần khiết</p>
                </div>
                <div class="text-right">
                    <h2 class="text-2xl font-bold text-gray-800">HÓA ĐƠN MUA HÀNG</h2>
                    <p class="text-gray-500 mt-1">Mã đơn: <span class="font-bold text-gray-800">#${orderId.slice(-8).toUpperCase()}</span></p>
                    <p class="text-gray-500">Ngày lập: ${today}</p>
                </div>
            </div>

            <table class="w-full text-left mb-8">
                <thead>
                    <tr class="border-b-2 border-fuchsia-600 text-gray-800">
                        <th class="py-3 text-sm font-bold w-12">STT</th>
                        <th class="py-3 text-sm font-bold">Tên sản phẩm</th>
                        <th class="py-3 text-sm font-bold text-center w-20">SL</th>
                        <th class="py-3 text-sm font-bold text-right w-32">Đơn giá</th>
                        <th class="py-3 text-sm font-bold text-right w-32">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="flex justify-end">
                <div class="w-72 space-y-3">
                    <div class="flex justify-between text-gray-600">
                        <span>Tạm tính:</span>
                        <span>${(totalAmount - shippingFee).toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="flex justify-between text-gray-600">
                        <span>Phí vận chuyển:</span>
                        <span>${shippingFee.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-3">
                        <span>Tổng cộng:</span>
                        <span class="text-fuchsia-600">${totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </div>
            
            <div class="mt-16 text-center text-sm text-gray-500 italic">
                Cảm ơn bạn đã mua sắm tại Beauty & Skincare!
            </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
    </body>
    </html>
  `;
};

const openInvoiceTab = (orderId: string, cartItems: any[], totalAmount: number, shippingFee: number) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error("Vui lòng cho phép mở Popup trên trình duyệt để in hóa đơn.");
    return;
  }
  const htmlContent = generateInvoiceHTML(orderId, cartItems, totalAmount, shippingFee);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
// ============================================================================


export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user } = useAppSelector((state) => state.auth); 
  
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  // --- TÍNH TOÁN TIỀN ---
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 30000; 
  const total = subtotal + shipping;

  // --- HÀM XỬ LÝ THANH TOÁN ---
  const handleCheckout = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán");
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
        toast.error("Giỏ hàng đang trống");
        return;
    }
    
    setIsProcessing(true);

    try {
      // BƯỚC A: Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        items: cartItems.map(item => {
            let productId = item.id;
            let variantId = null;

            if (item.id.includes('-')) {
                const parts = item.id.split('-');
                if (parts.length === 2) {
                    productId = parts[0]; 
                    variantId = parts[1]; 
                }
            }

            return {
                productId: productId,
                variantId: variantId, 
                quantity: item.quantity
            };
        }),
        shippingFee: shipping,
        paymentMethod: 'VNPAY',
        addressId: 'default', 
        voucherIds: [] 
      };

      // BƯỚC B: Gọi API tạo Order
      const newOrder = await orderService.createOrder(orderData); 
      
      if (!newOrder || !newOrder.id) {
        throw new Error("Không thể khởi tạo đơn hàng");
      }

      // BƯỚC C: Gọi API lấy link thanh toán VNPAY
      const paymentResponse = await paymentService.createPayment(newOrder.id, 'VNPAY');
      
      // BƯỚC D: Xử lý hiển thị Hóa Đơn & Chuyển hướng
      if (paymentResponse.paymentUrl) {
        // Mở tab in hóa đơn TRƯỚC khi chuyển hướng trang hiện tại
        openInvoiceTab(newOrder.id, cartItems, total, shipping);

        dispatch(clearCart()); 
        // Chuyển hướng sang VNPay
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error("Lỗi: Không nhận được liên kết thanh toán");
      }

    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán");
    } finally {
      if (document.hidden) { 
          setIsProcessing(false); 
      } else {
          setTimeout(() => setIsProcessing(false), 2000);
      }
    }
  };

  // --- GIAO DIỆN GIỎ HÀNG TRỐNG ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-32 h-32 bg-fuchsia-50 flex items-center justify-center mb-6 animate-bounce rounded-full"> 
             <ShoppingBag size={64} className="text-fuchsia-600"/>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 uppercase tracking-tight">Giỏ hàng trống</h2>
        <p className="text-gray-500 font-medium mb-8">Có vẻ bạn chưa chọn món đồ làm đẹp nào cả.</p>
        <Link href="/shop/products" className="px-10 py-4 bg-fuchsia-600 text-white font-bold hover:bg-fuchsia-700 transition shadow-lg rounded-xl transform hover:-translate-y-1"> 
          Đi mua sắm ngay
        </Link>
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="min-h-screen bg-fuchsia-50/30 py-12 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            <ShoppingBag className="text-fuchsia-600" /> 
            GIỎ HÀNG <span className="text-xl text-gray-500 font-medium">({cartItems.length} sản phẩm)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- CỘT TRÁI: LIST SẢN PHẨM --- */}
            <div className="lg:w-2/3 space-y-6">
                {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant}`} className="bg-white p-5 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-6 transition hover:shadow-md rounded-2xl">
                        {/* Ảnh */}
                        <div className="w-full sm:w-28 h-28 bg-gray-50 overflow-hidden shrink-0 border border-gray-100 rounded-xl">
                            <img 
                                src={item.image || 'https://via.placeholder.com/100'} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        
                        {/* Thông tin */}
                        <div className="flex-1 text-center sm:text-left w-full">
                            <h3 className="font-bold text-gray-900 text-lg truncate line-clamp-1">{item.name}</h3>
                            
                            {/* Phân loại (nếu có) */}
                            <div className="text-sm text-gray-500 mt-1 h-6">
                                {item.variant && (
                                    <span className="bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 text-xs uppercase font-bold rounded">
                                        {item.variant}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-fuchsia-600 font-extrabold text-lg mt-2">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </p>
                        </div>

                        {/* Tăng giảm số lượng */}
                        <div className="flex items-center border border-gray-300 h-10 bg-white rounded-lg overflow-hidden">
                             <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition"
                             ><Minus size={16}/></button>
                             <span className="w-10 text-center text-sm font-bold text-gray-900 select-none">{item.quantity}</span>
                             <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                className="w-10 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 transition"
                             ><Plus size={16}/></button>
                        </div>

                        {/* Xóa */}
                        <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 transition rounded-full"
                            title="Xóa khỏi giỏ"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <Link href="/shop/products" className="flex items-center text-gray-600 hover:text-fuchsia-600 font-bold transition group">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                        Tiếp tục xem sản phẩm
                    </Link>
                    <button 
                        onClick={() => {
                            if(confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) dispatch(clearCart());
                        }}
                        className="text-red-500 text-sm hover:text-red-700 font-bold underline decoration-dashed underline-offset-4"
                    >
                        Xóa sạch giỏ hàng
                    </button>
                </div>
            </div>

            {/* --- CỘT PHẢI: TỔNG TIỀN (Order Summary) --- */}
            <div className="lg:w-1/3">
                <div className="bg-white p-8 shadow-lg border border-gray-100 sticky top-24 rounded-3xl">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 uppercase tracking-wide border-b border-gray-100 pb-4">
                        Tổng quan đơn hàng
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-600 font-medium">
                            <span>Tạm tính</span>
                            <span className="text-gray-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-medium">
                            <span>Phí vận chuyển</span>
                            <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-gray-900 font-bold'}>
                                {shipping === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping)}
                            </span>
                        </div>
                        
                        {/* Progress bar freeship */}
                        {shipping > 0 ? (
                            <div className="text-xs text-gray-500 mt-2">
                                Mua thêm <span className="font-bold text-fuchsia-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(500000 - subtotal)}</span> để được Freeship
                                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
                                    <div className="h-1.5 bg-fuchsia-500 rounded-full" style={{ width: `${(subtotal / 500000) * 100}%` }}></div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-xs font-bold text-green-700 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                                <ShieldCheck size={16}/> Đơn hàng được Freeship
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-gray-900 text-lg">Tổng thanh toán</span>
                            <span className="text-3xl font-extrabold text-fuchsia-600 leading-none">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right font-medium">Đã bao gồm VAT</p>
                    </div>

                    {/* Nút thanh toán VNPAY */}
                    <button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full group bg-fuchsia-600 text-white font-bold py-4 rounded-xl hover:bg-fuchsia-700 transition-all duration-300 shadow-lg shadow-fuchsia-200 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden relative"
                    > 
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                <span>Đang chuyển hướng...</span>
                            </>
                        ) : (
                            <>
                                <span>Thanh toán với VNPAY</span>
                                <CreditCard size={24} className="group-hover:rotate-12 transition-transform"/>
                            </>
                        )}
                        
                        {/* Shine effect */}
                        {!isProcessing && (
                            <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-25 group-hover:animate-shine" />
                        )}
                    </button>
                    
                    <div className="mt-4 text-center flex flex-col items-center gap-2">
                        <img src="https://sandbox.vnpayment.vn/paymentv2/images/icons/logo-vnpay.svg" alt="VNPAY" className="h-6 opacity-70 grayscale hover:grayscale-0 transition"/>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Cổng thanh toán an toàn
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}