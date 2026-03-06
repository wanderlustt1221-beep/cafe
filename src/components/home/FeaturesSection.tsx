"use client";
import Link from "next/link";
import {
    ShoppingBag,
    MessageCircle,
    MapPin,
    Star,
    ArrowRight,
    Flame,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const steps = [
    {
        step: "01",
        icon: ShoppingBag,
        title: "Browse & Build Your Order",
        description:
            "Explore our full menu of coffees, burgers, pizzas, shakes and combos. Add items to your cart with a single tap — fast, smooth, app-like.",
        highlight: "300+ Menu Items",
        color: "amber",
        perks: ["Categorized menu", "Item customization", "Combo deals"],
    },
    {
        step: "02",
        icon: MessageCircle,
        title: "Checkout via WhatsApp",
        description:
            "No login required. Confirm your order directly on WhatsApp in seconds. We receive it instantly and start preparing right away.",
        highlight: "Zero friction checkout",
        color: "orange",
        perks: ["Instant confirmation", "No app install needed", "Direct with staff"],
    },
    {
        step: "03",
        icon: MapPin,
        title: "Fast Local Delivery",
        description:
            "We deliver hot and fresh to nearby locations within 25 minutes. Pickup is also available for a quick, hassle-free experience.",
        highlight: "Avg. 25 min delivery",
        color: "red",
        perks: ["Live tracking updates", "Contactless delivery", "Pickup option"],
    },
];

const highlights = [
    {
        icon: Star,
        label: "4.9 / 5",
        sublabel: "Customer Rating",
        bg: "from-amber-500/10 to-orange-500/5",
        border: "border-amber-500/20",
        iconColor: "text-amber-400",
    },
    {
        icon: Flame,
        label: "Daily Fresh",
        sublabel: "Prepared Every Morning",
        bg: "from-orange-500/10 to-red-500/5",
        border: "border-orange-500/20",
        iconColor: "text-orange-400",
    },
    {
        icon: Sparkles,
        label: "Premium Quality",
        sublabel: "Hand-picked Ingredients",
        bg: "from-yellow-500/10 to-amber-500/5",
        border: "border-yellow-500/20",
        iconColor: "text-yellow-400",
    },
];

const colorMap: Record<string, { accent: string; glow: string; badge: string; stepText: string }> = {
    amber: {
        accent: "border-amber-500/30 bg-amber-500/8",
        glow: "rgba(245,158,11,0.15)",
        badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
        stepText: "text-amber-500/30",
    },
    orange: {
        accent: "border-orange-500/30 bg-orange-500/8",
        glow: "rgba(249,115,22,0.15)",
        badge: "bg-orange-400/10 text-orange-300 border-orange-400/20",
        stepText: "text-orange-500/30",
    },
    red: {
        accent: "border-red-500/30 bg-red-500/8",
        glow: "rgba(239,68,68,0.12)",
        badge: "bg-red-400/10 text-red-300 border-red-400/20",
        stepText: "text-red-500/30",
    },
};

export default function FeaturesSection() {
    return (
        <section className="relative overflow-hidden bg-stone-950 py-24">
            {/* Ambient background glow */}
            <div
                className="pointer-events-none absolute top-0 left-1/2 h-96 w-2/3 -translate-x-1/2 opacity-[0.06] blur-3xl"
                style={{ background: "radial-gradient(ellipse, #f59e0b 0%, #ea580c 50%, transparent 100%)" }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 md:px-8">

                {/* ── Section header ── */}
                <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-4 py-1.5">
                            <Sparkles size={12} className="text-amber-400" />
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-amber-400">
                                Why Choose Us
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
                            Ordering food has never{" "}
                            <span
                                className="text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f97316)" }}
                            >
                                felt this good
                            </span>
                        </h2>
                        <p className="mt-4 text-stone-400 leading-relaxed">
                            Three simple steps from craving to delivery — and a premium experience at every stage.
                        </p>
                    </div>
                    <Link
                        href="/menu"
                        className="group hidden shrink-0 items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/60 px-5 py-3 text-sm font-semibold text-stone-300 transition-all duration-200 hover:border-amber-500/40 hover:bg-stone-800 hover:text-white md:inline-flex"
                    >
                        Explore Menu
                        <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* ── How it works — 3 step cards ── */}
                <div className="grid gap-5 md:grid-cols-3">
                    {steps.map((s, i) => {
                        const Icon = s.icon;
                        const c = colorMap[s.color];
                        return (
                            <div
                                key={s.step}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-800/70 bg-gradient-to-br from-stone-900 to-stone-950 p-6 transition-all duration-300 hover:border-stone-700"
                                style={{
                                    boxShadow: `0 0 0 0 transparent`,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px ${c.glow}`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 transparent`;
                                }}
                            >
                                {/* Step number watermark */}
                                <span
                                    className={`pointer-events-none absolute -right-3 -top-3 font-serif text-[7rem] font-black leading-none select-none ${c.stepText}`}
                                    aria-hidden="true"
                                >
                                    {s.step}
                                </span>

                                {/* Icon + step badge */}
                                <div className="relative z-10 mb-5 flex items-start justify-between">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${c.accent}`}
                                    >
                                        <Icon size={22} className="text-white" strokeWidth={1.8} />
                                    </div>
                                    <span
                                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${c.badge}`}
                                    >
                                        Step {i + 1}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-1 flex-col">
                                    <h3 className="font-serif text-xl font-bold text-white leading-snug">
                                        {s.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-stone-400">{s.description}</p>

                                    {/* Highlight pill */}
                                    <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                        <span className="text-[11px] font-semibold text-stone-300">{s.highlight}</span>
                                    </div>

                                    {/* Perks list */}
                                    <ul className="mt-5 space-y-2 border-t border-stone-800/60 pt-4">
                                        {s.perks.map((perk) => (
                                            <li key={perk} className="flex items-center gap-2 text-xs text-stone-400">
                                                <CheckCircle2
                                                    size={13}
                                                    className="shrink-0 text-amber-500/70"
                                                    strokeWidth={2.5}
                                                />
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Highlights strip ── */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {highlights.map(({ icon: Icon, label, sublabel, bg, border, iconColor }) => (
                        <div
                            key={label}
                            className={`flex items-center gap-4 rounded-2xl border ${border} bg-gradient-to-br ${bg} p-4`}
                        >
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${border} bg-stone-900/50`}
                            >
                                <Icon size={18} className={iconColor} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="font-serif text-lg font-bold text-white">{label}</p>
                                <p className="text-xs text-stone-500">{sublabel}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Bottom CTA banner ── */}
                <div className="mt-8 overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-stone-950 p-8 md:p-10">
                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="font-serif text-2xl font-bold text-white md:text-3xl">
                                Ready to taste the difference?
                            </p>
                            <p className="mt-2 text-sm text-stone-400">
                                Join thousands of happy customers ordering fresh every day.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Link
                                href="/menu"
                                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/50 hover:brightness-110"
                                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)" }}
                            >
                                Order Now
                                <ArrowRight
                                    size={14}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>
                            <Link
                                href="/offers"
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/60 px-6 py-3 text-sm font-semibold text-stone-300 transition-all duration-200 hover:bg-stone-800 hover:text-white"
                            >
                                See Today's Offers
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}