'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/hook/useRedux';
import { logisticsService } from '@/services/logistics.service';
import { LogisticsOrderRecord, LogisticsShipper } from '@/types/logistics';
import { toast } from 'react-hot-toast';
import {
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  Save,
  Truck,
  UserRound,
} from 'lucide-react';

type DraftState = Record<
  string,
  {
    pickupAddress: string;
    notes: string;
    shipperId: string;
  }
>;

const logisticsStatusLabel: Record<string, string> = {
  CREATED: 'Mới tiếp nhận',
  ASSIGNED: 'Đã phân công',
  PICKED_UP: 'Đã lấy hàng',
  IN_TRANSIT: 'Đang giao',
  DELIVERED: 'Đã giao',
  RETURNED: 'Hoàn trả',
  CANCELLED: 'Đã hủy',
};

export default function LogisticsDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unassignedOrders, setUnassignedOrders] = useState<LogisticsOrderRecord[]>([]);
  const [allOrders, setAllOrders] = useState<LogisticsOrderRecord[]>([]);
  const [shippers, setShippers] = useState<LogisticsShipper[]>([]);
  const [drafts, setDrafts] = useState<DraftState>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const availableShippers = useMemo(
    () => shippers.filter((shipper) => shipper.status === 'AVAILABLE'),
    [shippers],
  );

  const loadDashboard = async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [openOrders, orders, partnerShippers] = await Promise.all([
        logisticsService.getUnassignedOrders(),
        logisticsService.getMyOrders(false),
        logisticsService.getMyShippers(),
      ]);

      setUnassignedOrders(openOrders);
      setAllOrders(orders);
      setShippers(partnerShippers);
      setDrafts((current) => {
        const nextDrafts = { ...current };
        for (const order of orders) {
          nextDrafts[order.id] = {
            pickupAddress:
              current[order.id]?.pickupAddress ?? order.pickupAddress ?? '',
            notes: current[order.id]?.notes ?? order.notes ?? '',
            shipperId: current[order.id]?.shipperId ?? '',
          };
        }
        return nextDrafts;
      });
    } catch (error) {
      console.error('Logistics dashboard error:', error);
      toast.error('Không thể tải dashboard logistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateDraft = (orderId: string, patch: Partial<DraftState[string]>) => {
    setDrafts((current) => ({
      ...current,
      [orderId]: {
        pickupAddress: current[orderId]?.pickupAddress ?? '',
        notes: current[orderId]?.notes ?? '',
        shipperId: current[orderId]?.shipperId ?? '',
        ...patch,
      },
    }));
  };

  const handleSaveDraft = async (logisticsOrderId: string) => {
    const draft = drafts[logisticsOrderId];
    if (!draft) {
      return;
    }

    setSavingId(logisticsOrderId);
    try {
      await logisticsService.updateOrder(logisticsOrderId, {
        pickupAddress: draft.pickupAddress,
        notes: draft.notes,
      });
      toast.success('Đã cập nhật thông tin vận đơn thành công');
      await loadDashboard(false);
    } catch (error) {
      console.error('Save logistics order error:', error);
      toast.error('Không thể cập nhật thông tin vận đơn');
    } finally {
      setSavingId(null);
    }
  };

  const handleAssign = async (logisticsOrderId: string) => {
    const draft = drafts[logisticsOrderId];

    if (!draft?.shipperId) {
      toast.error('Vui lòng chọn shipper');
      return;
    }

    setAssigningId(logisticsOrderId);
    try {
      await logisticsService.updateOrder(logisticsOrderId, {
        pickupAddress: draft.pickupAddress,
        notes: draft.notes,
      });
      await logisticsService.assignOrder(logisticsOrderId, draft.shipperId);
      toast.success('Đã phân công shipper thành công');
      await loadDashboard(false);
    } catch (error) {
      console.error('Assign logistics order error:', error);
      toast.error('Không thể phân công shipper');
    } finally {
      setAssigningId(null);
    }
  };

  if (user?.role !== 'LOGISTICS') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center max-w-xl">
          <Truck className="mx-auto mb-4 text-emerald-700" size={42} />
          <h1 className="text-2xl font-extrabold text-stone-900 mb-2">
            Dashboard logistics
          </h1>
          <p className="text-stone-500">
            Trang này chỉ dành cho tài khoản đơn vị vận chuyển.
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
          Đang tải dashboard logistics...
        </div>
      </div>
    );
  }

  const activeOrders = allOrders.filter((order) => order.shipperId);

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900">Dashboard Logistics</h1>
            <p className="text-stone-500 mt-2">
              Theo dõi đơn vừa tiếp nhận, cập nhật pickup address và phân công shipper.
            </p>
          </div>
          <button
            onClick={() => loadDashboard(false)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold hover:border-emerald-300 hover:text-emerald-700 transition"
          >
            {refreshing ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
            Làm mới
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Đơn chưa phân công</div>
            <div className="text-3xl font-extrabold text-stone-900 mt-2">
              {unassignedOrders.length}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Đơn đang xử lý</div>
            <div className="text-3xl font-extrabold text-stone-900 mt-2">
              {allOrders.filter((order) => order.status !== 'DELIVERED').length}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 p-6">
            <div className="text-sm text-stone-500">Shipper sẵn sàng</div>
            <div className="text-3xl font-extrabold text-stone-900 mt-2">
              {availableShippers.length}
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Package className="text-emerald-700" size={20} />
            <h2 className="text-xl font-extrabold text-stone-900">Đơn mới cần phân công</h2>
          </div>

          {unassignedOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-stone-500">
              Hiện tại không có đơn nào đang chờ phân công.
            </div>
          ) : (
            <div className="space-y-4">
              {unassignedOrders.map((logisticsOrder) => {
                const draft = drafts[logisticsOrder.id] || {
                  pickupAddress: logisticsOrder.pickupAddress || '',
                  notes: logisticsOrder.notes || '',
                  shipperId: '',
                };

                return (
                  <div
                    key={logisticsOrder.id}
                    className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm"
                  >
                    <div className="flex flex-col xl:flex-row gap-6">
                      <div className="xl:w-[1.1fr] space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-lg font-extrabold text-stone-900">
                            Don #{logisticsOrder.order.id.slice(-8).toUpperCase()}
                          </div>
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                            {logisticsStatusLabel[logisticsOrder.status] || logisticsOrder.status}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
                            {logisticsOrder.trackingCode}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                              <UserRound size={16} />
                              Khach nhan
                            </div>
                            <div className="font-bold text-stone-900">
                              {logisticsOrder.order.recipientName ||
                                logisticsOrder.order.user?.name ||
                                'Khach hang'}
                            </div>
                            <div className="text-stone-500 mt-1 flex items-center gap-2">
                              <Phone size={14} />
                              {logisticsOrder.order.recipientPhone ||
                                logisticsOrder.order.user?.phone ||
                                'Chua co so dien thoai'}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                              <MapPin size={16} />
                              Dia chi giao hang
                            </div>
                            <div className="font-medium text-stone-900 leading-6">
                              {logisticsOrder.deliveryAddress}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4">
                          <div className="text-sm font-bold text-stone-900 mb-3">
                            San pham ({logisticsOrder.order.orderItems.length})
                          </div>
                          <div className="space-y-3">
                            {logisticsOrder.order.orderItems.map((item) => (
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
                        <div className="rounded-2xl border border-stone-200 p-4">
                          <label className="block text-sm font-bold text-stone-900 mb-2">
                            Pickup address
                          </label>
                          <textarea
                            value={draft.pickupAddress}
                            onChange={(event) =>
                              updateDraft(logisticsOrder.id, {
                                pickupAddress: event.target.value,
                              })
                            }
                            rows={3}
                            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500"
                            placeholder="Nhập địa chỉ lấy hàng"
                          />
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4">
                          <label className="block text-sm font-bold text-stone-900 mb-2">
                            Ghi chú điều phối
                          </label>
                          <textarea
                            value={draft.notes}
                            onChange={(event) =>
                              updateDraft(logisticsOrder.id, { notes: event.target.value })
                            }
                            rows={3}
                            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500"
                            placeholder="Ghi chú nội bộ cho shipper hoặc kho"
                          />
                        </div>

                        <div className="rounded-2xl border border-stone-200 p-4">
                          <label className="block text-sm font-bold text-stone-900 mb-2">
                            Chọn shipper
                          </label>
                          <select
                            value={draft.shipperId}
                            onChange={(event) =>
                              updateDraft(logisticsOrder.id, { shipperId: event.target.value })
                            }
                            className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm text-stone-900 outline-none focus:border-emerald-500 bg-white"
                          >
                            <option value="">Chọn shipper sẵn sàng</option>
                            {availableShippers.map((shipper) => (
                              <option key={shipper.id} value={shipper.id}>
                                {shipper.user.name} • {shipper.user.phone || 'Không có số điện thoại'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleSaveDraft(logisticsOrder.id)}
                            disabled={savingId === logisticsOrder.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-4 py-3 text-sm font-bold text-stone-700 hover:border-emerald-400 hover:text-emerald-700 transition disabled:opacity-60"
                          >
                            {savingId === logisticsOrder.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Save size={16} />
                            )}
                            Lưu thông tin
                          </button>
                          <button
                            onClick={() => handleAssign(logisticsOrder.id)}
                            disabled={assigningId === logisticsOrder.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition disabled:opacity-60"
                          >
                            {assigningId === logisticsOrder.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <Truck size={16} />
                            )}
                            Phân công shipper
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
            <Truck className="text-emerald-700" size={20} />
            <h2 className="text-xl font-extrabold text-stone-900">Đơn đã có shipper</h2>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-stone-500">
              Chưa có đơn nào đã được phân công shipper.
            </div>
          ) : (
            <div className="grid xl:grid-cols-2 gap-4">
              {activeOrders.map((logisticsOrder) => (
                <div
                  key={logisticsOrder.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-extrabold text-stone-900">
                        #{logisticsOrder.order.id.slice(-8).toUpperCase()}
                      </div>
                      <div className="text-sm text-stone-500">{logisticsOrder.trackingCode}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                      {logisticsStatusLabel[logisticsOrder.status] || logisticsOrder.status}
                    </span>
                  </div>

                  <div className="text-sm text-stone-600">
                    <div className="font-semibold text-stone-900">
                      {logisticsOrder.shipper?.user?.name || 'Chưa có shipper'}
                    </div>
                    <div>{logisticsOrder.shipper?.user?.phone || 'Không có số điện thoại'}</div>
                  </div>

                  <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 text-sm">
                    <div className="text-stone-500 mb-1">Pickup address</div>
                    <div className="font-medium text-stone-900">
                      {logisticsOrder.pickupAddress || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 text-sm">
                    <div className="text-stone-500 mb-1">Địa chỉ giao hàng</div>
                    <div className="font-medium text-stone-900">{logisticsOrder.deliveryAddress}</div>
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
