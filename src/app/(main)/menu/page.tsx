import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { Search, SlidersHorizontal, ChevronDown, Zap, Clock, ShieldCheck } from "lucide-react";

async function getProducts() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`, {
            cache: "no-store",
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        return data?.products || [];
    } catch (error) {
        console.error("PRODUCT_FETCH_ERROR:", error);
        return [];
    }
}

const categories = ["All", "Coffee", "Burgers", "Pizza", "Shakes", "Snacks", "Combos"];

const trustBadges = [
    { icon: Zap, label: "Fast Delivery" },
    { icon: Clock, label: "Open Until 11 PM" },
    { icon: ShieldCheck, label: "Fresh Ingredients" },
];

export default async function MenuPage() {

    const products = await getProducts();

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-stone-950">

                {/* Hero */}
                <section className="relative overflow-hidden border-b border-stone-800/60 bg-stone-950 pb-8 pt-14">

                    <div
                        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-2/3 -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
                        style={{ background: "radial-gradient(ellipse, #f59e0b 0%, #ea580c 60%, transparent 100%)" }}
                    />

                    <div className="relative mx-auto max-w-7xl px-4 md:px-8">

                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-4 py-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                                        Our Menu
                                    </span>
                                </div>

                                <h1 className="font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                    Explore Our Best Items
                                </h1>

                                <p className="mt-2 max-w-xl text-sm text-stone-400 md:text-base">
                                    Coffee, burgers, pizza, sandwiches, shakes and more — crafted fresh, delivered fast.
                                </p>
                            </div>

                            {/* Trust badges */}
                            <div className="hidden shrink-0 flex-col items-end gap-2 md:flex">
                                {trustBadges.map(({ icon: Icon, label }) => (
                                    <span key={label} className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                                        <Icon size={12} className="text-amber-500/70" strokeWidth={2.5} />
                                        {label}
                                    </span>
                                ))}
                            </div>

                        </div>

                        {/* Controls */}
                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <div className="relative w-full sm:max-w-xs">
                                <Search
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Search menu items..."
                                    readOnly
                                    className="w-full rounded-xl border border-stone-700/70 bg-stone-900/60 py-2.5 pl-9 pr-4 text-sm text-stone-400"
                                />
                            </div>

                            <div className="flex items-center gap-2">

                                <button className="flex items-center gap-2 rounded-xl border border-stone-700/70 bg-stone-900/60 px-3.5 py-2.5 text-xs text-stone-400">
                                    <SlidersHorizontal size={13} />
                                    <span className="hidden sm:inline">Sort</span>
                                    <ChevronDown size={12} />
                                </button>

                                <span className="rounded-xl border border-stone-800/60 bg-stone-900/40 px-3.5 py-2.5 text-xs text-stone-500">
                                    <span className="font-semibold text-stone-300">{products.length}</span> items
                                </span>

                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">

                            {categories.map((cat, i) => (

                                <button
                                    key={cat}
                                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                                        i === 0
                                            ? "border-amber-500/40 bg-amber-400/12 text-amber-400"
                                            : "border-stone-700/70 bg-stone-900/50 text-stone-400"
                                    }`}
                                >
                                    {cat}
                                </button>

                            ))}

                        </div>

                    </div>

                </section>

                {/* Product Grid */}
                <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-12">

                    <ProductGrid products={products} />

                </section>

            </main>

            <Footer />
        </>
    );
}