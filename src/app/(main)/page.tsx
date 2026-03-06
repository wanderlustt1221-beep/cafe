import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import OfferBanner from "@/components/home/OfferBanner";
import { ArrowRight, Star, MessageCircle, Phone } from "lucide-react";

// ─── Categories strip ──────────────────────────────────────────────────────
const categories = [
    { emoji: "☕", label: "Coffee", count: "12 items", href: "/menu" },
    { emoji: "🍔", label: "Burgers", count: "8 items", href: "/menu" },
    { emoji: "🍕", label: "Pizza", count: "10 items", href: "/menu" },
    { emoji: "🥤", label: "Shakes", count: "7 items", href: "/menu" },
    { emoji: "🍟", label: "Snacks", count: "9 items", href: "/menu" },
    { emoji: "🎁", label: "Combos", count: "6 deals", href: "/menu" },
];

function CategoriesStrip() {
    return (
        <section className="bg-stone-950 py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">
                            Explore
                        </p>
                        <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
                            What are you craving?
                        </h2>
                    </div>
                    <Link
                        href="/menu"
                        className="group hidden items-center gap-1.5 text-sm font-semibold text-stone-400 transition-colors hover:text-amber-400 md:inline-flex"
                    >
                        Full Menu <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {categories.map(({ emoji, label, count, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="group flex flex-col items-center gap-2.5 rounded-2xl border border-stone-800/70 bg-stone-900/50 p-4 text-center transition-all duration-200 hover:border-amber-500/30 hover:bg-stone-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-stone-700/50 bg-stone-800 text-2xl shadow-inner transition-transform duration-200 group-hover:scale-110">
                                {emoji}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{label}</p>
                                <p className="text-[10px] text-stone-500">{count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Trust strip ──────────────────────────────────────────────────────────
const trustItems = [
    { emoji: "🌿", stat: "100%", label: "Fresh Ingredients" },
    { emoji: "⭐", stat: "4.9/5", label: "Customer Rating" },
    { emoji: "🛵", stat: "25 min", label: "Avg Delivery Time" },
    { emoji: "📱", stat: "0 Apps", label: "WhatsApp Checkout" },
    { emoji: "🎉", stat: "2,400+", label: "Happy Customers" },
];

function TrustStrip() {
    return (
        <section className="border-y border-stone-800/60 bg-stone-900/40 py-10">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-between">
                    {trustItems.map(({ emoji, stat, label }) => (
                        <div key={label} className="flex items-center gap-3">
                            <span className="text-2xl">{emoji}</span>
                            <div>
                                <p className="font-serif text-lg font-bold text-white leading-none">{stat}</p>
                                <p className="mt-0.5 text-[11px] font-medium text-stone-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Testimonials strip ───────────────────────────────────────────────────
const reviews = [
    {
        name: "Priya S.",
        location: "Sikar",
        text: "Best cold coffee in the area. The WhatsApp ordering is so convenient — no app needed!",
        stars: 5,
    },
    {
        name: "Rahul M.",
        location: "Danta",
        text: "Smash burger is absolutely fire 🔥. Delivery was hot and arrived in under 30 minutes.",
        stars: 5,
    },
    {
        name: "Ananya K.",
        location: "Sikar",
        text: "Love the combo deals. The UI is so smooth — feels like a proper branded ordering app.",
        stars: 5,
    },
];

function TestimonialsStrip() {
    return (
        <section className="bg-stone-950 py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">
                        Customers Love Us
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
                        Don't just take our word for it
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {reviews.map(({ name, location, text, stars }) => (
                        <div
                            key={name}
                            className="rounded-2xl border border-stone-800/60 bg-stone-900/50 p-5"
                        >
                            <div className="mb-3 flex gap-0.5">
                                {[...Array(stars)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={13}
                                        className="fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-sm leading-7 text-stone-300">"{text}"</p>
                            <div className="mt-4 flex items-center gap-2.5 border-t border-stone-800/60 pt-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-stone-950">
                                    {name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{name}</p>
                                    <p className="text-[11px] text-stone-500">{location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── WhatsApp CTA strip ───────────────────────────────────────────────────
function WhatsAppCTAStrip() {
    return (
        <section className="bg-stone-950 pb-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-stone-800/60 bg-gradient-to-br from-stone-900 to-stone-950 p-8 md:p-12">
                    {/* Glow */}
                    <div
                        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl"
                        style={{ background: "radial-gradient(ellipse, #25D366, transparent 70%)" }}
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full opacity-8 blur-2xl"
                        style={{ background: "radial-gradient(ellipse, #f59e0b, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-lg">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#25D366]/25 bg-[#25D366]/8 px-3 py-1.5">
                                <MessageCircle size={12} className="text-[#25D366]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#25D366]">
                                    WhatsApp Checkout
                                </span>
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">
                                Order in seconds —{" "}
                                <span className="text-[#25D366]">no app install needed</span>
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-stone-400">
                                Simply add to cart, proceed to checkout, and confirm your order on WhatsApp.
                                Our team receives it instantly and starts preparing right away.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-stone-950 shadow-lg transition-all duration-300 hover:brightness-110"
                                style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f97316)" }}
                            >
                                Start Your Order
                                <ArrowRight size={14} />
                            </Link>
                            <a
                                href="tel:+919999999999"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800/60 px-6 py-3 text-sm font-semibold text-stone-300 transition-all duration-200 hover:bg-stone-800 hover:text-white"
                            >
                                <Phone size={14} />
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                {/* 1. Hero — strong above-the-fold */}
                <HeroSection />

                {/* 2. Categories — quick browse / wayfinding */}
                <CategoriesStrip />

                {/* 3. Trust — social proof numbers */}
                <TrustStrip />

                {/* 4. Features / How It Works */}
                <FeaturesSection />

                {/* 5. Offers — conversion section */}
                <OfferBanner />

                {/* 6. Testimonials — credibility */}
                <TestimonialsStrip />

                {/* 7. WhatsApp CTA — final conversion nudge */}
                <WhatsAppCTAStrip />
            </main>
            <Footer />
        </>
    );
}