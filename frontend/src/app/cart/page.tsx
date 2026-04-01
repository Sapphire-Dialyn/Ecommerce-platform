'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { clearCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { userService } from '@/services/user.service';
import { logisticsService } from '@/services/logistics.service';
import { LogisticsPartnerOption } from '@/types/logistics';

interface CheckoutAddress {
  id: string;
  label?: string | null;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  isDefault: boolean;
}

const formatAddress = (address: CheckoutAddress) =>
  [address.street, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(', ');

const generateInvoiceHTML = (
  orderId: string,
  cartItems: any[],
  totalAmount: number,
  shippingFee: number,
  logisticsPartnerName: string,
) => {
  const today = new Date().toLocaleDateString('vi-VN');
  const itemsHtml = cartItems
    .map(
      (item, index) => `
      <tr class="border-b border-gray-200">
        <td class="py-3 text-sm">${index + 1}</td>
        <td class="py-3 text-sm font-medium text-gray-900">${item.name} ${
          item.variant
            ? `<span class="text-xs text-gray-500">(${item.variant})</span>`
            : ''
        }</td>
        <td class="py-3 text-sm text-center">${item.quantity}</td>
        <td class="py-3 text-sm text-right">${item.price.toLocaleString('vi-VN')} đ</td>
        <td class="py-3 text-sm text-right font-medium">${(
          item.price * item.quantity
        ).toLocaleString('vi-VN')} đ</td>
      </tr>
    `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Hoa don #${orderId.slice(-8).toUpperCase()}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-stone-50 p-8 font-sans">
      <div class="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-stone-200">
        <div class="flex justify-between items-start border-b border-stone-200 pb-8 mb-8">
          <div>
            <h1 class="text-3xl font-serif font-bold text-stone-900">beauty&skincare</h1>
            <p class="text-stone-500 mt-1 text-sm">Hoa don mua hang</p>
          </div>
          <div class="text-right">
            <h2 class="text-2xl font-bold text-stone-800">HOA DON</h2>
            <p class="text-stone-500 mt-1">Ma don: <span class="font-bold text-stone-800">#${orderId
              .slice(-8)
              .toUpperCase()}</span></p>
            <p class="text-stone-500">Ngay lap: ${today}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-8 text-sm text-stone-600">
          <div class="rounded-2xl bg-stone-50 p-4">
            <div class="font-bold text-stone-900 mb-1">Don vi van chuyen</div>
            <div>${logisticsPartnerName}</div>
          </div>
          <div class="rounded-2xl bg-stone-50 p-4">
            <div class="font-bold text-stone-900 mb-1">Phuong thuc thanh toan</div>
            <div>VNPAY</div>
          </div>
        </div>
        <table class="w-full text-left mb-8">
          <thead>
            <tr class="border-b-2 border-emerald-600 text-stone-800">
              <th class="py-3 text-sm font-bold w-12">STT</th>
              <th class="py-3 text-sm font-bold">San pham</th>
              <th class="py-3 text-sm font-bold text-center w-20">SL</th>
              <th class="py-3 text-sm font-bold text-right w-32">Don gia</th>
              <th class="py-3 text-sm font-bold text-right w-32">Thanh tien</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div class="flex justify-end">
          <div class="w-72 space-y-3">
            <div class="flex justify-between text-stone-600">
              <span>Tam tinh:</span>
              <span>${(totalAmount - shippingFee).toLocaleString('vi-VN')} đ</span>
            </div>
            <div class="flex justify-between text-stone-600">
              <span>Phi van chuyen:</span>
              <span>${shippingFee.toLocaleString('vi-VN')} đ</span>
            </div>
            <div class="flex justify-between text-xl font-bold text-stone-900 border-t border-stone-200 pt-3">
              <span>Tong cong:</span>
              <span class="text-emerald-700">${totalAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
      </div>
    </body>
    </html>
  `;
};

const openInvoiceTab = (
  orderId: string,
  cartItems: any[],
  totalAmount: number,
  shippingFee: number,
  logisticsPartnerName: string,
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Vui long cho phep popup de in hoa don.');
    return;
  }

  const htmlContent = generateInvoiceHTML(
    orderId,
    cartItems,
    totalAmount,
    shippingFee,
    logisticsPartnerName,
  );
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckoutMetaLoading, setIsCheckoutMetaLoading] = useState(false);
  const [addresses, setAddresses] = useState<CheckoutAddress[]>([]);
  const [partners, setPartners] = useState<LogisticsPartnerOption[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const selectedPartner = partners.find((partner) => partner.id === selectedPartnerId) || null;
  const shippingFee = selectedPartner?.baseRate ?? 0;
  const total = subtotal + shippingFee;

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchCheckoutMeta = async () => {
      try {
        setIsCheckoutMetaLoading(true);
        const [profile, logisticsPartners] = await Promise.all([
          userService.getMe(),
          logisticsService.getPartners(),
        ]);

        const profileAddresses = (profile.addresses || []) as CheckoutAddress[];
        setAddresses(profileAddresses);
        setPartners(logisticsPartners);

        const defaultAddress =
          profileAddresses.find((address) => address.isDefault) || profileAddresses[0];
        const defaultPartner = logisticsPartners[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }

        if (defaultPartner) {
          setSelectedPartnerId(defaultPartner.id);
        }
      } catch (error) {
        console.error('Checkout meta error:', error);
        toast.error('Khong the tai du lieu thanh toan');
      } finally {
        setIsCheckoutMetaLoading(false);
      }
    };

    fetchCheckoutMeta();
  }, [user]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Vui long dang nhap de thanh toan');
      router.push('/login');
      return;
    }

    if (!cartItems.length) {
      toast.error('Gio hang dang trong');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Vui long chon dia chi giao hang');
      return;
    }

    if (!selectedPartnerId) {
      toast.error('Vui long chon don vi van chuyen');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems.map((item) => {
          let productId = item.id;
          let variantId: string | null = null;

          if (item.id.includes('-')) {
            const parts = item.id.split('-');
            if (parts.length === 2) {
              [productId, variantId] = parts;
            }
          }

          return {
            productId,
            variantId,
            quantity: item.quantity,
          };
        }),
        shippingFee,
        paymentMethod: 'VNPAY',
        addressId: selectedAddressId,
        logisticsPartnerId: selectedPartnerId,
        voucherIds: [],
      };

      const newOrder = await orderService.createOrder(orderData);

      if (!newOrder?.id) {
        throw new Error('Khong the khoi tao don hang');
      }

      const paymentResponse = await paymentService.createPayment(newOrder.id, 'VNPAY');

      if (!paymentResponse.paymentUrl) {
        throw new Error('Khong nhan duoc lien ket thanh toan');
      }

      openInvoiceTab(
        newOrder.id,
        cartItems,
        total,
        shippingFee,
        selectedPartner?.name || 'Don vi van chuyen',
      );

      dispatch(clearCart());
      window.location.href = paymentResponse.paymentUrl;
    } catch (error: any) {
      console.error('Checkout Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Co loi xay ra khi thanh toan');
    } finally {
      if (document.hidden) {
        setIsProcessing(false);
      } else {
        setTimeout(() => setIsProcessing(false), 1200);
      }
    }
  };

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) || null;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-32 h-32 bg-emerald-50 flex items-center justify-center mb-6 rounded-full">
          <ShoppingBag size={64} className="text-emerald-700" />
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 mb-2 uppercase tracking-tight">
          Gio hang trong
        </h2>
        <p className="text-stone-500 font-medium mb-8">
          Chua co san pham nao trong gio hang cua ban.
        </p>
        <Link
          href="/shop/products"
          className="px-10 py-4 bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition shadow-lg rounded-xl"
        >
          Di mua sam ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-emerald-700" />
          THANH TOAN
          <span className="text-xl text-stone-500 font-medium">
            ({cartItems.length} san pham)
          </span>
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-8">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant}`}
                className="bg-white p-5 shadow-sm border border-stone-200 flex flex-col sm:flex-row items-center gap-6 rounded-3xl"
              >
                <div className="w-full sm:w-28 h-28 bg-stone-50 overflow-hidden shrink-0 border border-stone-100 rounded-2xl">
                  <img
                    src={item.image || 'https://via.placeholder.com/100'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="font-bold text-stone-900 text-lg truncate line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-sm text-stone-500 mt-1 h-6">
                    {item.variant && (
                      <span className="bg-stone-100 text-stone-700 px-2 py-0.5 text-xs uppercase font-bold rounded-full">
                        {item.variant}
                      </span>
                    )}
                  </div>
                  <p className="text-emerald-700 font-extrabold text-lg mt-2">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.price)}
                  </p>
                </div>

                <div className="flex items-center border border-stone-300 h-10 bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                    }
                    className="w-10 h-full flex items-center justify-center hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-900 select-none">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                    }
                    className="w-10 h-full flex items-center justify-center hover:bg-stone-100 text-stone-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 transition rounded-full"
                  title="Xoa khoi gio"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-emerald-700" size={20} />
                  <h2 className="text-lg font-extrabold text-stone-900">Dia chi giao hang</h2>
                </div>

                {isCheckoutMetaLoading ? (
                  <div className="flex items-center gap-2 text-stone-500">
                    <Loader2 className="animate-spin" size={18} />
                    Dang tai dia chi...
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-2xl bg-amber-50 text-amber-800 p-4 text-sm">
                    Ban chua co dia chi nao. Hay them dia chi trong tai khoan truoc khi thanh
                    toan.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => {
                      const active = selectedAddressId === address.id;
                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`w-full text-left rounded-2xl border p-4 transition ${
                            active
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-stone-900">
                                {address.fullName}
                                {address.label ? ` • ${address.label}` : ''}
                              </div>
                              <div className="text-sm text-stone-600 mt-1">{address.phone}</div>
                              <div className="text-sm text-stone-500 mt-2">
                                {formatAddress(address)}
                              </div>
                            </div>
                            {active && <CheckCircle2 className="text-emerald-700" size={18} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="text-emerald-700" size={20} />
                  <h2 className="text-lg font-extrabold text-stone-900">Don vi van chuyen</h2>
                </div>

                {isCheckoutMetaLoading ? (
                  <div className="flex items-center gap-2 text-stone-500">
                    <Loader2 className="animate-spin" size={18} />
                    Dang tai doi tac van chuyen...
                  </div>
                ) : partners.length === 0 ? (
                  <div className="rounded-2xl bg-amber-50 text-amber-800 p-4 text-sm">
                    Hien chua co don vi van chuyen da duyet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {partners.map((partner) => {
                      const active = selectedPartnerId === partner.id;
                      return (
                        <button
                          key={partner.id}
                          type="button"
                          onClick={() => setSelectedPartnerId(partner.id)}
                          className={`w-full text-left rounded-2xl border p-4 transition ${
                            active
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-bold text-stone-900">{partner.name}</div>
                              <div className="text-sm text-stone-500 mt-1">
                                Phi giao hang: {partner.baseRate.toLocaleString('vi-VN')}đ
                              </div>
                              <div className="text-sm text-stone-500 mt-1">
                                Danh gia: {(partner.rating || 0).toFixed(1)}
                              </div>
                            </div>
                            {active && <CheckCircle2 className="text-emerald-700" size={18} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                href="/shop/products"
                className="flex items-center text-stone-600 hover:text-emerald-700 font-bold transition group"
              >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Tiep tuc mua sam
              </Link>
              <button
                onClick={() => {
                  if (confirm('Ban co chac muon xoa toan bo gio hang?')) {
                    dispatch(clearCart());
                  }
                }}
                className="text-red-500 text-sm hover:text-red-700 font-bold underline underline-offset-4"
              >
                Xoa sach gio hang
              </button>
            </div>
          </div>

          <aside className="bg-white p-8 shadow-lg border border-stone-200 sticky top-24 rounded-3xl h-fit">
            <h3 className="text-xl font-extrabold text-stone-900 mb-6 uppercase tracking-wide border-b border-stone-100 pb-4">
              Tong quan don hang
            </h3>

            <div className="space-y-4 mb-8 text-sm">
              <div className="flex justify-between text-stone-600 font-medium">
                <span>Tam tinh</span>
                <span className="text-stone-900 font-bold">
                  {subtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="flex justify-between text-stone-600 font-medium">
                <span>Van chuyen</span>
                <span className="text-stone-900 font-bold">
                  {selectedPartner
                    ? `${shippingFee.toLocaleString('vi-VN')}đ`
                    : 'Chua chon'}
                </span>
              </div>
              <div className="flex justify-between text-stone-600 font-medium">
                <span>Doi tac</span>
                <span className="text-right text-stone-900 font-bold">
                  {selectedPartner?.name || 'Chua chon'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 mb-8 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Package size={18} className="text-emerald-700" />
                Giao toi
              </div>
              {selectedAddress ? (
                <>
                  <div className="text-sm font-semibold text-stone-900">
                    {selectedAddress.fullName} • {selectedAddress.phone}
                  </div>
                  <div className="text-sm text-stone-600">
                    {formatAddress(selectedAddress)}
                  </div>
                </>
              ) : (
                <div className="text-sm text-stone-500">Chua chon dia chi giao hang</div>
              )}
            </div>

            <div className="border-t-2 border-dashed border-stone-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-stone-900 text-lg">Tong thanh toan</span>
                <span className="text-3xl font-extrabold text-emerald-700 leading-none">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(total)}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-2 text-right font-medium">
                Backend se tinh lai phi ship theo doi tac da chon
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={
                isProcessing ||
                isCheckoutMetaLoading ||
                !selectedAddressId ||
                !selectedPartnerId
              }
              className="w-full group bg-emerald-700 text-white font-bold py-4 rounded-2xl hover:bg-emerald-800 transition-all duration-300 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  <span>Dang chuyen huong...</span>
                </>
              ) : (
                <>
                  <span>Thanh toan voi VNPAY</span>
                  <CreditCard size={22} />
                </>
              )}
            </button>

            {(!selectedAddressId || !selectedPartnerId) && !isCheckoutMetaLoading && (
              <p className="text-xs text-amber-700 mt-4 text-center">
                Ban can chon dia chi giao hang va don vi van chuyen truoc khi thanh toan.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
