"use client";
import Link from "next/link";
import { ArrowRight, Clock, Tag, Flame, Gift, Zap } from "lucide-react";

const offers = [
    {
        badge: "Weekend Deal",
        badgeIcon: Gift,
        emoji: "☕",
        title: "Buy 2 Cold Coffees, Get 1 Free",
        description: "Premium blended cold coffees made fresh. Perfect for sharing or stocking up.",
        tag: "Sat & Sun Only",
        tagIcon: Clock,
        cta: "Grab the Deal",
        href: "/menu",
        accent: "from-amber-500/20 via-orange-500/10 to-transparent",
        border: "border-amber-500/25",
        glow: "rgba(245,158,11,0.2)",
        ctaStyle: "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950",
    },
    {
        badge: "Limited Time",
        badgeIcon: Flame,
        emoji: "🍔",
        title: "Smash Burger + Shake Combo",
        description: "Our best-selling smash burger paired with a thick premium shake. Unbeatable value.",
        tag: "Save ₹60",
        tagIcon: Tag,
        cta: "Order Combo",
        href: "/menu",
        accent: "from-red-500/15 via-orange-500/8 to-transparent",
        border: "border-red-500/20",
        glow: "rgba(239,68,68,0.15)",
        ctaStyle: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    },
    {
        badge: "Daily Special",
        badgeIcon: Zap,
        emoji: "🍕",
        title: "Pizza Night — Any Large for ₹249",
        description: "Every evening from 7 PM. Any large pizza, any topping. While stocks last.",
        tag: "After 7 PM",
        tagIcon: Clock,
        cta: "Order Pizza",
        href: "/menu",
        accent: "from-yellow-500/15 via-amber-500/8 to-transparent",
        border: "border-yellow-500/20",
        glow: "rgba(234,179,8,0.15)",
        ctaStyle: "bg-gradient-to-r from-yellow-400 to-amber-500 text-stone-950",
    },
];

export default function OfferBanner() {
    return (
        <section className="relative overflow-hidden bg-stone-950 py-24">
            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-3xl"
                style={{ background: "radial-gradient(ellipse, #f59e0b 0%, #ea580c 50%, transparent 100%)" }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 md:px-8">

                {/* Section header */}
                <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/8 px-4 py-1.5">
                            <Flame size={12} className="text-red-400" />
                            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-red-400">
                                Hot Deals
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Offers too good{" "}
                            <span
                                className="text-transparent bg-clip-text"
                                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f97316)" }}
                            >
                                to skip
                            </span>
                        </h2>
                        <p className="mt-2 text-stone-400 text-sm">
                            Limited-time deals updated weekly. Order before they're gone.
                        </p>
                    </div>
                    <Link
                        href="/offers"
                        className="group hidden shrink-0 items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/60 px-5 py-3 text-sm font-semibold text-stone-300 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white md:inline-flex"
                    >
                        All Offers
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Offer cards grid */}
                <div className="grid gap-5 md:grid-cols-3">
                    {offers.map((offer, i) => {
                        const BadgeIcon = offer.badgeIcon;
                        const TagIcon = offer.tagIcon;
                        return (
                            <div
                                key={i}
                                className={`group relative flex flex-col overflow-hidden rounded-3xl border ${offer.border} bg-gradient-to-br ${offer.accent} bg-stone-900 p-6 transition-all duration-300 hover:scale-[1.015]`}
                                style={{ boxShadow: "none" }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 48px ${offer.glow}`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                                }}
                            >
                                {/* Badge */}
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-stone-300">
                                        <BadgeIcon size={10} />
                                        {offer.badge}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-800/80 px-3 py-1 text-[11px] font-semibold text-stone-400">
                                        <TagIcon size={10} className="text-amber-500" />
                                        {offer.tag}
                                    </span>
                                </div>

                                {/* Emoji */}
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-stone-800/60 text-4xl shadow-inner">
                                    {offer.emoji}
                                </div>

                                {/* Copy */}
                                <h3 className="font-serif text-xl font-bold leading-snug text-white">
                                    {offer.title}
                                </h3>
                                <p className="mt-2.5 flex-1 text-sm leading-6 text-stone-400">
                                    {offer.description}
                                </p>

                                {/* CTA */}
                                <Link
                                    href={offer.href}
                                    className={`group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-xl ${offer.ctaStyle}`}
                                >
                                    {offer.cta}
                                    <ArrowRight
                                        size={14}
                                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile "All Offers" link */}
                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/offers"
                        className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/60 px-5 py-3 text-sm font-semibold text-stone-300 transition-all duration-200 hover:bg-stone-800 hover:text-white"
                    >
                        View All Offers <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}