"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
    Tag,
    MessageCircle,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-800/60 bg-stone-900/40 px-6 py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-stone-700/60 bg-stone-800/60">
                <ShoppingBag size={34} className="text-stone-500" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="mt-2 max-w-xs text-sm text-stone-500">
                Looks like you haven't added anything yet. Explore our menu and find something you'll love.
            </p>
            <Link
                href="/menu"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-amber-500/40"
            >
                Explore Menu
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </div>
    );
}



// ── Cart item row ──────────────────────────────────────────────────────────
type CartItem = {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
    category: string;
};

function CartItemRow({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    item: CartItem;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}) {
    return (
        <article className="group relative flex gap-4 rounded-2xl border border-stone-800/70 bg-stone-900/60 p-4 transition-all duration-200 hover:border-stone-700/80 md:gap-5 md:p-5">
            {/* Image */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-800 md:h-24 md:w-24 md:rounded-2xl">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div>
                    {/* Category */}
                    <span className="mb-1.5 inline-block rounded-full border border-amber-400/20 bg-amber-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400/80">
                        {item.category}
                    </span>
                    <h3 className="line-clamp-1 font-serif text-base font-bold text-white md:text-lg">
                        {item.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-stone-500">₹{item.price} per item</p>
                </div>

                {/* Bottom row: qty controls + subtotal + remove */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-stone-700/70 bg-stone-800/60">
                        <button
                            onClick={onDecrease}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-stone-400 transition-colors hover:bg-stone-700 hover:text-white active:scale-95 md:h-9 md:w-9"
                        >
                            <Minus size={13} strokeWidth={2.5} />
                        </button>
                        <span className="min-w-8 border-x border-stone-700/70 px-2 text-center text-sm font-bold text-white md:min-w-10 md:text-base">
                            {item.quantity}
                        </span>
                        <button
                            onClick={onIncrease}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-stone-400 transition-colors hover:bg-stone-700 hover:text-white active:scale-95 md:h-9 md:w-9"
                        >
                            <Plus size={13} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Subtotal */}
                        <p className="font-serif text-base font-bold text-amber-400 md:text-lg">
                            ₹{item.price * item.quantity}
                        </p>

                        {/* Remove */}
                        <button
                            onClick={onRemove}
                            aria-label={`Remove ${item.name}`}
                            className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300"
                        >
                            <Trash2 size={12} strokeWidth={2.5} />
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

// ── Order summary ──────────────────────────────────────────────────────────
function OrderSummary({
    items,
    total,
    onCheckout,
}: {
    items: CartItem[];
    total: number;
    onCheckout: () => void;
}) {
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const deliveryFee = total >= 499 ? 0 : 40;
    const grandTotal = total + deliveryFee;

    return (
        <div className="h-fit rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6 md:sticky md:top-24">
            <h2 className="font-serif text-xl font-bold text-white md:text-2xl">Order Summary</h2>

            {/* Item breakdown */}
            <div className="mt-5 space-y-3">
                {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-3">
                        <span className="flex-1 truncate text-xs text-stone-400">
                            {item.name}
                            <span className="ml-1.5 text-stone-600">×{item.quantity}</span>
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-stone-300">
                            ₹{item.price * item.quantity}
                        </span>
                    </div>
                ))}
            </div>

            <div className="my-4 h-px bg-stone-800/70" />

            {/* Totals */}
            <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm text-stone-400">
                    <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                    <span className="font-medium text-stone-300">₹{total}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-stone-400">
                        Delivery
                        {deliveryFee === 0 && (
                            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                FREE
                            </span>
                        )}
                    </span>
                    <span className={`font-medium ${deliveryFee === 0 ? "text-emerald-400" : "text-stone-300"}`}>
                        {deliveryFee === 0 ? "₹0" : `₹${deliveryFee}`}
                    </span>
                </div>

                {deliveryFee > 0 && (
                    <p className="flex items-center gap-1.5 rounded-xl bg-amber-400/8 px-3 py-2 text-[11px] text-amber-400/80">
                        <Tag size={10} strokeWidth={2.5} />
                        Add ₹{499 - total} more for free delivery
                    </p>
                )}
            </div>

            <div className="my-4 h-px bg-stone-800/70" />

            {/* Grand total */}
            <div className="flex items-center justify-between">
                <span className="font-serif text-base font-bold text-white">Total</span>
                <span className="font-serif text-2xl font-bold text-amber-400">₹{grandTotal}</span>
            </div>

            {/* CTA */}
            <button
                onClick={onCheckout}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-amber-500/45"
            >
                Proceed to Checkout
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* WhatsApp badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-stone-500">
                <MessageCircle size={12} className="text-[#25D366]" />
                Order confirmed via WhatsApp
            </div>

            {/* Trust note */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-600">
                <ShieldCheck size={11} className="text-stone-600" />
                Secure checkout — no account required
            </div>

            {/* Continue shopping */}
            <Link
                href="/menu"
                className="group mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-700/70 bg-stone-800/40 py-2.5 text-xs font-semibold text-stone-400 transition-all duration-200 hover:bg-stone-800 hover:text-white"
            >
                Continue Shopping
                <ChevronRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function CartPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const increaseQty = useCartStore((state) => state.increaseQty);
    const decreaseQty = useCartStore((state) => state.decreaseQty);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);

    const totalPrice = getTotalPrice();

    async function handleCheckout() {
        try {
            const res = await fetch("/api/auth/me");

            if (!res.ok) {
                router.push("/auth?redirect=/checkout");
                return;
            }

            router.push("/checkout");
        } catch {
            router.push("/auth?redirect=/checkout");
        }
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-950">

                {/* ── Page header ── */}
                <section className="relative overflow-hidden border-b border-stone-800/60 pb-8 pt-14">
                    <div
                        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-1/2 -translate-x-1/2 rounded-full opacity-[0.06] blur-3xl"
                        style={{ background: "radial-gradient(ellipse, #f59e0b, #ea580c 60%, transparent)" }}
                        aria-hidden="true"
                    />
                    <div className="relative mx-auto max-w-7xl px-4 md:px-8">
                        <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-4 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                                Review Order
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
                            Your Cart
                        </h1>
                        {items.length > 0 && (
                            <p className="mt-1.5 text-sm text-stone-500">
                                {items.reduce((s, i) => s + i.quantity, 0)} items ready for checkout
                            </p>
                        )}
                    </div>
                </section>

                {/* ── Content ── */}
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
                    {items.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

                            {/* Left — cart items */}
                            <div className="space-y-3 md:space-y-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                                        Items ({items.length})
                                    </p>
                                    <Link
                                        href="/menu"
                                        className="flex items-center gap-1 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400"
                                    >
                                        + Add more
                                    </Link>
                                </div>

                                {items.map((item) => (
                                    <CartItemRow
                                        key={item._id}
                                        item={item}
                                        onIncrease={() => increaseQty(item._id)}
                                        onDecrease={() => decreaseQty(item._id)}
                                        onRemove={() => removeItem(item._id)}
                                    />
                                ))}
                            </div>

                            {/* Right — order summary */}
                            <OrderSummary
                                items={items}
                                total={totalPrice}
                                onCheckout={handleCheckout}
                            />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}