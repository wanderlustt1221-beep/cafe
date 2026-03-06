"use client";

import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Star, Flame, BadgeCheck } from "lucide-react";

type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    isAvailable: boolean;
};

// Deterministic "badges" based on product id so they're stable across renders
function getProductBadge(id: string): { label: string; icon: typeof Flame; color: string } | null {
    const n = parseInt(id.slice(-2), 16) % 4;
    if (n === 0) return { label: "Best Seller", icon: Flame, color: "bg-red-500/90 text-white" };
    if (n === 1) return { label: "Chef's Pick", icon: Star, color: "bg-amber-400/90 text-stone-950" };
    if (n === 2) return { label: "Popular", icon: BadgeCheck, color: "bg-orange-500/90 text-white" };
    return null;
}

export default function ProductCard({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const isUnavailable = !product.isAvailable || product.stock <= 0;
    const badge = getProductBadge(product._id);

    const handleAddToCart = () => {
        if (isUnavailable) {
            toast.error("This item is currently unavailable");
            return;
        }
        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            stock: product.stock,
            category: product.category,
        });
        toast.success(`${product.name} added to cart! 🛒`);
    };

    return (
        <article
            className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-stone-900 transition-all duration-300 sm:rounded-3xl ${isUnavailable
                    ? "border-stone-800/40 opacity-70"
                    : "border-stone-800/70 hover:border-stone-700 hover:shadow-xl hover:shadow-black/40"
                }`}
        >
            {/* ── Image area ── */}
            <div className="relative h-36 w-full shrink-0 overflow-hidden bg-stone-800 sm:h-44 md:h-48">
                <img
                    src={product.image}
                    alt={product.name}
                    className={`h-full w-full object-cover transition-transform duration-500 ${isUnavailable ? "grayscale-[40%]" : "group-hover:scale-[1.06]"
                        }`}
                    loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

                {/* Out of stock overlay */}
                {isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-950/55">
                        <span className="rounded-full border border-stone-600 bg-stone-900/90 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-stone-400">
                            Unavailable
                        </span>
                    </div>
                )}

                {/* Badge — top left */}
                {badge && !isUnavailable && (
                    <div className={`absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg sm:px-2.5 sm:text-[11px] ${badge.color}`}>
                        <badge.icon size={9} strokeWidth={3} />
                        {badge.label}
                    </div>
                )}

                {/* Price — bottom left, overlapping image on mobile */}
                <div className="absolute bottom-2 left-2.5 sm:hidden">
                    <span className="rounded-lg bg-stone-950/80 px-2 py-0.5 font-serif text-base font-bold text-amber-400 backdrop-blur-sm">
                        ₹{product.price}
                    </span>
                </div>
            </div>

            {/* ── Content area ── */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">
                {/* Category + stock row */}
                <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="truncate rounded-full border border-amber-400/20 bg-amber-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400/80 sm:text-[11px]">
                        {product.category}
                    </span>
                    {product.stock > 0 && product.isAvailable ? (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-400 sm:text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            In Stock
                        </span>
                    ) : (
                        <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-red-400 sm:text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Name */}
                <h3 className="line-clamp-1 font-serif text-sm font-bold leading-snug text-white sm:text-base md:text-[1.05rem]">
                    {product.name}
                </h3>

                {/* Description — hidden on very small, 1 line on sm+ */}
                <p className="mt-1 hidden line-clamp-1 text-[11px] leading-5 text-stone-500 sm:block sm:text-xs">
                    {product.description}
                </p>

                {/* Price + CTA */}
                <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Price — hidden on mobile (shown in image overlay) */}
                    <p className="hidden font-serif text-lg font-bold text-amber-400 sm:block md:text-xl">
                        ₹{product.price}
                    </p>

                    {/* Mobile: price visible again in CTA row since overlay is sm:hidden */}
                    <p className="font-serif text-sm font-bold text-amber-400 sm:hidden">
                        ₹{product.price}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        disabled={isUnavailable}
                        aria-label={`Add ${product.name} to cart`}
                        className={`group/btn flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all duration-200 sm:gap-2 sm:rounded-xl sm:px-4 sm:text-xs ${isUnavailable
                                ? "cursor-not-allowed border border-stone-700 bg-stone-800 text-stone-600"
                                : "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-md shadow-amber-500/20 hover:brightness-110 hover:shadow-amber-500/40 active:scale-95"
                            }`}
                    >
                        <ShoppingCart
                            size={12}
                            strokeWidth={2.5}
                            className={isUnavailable ? "" : "transition-transform duration-200 group-hover/btn:scale-110"}
                        />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>
        </article>
    );
}