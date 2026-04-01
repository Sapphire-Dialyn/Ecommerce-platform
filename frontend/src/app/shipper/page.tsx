'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/hook/useRedux';
import { logisticsService } from '@/services/logistics.service';
import { LogisticsOrderRecord, LogisticsShipper } from '@/types/logistics';
import { toast } from 'react-hot-toast';
import {
  CheckCircle2,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  RefreshCcw,
  Truck,
  UserRound,
} from 'lucide-react';

const statusLabel: Record<string, string> = {
  ASSIGNED: 'Da duoc phan cong',
  PICKED_UP: 'Da lay hang',
  IN_TRANSIT: 'Dang giao hang',
  DELIVERED: 'Da giao thanh cong',
};

export default function ShipperDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shipper, setShipper] = useState<LogisticsShipper | null>(null);
  const [orders, setOrders] = useState<LogisticsOrderRecord[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== 'DELIVERED'),
    [orders],
  );
  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === 'DELIVERED'),
    [orders],
  );

  const loadDashboard = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [profile, assignedOrders] = await Promise.all([
        logisticsService.getCurrentShipper(),
        logisticsService.getCurrentShipperOrders(),
      ]);

      setShipper(profile);
      setOrders(assignedOrders);
    } catch (error) {
      console.error('Shipper dashboard error:', error);
      toast.error('Khong the tai dashboard shipper');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleStatusUpdate = async (
    logisticsOrderId: string,
    status: 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED',
  ) => {
    setUpdatingOrderId(logisticsOrderId);
    try {
      await logisticsService.updateCurrentShipperOrderStatus(logisticsOrderId, status);
      toast.success('Da cap nhat trang thai don hang');
      await loadDashboard(false);
    } catch (error) {
      console.error('Shipper status update error:', error);
      toast.error('Khong the cap nhat trang thai don');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (user?.role !== 'SHIPPER') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center max-w-xl">
          <Truck className="mx-auto mb-4 text-emerald-700" size={42} />
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">
            Dashboard shipper
          </h1>
          <p className="text-stone-500">
            Trang nay chi danh cho tai khoan shipper.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-600">
          <Loader2 className="animate-spin text-emerald-700" />
          Dang tai dashboard shipper...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">Dashboard Shipper</h1>
            <p className="text-stone-500 mt-2">
              Theo doi cac don duoc giao cho ban va cap nhat tien trinh giao hang.
            </p>
          </div>
          <button
            onClick={() => loadDashboard(false)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold hover:border-emerald-300 hover:text-emerald-700 transition"
          >
            {refreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
            Lam moi
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Shipper</div>
            <div className="text-xl font-extrabold text-stone-900 mt-2">
              {shipper?.user?.name || user.name}
            </div>
            <div className="text-sm text-stone-500 mt-2">
              {shipper?.user?.phone || shipper?.user?.email || 'Khong co thong tin'}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Trang thai hien tai</div>
            <div className="text-3xl font-extrabold text-stone-900 mt-2">
              {shipper?.status || 'AVAILABLE'}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Don dang giao</div>
            <div className="text-3xl font-extrabold text-stone-900 mt-2">
              {activeOrders.length}
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="text-emerald-700" size={20} />
            <h2 className="text-xl font-extrabold text-stone-900">Don dang xu ly</h2>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-stone-500">
              Ban chua co don nao dang duoc giao.
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.map((order) => {
                const canPickUp = order.status === 'ASSIGNED';
                const canTransit = order.status === 'PICKED_UP';
                const canDeliver = order.status === 'IN_TRANSIT' || order.status === 'PICKED_UP';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm"
                  >
                    <div className="flex flex-col xl:flex-row gap-6">
                      <div className="xl:w-[1.1fr] space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-lg font-extrabold text-stone-900">
                            Don #{order.order.id.slice(-8).toUpperCase()}
                          </div>
                          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                            {statusLabel[order.status] || order.status}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                            {order.trackingCode}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                              <UserRound size={16} />
                              Nguoi nhan
                            </div>
                            <div className="font-bold text-stone-900">
                              {order.order.recipientName || order.order.user?.name || 'Khach hang'}
                            </div>
                            <div className="text-stone-500 mt-1 flex items-center gap-2">
                              <Phone size={14} />
                              {order.order.recipientPhone || order.order.user?.phone || 'Chua co so dien thoai'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                              <MapPin size={16} />
                              Dia chi giao hang
                            </div>
                            <div className="font-medium text-stone-900 leading-6">
                              {order.deliveryAddress}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4">
                          <div className="flex items-center gap-2 text-stone-500 mb-2">
                            <Navigation size={16} />
                            Pickup address
                          </div>
                          <div className="font-medium text-stone-900">
                            {order.pickupAddress || 'Chua co pickup address'}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4">
                          <div className="text-sm font-bold text-stone-900 mb-3">
                            San pham ({order.order.orderItems.length})
                          </div>
                          <div className="space-y-3">
                            {order.order.orderItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                <img
                                  src={item.product.images?.[0] || 'https://via.placeholder.com/56'}
                                  alt={item.product.name}
                                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200 bg-stone-50"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-stone-900 truncate">
                                    {item.product.name}
                                  </div>
                                  <div className="text-sm text-stone-500">
                                    x{item.quantity}
                                    {item.variant?.size ? ` • ${item.variant.size}` : ''}
                                    {item.variant?.color ? ` • ${item.variant.color}` : ''}
                                  </div>
                                </div>
                                <div className="font-bold text-emerald-700">
                                  {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="xl:w-[0.9fr] space-y-4">
                        <div className="rounded-2xl border border-stone-200 p-5 bg-stone-50">
                          <div className="text-sm text-stone-500 mb-2">Tien trinh giao hang</div>
                          <div className="space-y-2 text-sm text-stone-700">
                            <div className="flex items-center justify-between">
                              <span>Da duoc phan cong</span>
                              <CheckCircle2 className="text-emerald-700" size={16} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Da lay hang</span>
                              <span className={order.status !== 'ASSIGNED' ? 'text-emerald-700' : 'text-stone-400'}>
                                {order.status !== 'ASSIGNED' ? 'Xong' : 'Cho xu ly'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Dang giao</span>
                              <span
                                className={
                                  order.status === 'IN_TRANSIT' || order.status === 'DELIVERED'
                                    ? 'text-emerald-700'
                                    : 'text-stone-400'
                                }
                              >
                                {order.status === 'IN_TRANSIT' || order.status === 'DELIVERED'
                                  ? 'Xong'
                                  : 'Cho xu ly'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Da giao</span>
                              <span className={order.status === 'DELIVERED' ? 'text-emerald-700' : 'text-stone-400'}>
                                {order.status === 'DELIVERED' ? 'Hoan tat' : 'Cho xu ly'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'PICKED_UP')}
                            disabled={!canPickUp || updatingOrderId === order.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 text-sm font-bold text-stone-700 hover:border-emerald-400 hover:text-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingOrderId === order.id && canPickUp ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Package size={16} />
                            )}
                            Xac nhan da lay hang
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(order.id, 'IN_TRANSIT')}
                            disabled={!canTransit || updatingOrderId === order.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 text-sm font-bold text-stone-700 hover:border-emerald-400 hover:text-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingOrderId === order.id && canTransit ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Truck size={16} />
                            )}
                            Bat dau giao hang
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                            disabled={!canDeliver || updatingOrderId === order.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingOrderId === order.id && canDeliver ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Xac nhan giao thanh cong
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-700" size={20} />
            <h2 className="text-xl font-extrabold text-stone-900">Don da giao</h2>
          </div>

          {completedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-stone-500">
              Chua co don nao da giao thanh cong.
            </div>
          ) : (
            <div className="grid xl:grid-cols-2 gap-4">
              {completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold text-stone-900">
                        #{order.order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-stone-500">{order.trackingCode}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      Da giao
                    </span>
                  </div>
                  <div className="text-sm text-stone-600">
                    <div className="font-semibold text-stone-900">
                      {order.order.recipientName || order.order.user?.name || 'Khach hang'}
                    </div>
                    <div>{order.deliveryAddress}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
