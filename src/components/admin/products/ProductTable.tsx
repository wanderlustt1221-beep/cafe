"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
    Pencil, Trash2, Package, CheckCircle2, XCircle,
    Star, AlertTriangle, Loader2, MoreHorizontal,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────
export type ProductRow = {
    _id: string;
    name: string;
    slug?: string;
    category: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    isFeatured: boolean;
    image?: string;
};

type Props = { products: ProductRow[] };

// ─── Delete confirmation dialog ───────────────────────────────────────────
function DeleteDialog({
    name,
    onConfirm,
    onCancel,
    loading,
}: {
    name: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#16161f] p-6 shadow-2xl">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/12">
                    <AlertTriangle size={20} className="text-rose-400" />
                </div>
                <h3 className="font-serif text-base font-bold text-white">Delete Product</h3>
                <p className="mt-2 text-sm text-stone-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-white">"{name}"</span>? This action cannot be undone.
                </p>
                <div className="mt-5 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.04] py-2.5 text-sm font-medium text-stone-300 transition-colors hover:bg-white/[0.07] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:opacity-60"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Empty state ─────────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                <Package size={28} className="text-stone-600" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">No products yet</h3>
            <p className="mt-2 max-w-xs text-sm text-stone-600">
                Add your first product to get started.
            </p>
            <Link
                href="/admin/products/new"
                className="mt-5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-stone-950 transition-all hover:brightness-110"
            >
                Add Product
            </Link>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────
export default function ProductTable({ products: initialProducts }: Props) {
    const router = useRouter();
    const [products, setProducts] = useState<ProductRow[]>(initialProducts);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
    const [search, setSearch] = useState("");

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(deleteTarget._id);
        try {
            const res = await fetch(`/api/products/${deleteTarget._id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message ?? "Failed to delete");
                return;
            }
            setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
            toast.success("Product deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeleting(null);
            setDeleteTarget(null);
        }
    };

    return (
        <>
            {deleteTarget && (
                <DeleteDialog
                    name={deleteTarget.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    loading={deleting === deleteTarget._id}
                />
            )}

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products by name or category…"
                    className="w-full max-w-sm rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2.5 text-sm text-stone-300 placeholder:text-stone-700 focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                />
            </div>

            {filtered.length === 0 ? (
                products.length === 0 ? <EmptyState /> : (
                    <div className="flex items-center justify-center py-16 text-sm text-stone-600">
                        No products match your search.
                    </div>
                )
            ) : (
                <>
                    {/* ── Desktop table ── */}
                    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] md:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    {["Product", "Category", "Price", "Stock", "Available", "Featured", "Actions"].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-stone-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {filtered.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="group transition-colors hover:bg-white/[0.02]"
                                    >
                                        {/* Product */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package size={14} className="text-stone-700" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-stone-200">{product.name}</p>
                                                    {product.slug && (
                                                        <p className="truncate text-[11px] text-stone-600">/{product.slug}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3">
                                            <span className="rounded-full border border-amber-500/20 bg-amber-500/8 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                                                {product.category}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3 font-serif font-bold text-amber-400">
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-4 py-3">
                                            <span className={`font-bold ${product.stock <= 2 ? "text-rose-400" : product.stock <= 5 ? "text-amber-400" : "text-stone-300"}`}>
                                                {product.stock}
                                            </span>
                                        </td>

                                        {/* Available */}
                                        <td className="px-4 py-3">
                                            {product.isAvailable ? (
                                                <CheckCircle2 size={16} className="text-emerald-400" />
                                            ) : (
                                                <XCircle size={16} className="text-stone-600" />
                                            )}
                                        </td>

                                        {/* Featured */}
                                        <td className="px-4 py-3">
                                            {product.isFeatured ? (
                                                <Star size={15} className="fill-amber-400 text-amber-400" />
                                            ) : (
                                                <Star size={15} className="text-stone-700" />
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/products/edit/${product._id}`}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-stone-400 transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-400"
                                                    title="Edit"
                                                >
                                                    <Pencil size={13} strokeWidth={2} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(product)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-stone-400 transition-colors hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile card list ── */}
                    <div className="space-y-3 md:hidden">
                        {filtered.map((product) => (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111118]"
                            >
                                <div className="flex items-center gap-3 p-4">
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Package size={18} className="text-stone-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white">{product.name}</p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2">
                                            <span className="rounded-full border border-amber-500/20 bg-amber-500/8 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                                                {product.category}
                                            </span>
                                            <span className="font-serif text-sm font-bold text-amber-400">
                                                ₹{product.price}
                                            </span>
                                            <span className={`text-xs font-bold ${product.stock <= 2 ? "text-rose-400" : product.stock <= 5 ? "text-amber-400" : "text-stone-500"}`}>
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={`/admin/products/edit/${product._id}`}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-stone-400 hover:text-amber-400"
                                        >
                                            <Pencil size={13} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteTarget(product)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-stone-400 hover:text-rose-400"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 border-t border-white/[0.04] px-4 py-2.5 text-[11px]">
                                    <span className={`flex items-center gap-1 ${product.isAvailable ? "text-emerald-400" : "text-stone-600"}`}>
                                        {product.isAvailable ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                        {product.isAvailable ? "Available" : "Unavailable"}
                                    </span>
                                    {product.isFeatured && (
                                        <span className="flex items-center gap-1 text-amber-400">
                                            <Star size={11} className="fill-amber-400" /> Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Count */}
                    <p className="mt-3 text-right text-[11px] text-stone-700">
                        {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
                    </p>
                </>
            )}
        </>
    );
}