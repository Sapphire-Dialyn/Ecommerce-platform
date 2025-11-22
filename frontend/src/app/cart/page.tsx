'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { Trash2, Minus, Plus, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 30000; // Freeship đơn > 500k
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-32 h-32 bg-fuchsia-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
             <div className="text-6xl">🛍️</div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Giỏ hàng trống trơn</h2>
        <p className="text-gray-500 mb-8">Có vẻ bạn chưa chọn món đồ làm đẹp nào cả.</p>
        <Link href="/shop/products" className="px-10 py-4 bg-fuchsia-600 text-white font-bold rounded-full hover:bg-fuchsia-700 transition shadow-lg">
          Đi mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fuchsia-50/20 py-12 font-sans">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">Giỏ hàng ({cartItems.length})</h1>

        <div className="flex flex-col lg:flex-row gap-10">
            
            {/* --- CỘT TRÁI: LIST SẢN PHẨM --- */}
            <div className="lg:w-2/3 space-y-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition hover:shadow-md">
                        {/* Ảnh */}
                        <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Thông tin */}
                        <div className="flex-1 text-center sm:text-left w-full">
                            <h3 className="font-bold text-gray-900 text-lg truncate">{item.name}</h3>
                            <div className="text-sm text-gray-500 mt-1">
                                {item.variant ? <span className="bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded text-xs uppercase font-bold">{item.variant}</span> : null}
                            </div>
                            <p className="text-fuchsia-600 font-bold text-lg mt-2 font-serif">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </p>
                        </div>

                        {/* Tăng giảm số lượng */}
                        <div className="flex items-center border border-gray-200 rounded-full h-10 bg-gray-50">
                             <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                className="w-10 h-full flex items-center justify-center hover:text-fuchsia-600 transition"
                             ><Minus size={16}/></button>
                             <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                             <button 
                                onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                className="w-10 h-full flex items-center justify-center hover:text-fuchsia-600 transition"
                             ><Plus size={16}/></button>
                        </div>

                        {/* Xóa */}
                        <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                            title="Xóa khỏi giỏ"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-6">
                    <Link href="/shop/products" className="flex items-center text-gray-500 hover:text-fuchsia-600 font-medium transition">
                        <ArrowLeft size={18} className="mr-2" /> Tiếp tục xem sản phẩm
                    </Link>
                    <button 
                        onClick={() => dispatch(clearCart())}
                        className="text-red-500 text-sm hover:underline font-medium"
                    >
                        Xóa sạch giỏ hàng
                    </button>
                </div>
            </div>

            {/* --- CỘT PHẢI: TỔNG TIỀN (Order Summary) --- */}
            <div className="lg:w-1/3">
                <div className="bg-white p-8 rounded-4xl shadow-lg border border-fuchsia-100 sticky top-24">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Tổng quan đơn hàng</h3>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-600">
                            <span>Tạm tính</span>
                            <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển</span>
                            <span className="font-medium">{shipping === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping)}</span>
                        </div>
                        {shipping === 0 && (
                            <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg flex items-center gap-2">
                                <ShieldCheck size={12}/> Đơn hàng {'>'} 500k được Freeship
                            </div>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-gray-900 text-lg">Tổng thanh toán</span>
                            <span className="text-3xl font-bold text-fuchsia-600 font-serif">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-right">Đã bao gồm VAT</p>
                    </div>

                    <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-full hover:bg-fuchsia-600 transition duration-300 shadow-lg transform hover:-translate-y-1">
                        Thanh toán ngay
                    </button>
                    
                    <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition">
                         <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" className="h-8" alt="Visa"/>
                         <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" className="h-8" alt="Paypal"/>
                         <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" className="h-8" alt="Mastercard"/>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}