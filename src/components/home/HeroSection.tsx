import Link from "next/link";
import { ArrowRight, Star, Zap, MessageCircle, Clock, ShieldCheck } from "lucide-react";

const trustPills = [
    { icon: Zap, label: "Fast Delivery" },
    { icon: MessageCircle, label: "WhatsApp Checkout" },
    { icon: Clock, label: "Open Until 11 PM" },
    { icon: ShieldCheck, label: "Fresh Daily" },
];

const stats = [
    { value: "2,400+", label: "Happy Customers" },
    { value: "4.9★", label: "Avg Rating" },
    { value: "25 min", label: "Avg Delivery" },
];

const floatingItems = [
    { emoji: "☕", name: "Cold Coffee", tag: "Best Seller", price: "₹120" },
    { emoji: "🍔", name: "Smash Burger", tag: "Trending", price: "₹199" },
    { emoji: "🍕", name: "Loaded Pizza", tag: "New", price: "₹249" },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-stone-950">
            {/* Background texture layers */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(ellipse 80% 60% at 60% 0%, rgba(251,191,36,0.09) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 100% 80%, rgba(234,88,12,0.07) 0%, transparent 60%)`,
                }}
                aria-hidden="true"
            />
            {/* Subtle dot grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `radial-gradient(circle, #d97706 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:gap-16 md:px-8 lg:py-28">

                {/* ── Left column ── */}
                <div className="flex flex-col">

                    {/* Top badge */}
                    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/8 px-4 py-2">
                        <span className="flex h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_2px_rgba(251,191,36,0.5)]" />
                        <span className="text-[13px] font-semibold tracking-wide text-amber-300">
                            Now serving in Danta, Sikar
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-serif text-[2.6rem] font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[3.5rem]">
                        Cravings Delivered,{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)" }}>
                                Freshly Made
                            </span>
                            <span
                                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full opacity-60"
                                style={{ backgroundImage: "linear-gradient(90deg, #fbbf24, #f97316)" }}
                                aria-hidden="true"
                            />
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-stone-400">
                        Premium coffee, burgers, pizza and combos — ordered in seconds, confirmed on WhatsApp, delivered to your door.
                    </p>

                    {/* CTAs */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/menu"
                            className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-[0.95rem] font-bold text-stone-950 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-amber-500/50 hover:brightness-110"
                            style={{ backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)" }}
                        >
                            Order Now
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/offers"
                            className="inline-flex items-center gap-2 rounded-xl border border-stone-700/80 bg-stone-900/60 px-7 py-3.5 text-[0.95rem] font-semibold text-stone-200 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white"
                        >
                            View Offers
                        </Link>
                    </div>

                    {/* Trust pills */}
                    <div className="mt-8 flex flex-wrap gap-2">
                        {trustPills.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-1.5 rounded-full border border-stone-700/60 bg-stone-900/50 px-3 py-1.5 text-xs font-medium text-stone-400"
                            >
                                <Icon size={11} className="text-amber-500" strokeWidth={2.5} />
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Stats strip */}
                    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-stone-800/60 pt-7">
                        {stats.map(({ value, label }) => (
                            <div key={label}>
                                <p className="font-serif text-2xl font-bold text-white">{value}</p>
                                <p className="mt-0.5 text-xs text-stone-500">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right column — visual card panel ── */}
                <div className="relative flex flex-col gap-4">
                    {/* Outer glow */}
                    <div
                        className="pointer-events-none absolute -inset-10 rounded-[3rem] opacity-20 blur-3xl"
                        style={{ backgroundImage: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    {/* Popular items card */}
                    <div className="relative rounded-3xl border border-stone-800/80 bg-gradient-to-br from-stone-900 to-stone-950 p-5 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-500">
                                Popular Right Now
                            </p>
                            <Link
                                href="/menu"
                                className="flex items-center gap-1 text-xs font-semibold text-stone-400 transition-colors hover:text-amber-400"
                            >
                                Full Menu <ArrowRight size={11} />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {floatingItems.map((item, i) => (
                                <div
                                    key={item.name}
                                    className="group flex items-center gap-4 rounded-2xl border border-stone-800/60 bg-stone-900/60 p-3.5 transition-all duration-200 hover:border-amber-500/30 hover:bg-stone-800/70"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-stone-700/50 bg-stone-800 text-2xl shadow-inner">
                                        {item.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-white">{item.name}</p>
                                            <span
                                                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                                style={
                                                    i === 0
                                                        ? { background: "rgba(251,191,36,0.15)", color: "#fbbf24" }
                                                        : i === 1
                                                            ? { background: "rgba(239,68,68,0.12)", color: "#f87171" }
                                                            : { background: "rgba(52,211,153,0.12)", color: "#6ee7b7" }
                                                }
                                            >
                                                {item.tag}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star
                                                    key={j}
                                                    size={9}
                                                    className="fill-amber-400 text-amber-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="shrink-0 font-serif text-lg font-bold text-amber-400">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom 2-col info cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-stone-800/70 bg-gradient-to-br from-stone-900 to-stone-950 p-4">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                                📲
                            </div>
                            <p className="text-sm font-bold text-white">WhatsApp Order</p>
                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                One tap checkout, instant confirmation
                            </p>
                        </div>
                        <div className="rounded-2xl border border-stone-800/70 bg-gradient-to-br from-stone-900 to-stone-950 p-4">
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
                                🛵
                            </div>
                            <p className="text-sm font-bold text-white">25-Min Delivery</p>
                            <p className="mt-1 text-xs leading-5 text-stone-500">
                                Hot, fast and to your doorstep
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}