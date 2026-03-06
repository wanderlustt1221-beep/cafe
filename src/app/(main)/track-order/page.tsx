// src/app/(main)/track-order/page.tsx
"use client";

import { useState } from "react";
import {
    Search, Loader2, Package, ArrowRight,
    Truck, Store, Phone, MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { OrderStatusBadge } from "@/components/admin/orders/OrderStatusBadge";
import Link from "next/link";

type TrackedOrder = {
    _id: string;
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    landmark?: string;
    orderType: string;
    items: { name: string; quantity: number; price: number; image?: string }[];
    totalAmount: number;
    status: string;
    note?: string;
    createdAt: string;
};

export default function TrackOrderPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = input.replace(/^#/, "").trim();

        if (!trimmed) {
            toast.error("Please enter your Order ID");
            return;
        }

        setLoading(true);
        setOrder(null);
        setNotFound(false);

        try {
            const res = await fetch(`/api/orders/track/${encodeURIComponent(trimmed)}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                setNotFound(true);
                return;
            }

            setOrder(data.order);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-stone-950">
            {/* ── Hero / search section ── */}
            <section className="relative overflow-hidden border-b border-stone-800/60 pb-14 pt-16">
                <div
                    className="pointer-events-none absolute -top-32 left-1/2 h-72 w-2/3 -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
                    style={{
                        background:
                            "radial-gradient(ellipse, #f59e0b 0%, #ea580c 60%, transparent 100%)",
                    }}
                    aria-hidden="true"
                />

                <div className="relative mx-auto max-w-xl px-4 text-center md:px-6">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-4 py-1.5">
                        <Package size={11} className="text-amber-400" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                            Order Tracking
                        </span>
                    </div>

                    <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
                        Track Your Order
                    </h1>
                    <p className="mt-3 text-sm text-stone-500">
                        Enter the Order ID from your WhatsApp confirmation to see live status updates.
                    </p>

                    {/* Search */}
                    <form onSubmit={handleTrack} className="mt-8 flex gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={14}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
                            />
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g. ORD-1772799228658-8047"
                                className="w-full rounded-xl border border-stone-700/70 bg-stone-800/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-stone-600 focus:border-amber-500/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 disabled:opacity-60"
                        >
                            {loading
                                ? <Loader2 size={15} className="animate-spin" />
                                : <ArrowRight size={15} strokeWidth={2.5} />
                            }
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Results ── */}
            <div className="mx-auto max-w-xl px-4 py-12 md:px-6">

                {/* Not found state */}
                {notFound && (
                    <div className="flex flex-col items-center rounded-2xl border border-stone-800/60 bg-stone-900/50 px-6 py-14 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-700/50 bg-stone-800/60">
                            <Search size={26} className="text-stone-500" strokeWidth={1.5} />
                        </div>
                        <h2 className="font-serif text-xl font-bold text-white">Order Not Found</h2>
                        <p className="mt-2 max-w-xs text-sm text-stone-500">
                            No order found with ID{" "}
                            <span className="font-mono font-semibold text-stone-300">"{input}"</span>.
                            Please check the ID from your WhatsApp message and try again.
                        </p>
                        <button
                            onClick={() => { setNotFound(false); setInput(""); }}
                            className="mt-6 rounded-xl border border-stone-700 bg-stone-800/60 px-5 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-700 hover:text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Order result */}
                {order && (
                    <div className="space-y-4">

                        {/* Summary card */}
                        <div className="overflow-hidden rounded-2xl border border-stone-800/60 bg-stone-900/50">
                            <div className="flex items-start justify-between gap-3 p-5">
                                <div className="space-y-1.5">
                                    <p className="font-serif text-lg font-bold text-white">
                                        {order.customerName}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-sm text-stone-500">
                                        <Phone size={12} /> {order.phone}
                                    </p>
                                    {order.orderType === "delivery" ? (
                                        <p className="flex items-start gap-1.5 text-sm text-stone-500">
                                            <MapPin size={12} className="mt-0.5 shrink-0" />
                                            <span>
                                                {order.address}
                                                {order.landmark ? `, ${order.landmark}` : ""}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Store size={11} /> Pickup order
                                        </p>
                                    )}
                                    <p className="font-mono text-[11px] text-stone-600">
                                        #{order.orderId}
                                    </p>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <OrderStatusBadge status={order.status} />
                                    <span className="font-serif text-xl font-black text-amber-400">
                                        ₹{order.totalAmount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-1 border-t border-stone-800/50 px-5 pb-4 pt-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-stone-400">
                                            {item.name}
                                            <span className="ml-1.5 text-stone-600">× {item.quantity}</span>
                                        </span>
                                        <span className="text-stone-300">
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {order.note && (
                                <div className="border-t border-stone-800/50 px-5 py-3">
                                    <p className="text-xs text-stone-500">
                                        📝 {order.note}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="rounded-2xl border border-stone-800/60 bg-stone-900/50 p-6">
                            <h2 className="mb-6 font-serif text-base font-bold text-white">
                                Live Order Timeline
                            </h2>
                            <OrderTimeline
                                status={order.status}
                                orderType={order.orderType}
                                createdAt={order.createdAt}
                            />
                        </div>

                        {/* Track another / order again */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setOrder(null); setInput(""); }}
                                className="flex-1 rounded-xl border border-stone-700/60 bg-stone-900/40 py-3 text-sm font-medium text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
                            >
                                Track Another
                            </button>
                            <Link
                                href="/menu"
                                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400/90 to-orange-500/90 py-3 text-sm font-bold text-stone-950 transition-all hover:brightness-110"
                            >
                                Order Again
                                <ArrowRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}