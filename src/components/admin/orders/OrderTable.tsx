"use client";

// src/components/admin/orders/OrderTable.tsx

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    ChevronDown, Search, ShoppingBag, Phone,
    Truck, Store, Clock, ChevronRight, X, MapPin,
} from "lucide-react";
import {
    OrderStatusBadge,
    ALL_STATUSES,
    STATUS_CONFIG,
    type OrderStatus,
} from "./OrderStatusBadge";

// ─── Types (mirror real Order schema) ────────────────────────────────────
export type OrderItem = {
    productId?: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
};

export type OrderRow = {
    _id: string;
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    landmark?: string;
    orderType: "delivery" | "pickup";
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    note?: string;
    whatsappSent?: boolean;
    createdAt: string;
};

type Props = { orders: OrderRow[] };

// ─── Full-detail modal ────────────────────────────────────────────────────
function OrderModal({ order, onClose }: { order: OrderRow; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 pt-12">
            <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#16161f] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                    <div>
                        <h3 className="font-serif text-base font-bold text-white">Order Details</h3>
                        <p className="mt-0.5 font-mono text-[11px] text-stone-500">
                            #{order.orderId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white/6 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    {/* Customer info */}
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-2.5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Customer</p>
                        <p className="font-semibold text-stone-200">{order.customerName}</p>
                        <p className="flex items-center gap-1.5 text-sm text-stone-400">
                            <Phone size={12} /> {order.phone}
                        </p>
                        {order.orderType === "delivery" ? (
                            <>
                                <p className="flex items-start gap-1.5 text-sm text-stone-400">
                                    <MapPin size={12} className="mt-0.5 shrink-0" />
                                    <span>{order.address}{order.landmark ? `, ${order.landmark}` : ""}</span>
                                </p>
                                <p className="flex items-center gap-1.5 text-xs text-stone-500">
                                    <Truck size={11} /> Delivery
                                </p>
                            </>
                        ) : (
                            <p className="flex items-center gap-1.5 text-xs text-stone-500">
                                <Store size={11} /> Pickup
                            </p>
                        )}
                        {order.note && (
                            <p className="rounded-lg bg-amber-500/8 px-3 py-2 text-xs text-amber-400/80 border border-amber-500/10">
                                📝 {order.note}
                            </p>
                        )}
                    </div>

                    {/* Items */}
                    <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-stone-600">
                            Items ({order.items.length})
                        </p>
                        <div className="space-y-1.5">
                            {order.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-8 w-8 rounded-lg object-cover"
                                        />
                                    )}
                                    <span className="flex-1 text-sm text-stone-300">
                                        {item.name}
                                        <span className="ml-1.5 text-stone-600">× {item.quantity}</span>
                                    </span>
                                    <span className="font-serif text-sm font-bold text-amber-400">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
                            <span className="font-bold text-stone-300">Total</span>
                            <span className="font-serif text-xl font-black text-amber-400">
                                ₹{order.totalAmount.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1.5">
                            <Clock size={11} />
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                        </span>
                        <OrderStatusBadge status={order.status} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Inline status dropdown ───────────────────────────────────────────────
function StatusSelect({
    orderId,
    current,
    onUpdate,
}: {
    orderId: string;
    current: string;
    onUpdate: (id: string, status: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.message ?? "Failed to update"); return; }
            onUpdate(orderId, newStatus);
            toast.success("Status updated");
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <select
                value={current}
                onChange={handleChange}
                disabled={loading}
                className="appearance-none rounded-lg border border-white/[0.07] bg-white/[0.04] py-1.5 pl-3 pr-7 text-xs font-semibold text-stone-300 transition-colors focus:border-amber-500/40 focus:outline-none disabled:opacity-60"
            >
                {ALL_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#111118]">
                        {STATUS_CONFIG[s].label}
                    </option>
                ))}
            </select>
            <ChevronDown
                size={11}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-500"
            />
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function OrderTable({ orders: initialOrders }: Props) {
    const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selected, setSelected] = useState<OrderRow | null>(null);

    const handleStatusUpdate = (id: string, status: string) =>
        setOrders((prev) =>
            prev.map((o) => o._id === id ? { ...o, status: status as OrderStatus } : o)
        );

    const visible = orders.filter((o) => {
        const matchesFilter = filter === "all" || o.status === filter;
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            o.customerName.toLowerCase().includes(q) ||
            o.phone.includes(q) ||
            o.orderId.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            {selected && (
                <OrderModal order={selected} onClose={() => setSelected(null)} />
            )}

            {/* Controls */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search
                        size={13}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, phone or order ID…"
                        className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-stone-300 placeholder:text-stone-700 focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                    />
                </div>
                <div className="relative shrink-0">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="appearance-none rounded-xl border border-white/[0.07] bg-white/[0.04] py-2.5 pl-4 pr-9 text-sm text-stone-300 focus:border-amber-500/40 focus:outline-none"
                    >
                        <option value="all" className="bg-[#111118]">All Status</option>
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-[#111118]">
                                {STATUS_CONFIG[s].label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                        <ShoppingBag size={24} className="text-stone-600" strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-base font-bold text-white">No orders found</p>
                    <p className="mt-1 text-sm text-stone-600">
                        {orders.length === 0
                            ? "No orders have been placed yet."
                            : "Try adjusting your search or filters."}
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table ── */}
                    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] md:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    {[
                                        "Order ID", "Customer", "Type",
                                        "Items", "Total", "Status", "Time", "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {visible.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="transition-colors hover:bg-white/[0.02]"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs font-semibold text-stone-400">
                                                #{order.orderId}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-stone-200">{order.customerName}</p>
                                            <p className="text-[11px] text-stone-600">{order.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="flex items-center gap-1.5 text-xs text-stone-400">
                                                {order.orderType === "delivery"
                                                    ? <><Truck size={11} /> Delivery</>
                                                    : <><Store size={11} /> Pickup</>
                                                }
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-stone-400">
                                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                        </td>
                                        <td className="px-4 py-3 font-serif font-bold text-amber-400">
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusSelect
                                                orderId={order._id}
                                                current={order.status}
                                                onUpdate={handleStatusUpdate}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-[11px] text-stone-600">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            <p className="text-[10px] text-stone-700">
                                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => setSelected(order)}
                                                className="flex items-center gap-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-xs text-stone-400 transition-colors hover:border-amber-500/30 hover:text-amber-400"
                                            >
                                                View <ChevronRight size={11} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile cards ── */}
                    <div className="space-y-3 md:hidden">
                        {visible.map((order) => (
                            <div
                                key={order._id}
                                className="rounded-2xl border border-white/[0.06] bg-[#111118] p-4"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-white">{order.customerName}</p>
                                        <p className="text-xs text-stone-500">{order.phone}</p>
                                        <p className="mt-0.5 font-mono text-[10px] text-stone-600">
                                            #{order.orderId}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-serif font-bold text-amber-400">
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </span>
                                        <OrderStatusBadge status={order.status} />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 border-t border-white/[0.04] pt-3">
                                    <span className="flex items-center gap-1 text-xs text-stone-600">
                                        {order.orderType === "delivery"
                                            ? <><Truck size={10} /> Delivery</>
                                            : <><Store size={10} /> Pickup</>
                                        }
                                    </span>
                                    <span className="ml-auto flex items-center gap-2">
                                        <StatusSelect
                                            orderId={order._id}
                                            current={order.status}
                                            onUpdate={handleStatusUpdate}
                                        />
                                        <button
                                            onClick={() => setSelected(order)}
                                            className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400"
                                        >
                                            Details <ChevronRight size={11} />
                                        </button>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-3 text-right text-[11px] text-stone-700">
                        {visible.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
                    </p>
                </>
            )}
        </>
    );
}