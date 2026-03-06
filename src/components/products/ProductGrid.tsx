"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

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

const ITEMS_PER_PAGE = 12;

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-800/60 bg-stone-900/40 px-6 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-700/60 bg-stone-800/60">
                <ShoppingBag size={28} className="text-stone-500" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-xl font-bold text-white">Nothing here yet</h3>
            <p className="mt-2 max-w-xs text-sm text-stone-500">
                No products match your selection. Try a different category or check back soon.
            </p>
        </div>
    );
}

function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    startItem,
    endItem,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    startItem: number;
    endItem: number;
}) {
    if (totalPages <= 1) return null;

    // Build page number range — show up to 5 pages centered on current
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Result count */}
            <p className="text-xs text-stone-500 sm:text-sm">
                Showing{" "}
                <span className="font-semibold text-stone-300">{startItem}–{endItem}</span>
                {" "}of{" "}
                <span className="font-semibold text-stone-300">{totalItems}</span>
                {" "}items
            </p>

            {/* Page controls */}
            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-700/70 bg-stone-900/60 text-stone-400 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
                >
                    <ChevronLeft size={15} strokeWidth={2.5} />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, i) =>
                    page === "..." ? (
                        <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center text-xs text-stone-600 sm:h-9 sm:w-9">
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 sm:h-9 sm:w-9 sm:text-sm ${currentPage === page
                                    ? "bg-gradient-to-br from-amber-400 to-orange-500 text-stone-950 shadow-md shadow-amber-500/30"
                                    : "border border-stone-700/70 bg-stone-900/60 text-stone-400 hover:border-stone-600 hover:bg-stone-800 hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-stone-700/70 bg-stone-900/60 text-stone-400 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
                >
                    <ChevronRight size={15} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}

export default function ProductGrid({ products }: { products: Product[] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length);

    const paginated = useMemo(
        () => products.slice(startIndex, endIndex),
        [products, startIndex, endIndex]
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Smooth scroll to top of grid on page change
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!products.length) return <EmptyState />;

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {paginated.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={products.length}
                startItem={startIndex + 1}
                endItem={endIndex}
            />
        </div>
    );
}