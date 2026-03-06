"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import {
    ShoppingBag,
    MapPin,
    Phone,
    User,
    MessageSquare,
    Truck,
    Store,
    ArrowRight,
    Loader2,
    ShieldCheck,
    MessageCircle,
    Clock,
    Trash2,
    Tag,
} from "lucide-react";

type OrderType = "delivery" | "pickup";

type FormState = {
    customerName: string;
    phone: string;
    address: string;
    landmark: string;
    note: string;
    orderType: OrderType;
};

function buildWhatsAppMessage(
    form: FormState,
    items: { name: string; quantity: number; price: number }[],
    total: number,
    orderId: string
): string {
    const lines = [
        `🍽️ *New Order — Cafe App*`,
        `Order ID: ${orderId}`,
        ``,
        `*Customer Details*`,
        `Name: ${form.customerName}`,
        `Phone: ${form.phone}`,
        form.orderType === "delivery"
            ? `Address: ${form.address}${form.landmark ? ` (Near: ${form.landmark})` : ""}`
            : `Order Type: Pickup`,
        ``,
        `*Order Items*`,
        ...items.map((i) => `• ${i.name} × ${i.quantity} — ₹${i.price * i.quantity}`),
        ``,
        `*Total: ₹${total}*`,
        form.note ? `Note: ${form.note}` : "",
    ];

    return encodeURIComponent(lines.filter(Boolean).join("\n"));
}

function tryPrefillFromStorage(): Partial<FormState> {
    try {
        const raw = localStorage.getItem("cafeapp_user");
        if (!raw) return {};

        const u = JSON.parse(raw);

        return {
            customerName: u.name || u.customerName || "",
            phone: u.phone || "",
            address:
                typeof u.address === "string"
                    ? u.address
                    : u.address?.line1 || u.addressLine1 || "",
            landmark: u.landmark || u.address?.landmark || "",
        };
    } catch {
        return {};
    }
}

function getDeliveryFee(orderType: OrderType, total: number) {
    if (orderType !== "delivery") return 0;
    return total < 499 ? 40 : 0;
}

function FieldWrapper({
    label,
    icon,
    children,
}: {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-400">
                {icon}
                {label}
            </label>
            {children}
        </div>
    );
}

function Input({
    value,
    onChange,
    placeholder,
    type = "text",
    autoComplete,
    required,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    autoComplete?: string;
    required?: boolean;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            required={required}
            className="w-full rounded-xl border border-stone-700/70 bg-stone-800/60 px-4 py-3 text-sm text-white placeholder:text-stone-600 transition-colors focus:border-amber-500/60 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
    );
}

function EmptyCartState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-800/60 bg-stone-900/50 px-6 py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-stone-700/60 bg-stone-800/60">
                <ShoppingBag size={34} className="text-stone-500" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">Your cart is empty</h2>
            <p className="mt-2 max-w-xs text-sm text-stone-500">
                Add some delicious items to your cart before checking out.
            </p>
            <Link
                href="/menu"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110"
            >
                Explore Menu
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const getTotalPrice = useCartStore((s) => s.getTotalPrice);

    const [form, setForm] = useState<FormState>({
        customerName: "",
        phone: "",
        address: "",
        landmark: "",
        note: "",
        orderType: "delivery",
    });

    const [loading, setLoading] = useState(false);

    const totalPrice = getTotalPrice();
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = getDeliveryFee(form.orderType, totalPrice);
    const grandTotal = totalPrice + deliveryFee;

    useEffect(() => {
        const prefill = tryPrefillFromStorage();
        if (Object.keys(prefill).length > 0) {
            setForm((prev) => ({ ...prev, ...prefill }));
        }
    }, []);

    useEffect(() => {
        async function checkAuth() {
            const res = await fetch("/api/auth/me");

            if (!res.ok) {
                router.push("/auth?redirect=/checkout");
            }
        }

        checkAuth();
    }, []);

    const set =
        (key: keyof FormState) =>
            (value: string) =>
                setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.customerName.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!form.phone.trim() || form.phone.trim().length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }

        if (form.orderType === "delivery" && !form.address.trim()) {
            toast.error("Please enter your delivery address");
            return;
        }

        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                customerName: form.customerName.trim(),
                phone: form.phone.trim(),
                address: form.orderType === "delivery" ? form.address.trim() : "Pickup",
                landmark: form.landmark.trim(),
                note: form.note.trim(),
                orderType: form.orderType,
                items: items.map((item) => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image: item.image,
                })),
                totalAmount: grandTotal,
            };

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                toast.error(data.message || "Failed to place order. Please try again.");
                setLoading(false);
                return;
            }

            const orderId =
                data?.order?.orderId ||
                data?.order?._id ||
                data?._id ||
                `ORD-${Date.now()}`;

            const waMsg = buildWhatsAppMessage(form, items, grandTotal, orderId);
            const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

            toast.success("Order placed! Opening WhatsApp… 🎉");
            clearCart();

            setTimeout(() => {
                window.open(`https://wa.me/${waNumber}?text=${waMsg}`, "_blank");
                router.push("/");
            }, 1000);
        } catch {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-stone-950">
                <section className="relative overflow-hidden border-b border-stone-800/60 pb-8 pt-14">
                    <div
                        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
                        style={{
                            background: "radial-gradient(ellipse, #f59e0b, #ea580c 60%, transparent)",
                        }}
                        aria-hidden="true"
                    />
                    <div className="relative mx-auto max-w-7xl px-4 md:px-8">
                        <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                                Checkout
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
                            Complete Your Order
                        </h1>
                        {items.length > 0 && (
                            <p className="mt-1.5 text-sm text-stone-500">
                                {totalQty} item{totalQty !== 1 ? "s" : ""} — confirm details and place
                                your order
                            </p>
                        )}
                    </div>
                </section>

                <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">
                    {items.length === 0 ? (
                        <EmptyCartState />
                    ) : (
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                                <div className="space-y-6">
                                    <div className="rounded-2xl border border-stone-800/70 bg-stone-900/60 p-5">
                                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                                            Order Type
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(["delivery", "pickup"] as OrderType[]).map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setForm((prev) => ({ ...prev, orderType: type }))}
                                                    className={`flex items-center justify-center gap-2.5 rounded-xl border py-3.5 text-sm font-bold transition-all duration-200 ${form.orderType === type
                                                        ? "border-amber-500/50 bg-gradient-to-br from-amber-500/15 to-orange-500/10 text-amber-400 shadow-inner"
                                                        : "border-stone-700/70 bg-stone-800/40 text-stone-400 hover:bg-stone-800"
                                                        }`}
                                                >
                                                    {type === "delivery" ? (
                                                        <Truck size={16} strokeWidth={2} />
                                                    ) : (
                                                        <Store size={16} strokeWidth={2} />
                                                    )}
                                                    {type === "delivery" ? "Delivery" : "Pickup"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-stone-800/70 bg-stone-900/60 p-5">
                                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                                            Contact Details
                                        </p>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FieldWrapper label="Full Name *" icon={<User size={11} />}>
                                                <Input
                                                    value={form.customerName}
                                                    onChange={set("customerName")}
                                                    placeholder="Your full name"
                                                    autoComplete="name"
                                                    required
                                                />
                                            </FieldWrapper>

                                            <FieldWrapper label="Phone *" icon={<Phone size={11} />}>
                                                <Input
                                                    value={form.phone}
                                                    onChange={set("phone")}
                                                    placeholder="+91 98765 43210"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    required
                                                />
                                            </FieldWrapper>
                                        </div>
                                    </div>

                                    {form.orderType === "delivery" && (
                                        <div className="rounded-2xl border border-stone-800/70 bg-stone-900/60 p-5">
                                            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                                                Delivery Address
                                            </p>
                                            <div className="space-y-4">
                                                <FieldWrapper label="Address *" icon={<MapPin size={11} />}>
                                                    <textarea
                                                        value={form.address}
                                                        onChange={(e) => set("address")(e.target.value)}
                                                        placeholder="House no., Street, Colony, Area..."
                                                        rows={2}
                                                        required
                                                        className="w-full resize-none rounded-xl border border-stone-700/70 bg-stone-800/60 px-4 py-3 text-sm text-white placeholder:text-stone-600 transition-colors focus:border-amber-500/60 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                    />
                                                </FieldWrapper>

                                                <FieldWrapper label="Landmark" icon={<Tag size={11} />}>
                                                    <Input
                                                        value={form.landmark}
                                                        onChange={set("landmark")}
                                                        placeholder="Near temple, school, etc."
                                                        autoComplete="off"
                                                    />
                                                </FieldWrapper>
                                            </div>
                                        </div>
                                    )}

                                    <div className="rounded-2xl border border-stone-800/70 bg-stone-900/60 p-5">
                                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                                            Order Note (Optional)
                                        </p>
                                        <FieldWrapper
                                            label="Special Instructions"
                                            icon={<MessageSquare size={11} />}
                                        >
                                            <textarea
                                                value={form.note}
                                                onChange={(e) => set("note")(e.target.value)}
                                                placeholder="Any special requests, allergies, or instructions..."
                                                rows={3}
                                                className="w-full resize-none rounded-xl border border-stone-700/70 bg-stone-800/60 px-4 py-3 text-sm text-white placeholder:text-stone-600 transition-colors focus:border-amber-500/60 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                            />
                                        </FieldWrapper>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:h-fit">
                                    <div className="rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6">
                                        <h2 className="font-serif text-xl font-bold text-white">Order Summary</h2>

                                        <div className="mt-5 space-y-3">
                                            {items.map((item) => (
                                                <div key={item._id} className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-800">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-stone-950">
                                                            {item.quantity}
                                                        </span>
                                                    </div>

                                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                                                        <p className="truncate text-sm font-medium text-white">
                                                            {item.name}
                                                        </p>
                                                        <p className="shrink-0 font-serif text-sm font-bold text-amber-400">
                                                            ₹{item.price * item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="my-4 h-px bg-stone-800/70" />

                                        <div className="space-y-2.5">
                                            <div className="flex justify-between text-sm text-stone-400">
                                                <span>Subtotal ({totalQty} items)</span>
                                                <span className="text-stone-300">₹{totalPrice}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <span className="flex items-center gap-1.5 text-stone-400">
                                                    Delivery
                                                    {deliveryFee === 0 && form.orderType === "delivery" && (
                                                        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                                            FREE
                                                        </span>
                                                    )}
                                                </span>

                                                <span
                                                    className={
                                                        deliveryFee === 0 ? "font-medium text-emerald-400" : "text-stone-300"
                                                    }
                                                >
                                                    {form.orderType === "pickup"
                                                        ? "N/A"
                                                        : deliveryFee === 0
                                                            ? "₹0"
                                                            : `₹${deliveryFee}`}
                                                </span>
                                            </div>

                                            {form.orderType === "delivery" && deliveryFee > 0 && (
                                                <p className="flex items-center gap-1.5 rounded-xl bg-amber-400/8 px-3 py-2 text-[11px] text-amber-400/80">
                                                    <Tag size={10} />
                                                    Add ₹{499 - totalPrice} more for free delivery
                                                </p>
                                            )}
                                        </div>

                                        <div className="my-4 h-px bg-stone-800/70" />

                                        <div className="flex items-center justify-between">
                                            <span className="font-serif text-base font-bold text-white">
                                                Grand Total
                                            </span>
                                            <span className="font-serif text-2xl font-bold text-amber-400">
                                                ₹{grandTotal}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-4 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading ? (
                                                <Loader2 size={17} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <MessageCircle size={17} strokeWidth={2.5} />
                                                    Place Order via WhatsApp
                                                    <ArrowRight
                                                        size={15}
                                                        className="transition-transform group-hover:translate-x-1"
                                                    />
                                                </>
                                            )}
                                        </button>

                                        <div className="mt-4 space-y-2">
                                            {[
                                                { icon: ShieldCheck, text: "Secure order — no payment stored" },
                                                { icon: Clock, text: "Avg. 25 min delivery time" },
                                                { icon: MessageCircle, text: "Confirmation sent via WhatsApp" },
                                            ].map(({ icon: Icon, text }) => (
                                                <div
                                                    key={text}
                                                    className="flex items-center gap-2 text-[11px] text-stone-500"
                                                >
                                                    <Icon
                                                        size={11}
                                                        className="shrink-0 text-amber-500/60"
                                                        strokeWidth={2}
                                                    />
                                                    {text}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/cart"
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700/70 bg-stone-900/40 py-2.5 text-xs font-semibold text-stone-400 transition-all hover:bg-stone-800 hover:text-white"
                                    >
                                        <Trash2 size={12} />
                                        Edit Cart
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}