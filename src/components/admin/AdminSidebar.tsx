"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, Package, ShoppingBag, Users,
    Star, Tag, LogOut, Coffee, Flame, X, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: Star },
    ];

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch { /* ignore */ }
        try { localStorage.removeItem("cafeapp_user"); } catch { /* ignore */ }
        router.push("/auth");
        router.refresh();
    };

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-40 flex w-64 flex-col
                border-r border-white/[0.06] bg-[#0d0d14]
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
        >
            {/* ── Brand ── */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5">
                <Link href="/admin" className="group flex items-center gap-3" onClick={onClose}>
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-110">
                        <Coffee size={17} className="text-stone-950" strokeWidth={2.5} />
                        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500">
                            <Flame size={6} className="text-white" />
                        </span>
                    </div>
                    <div>
                        <p className="font-serif text-[15px] font-bold leading-none text-white">Cafe App</p>
                        <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-500/70">
                            Admin Panel
                        </p>
                    </div>
                </Link>

                {/* Mobile close */}
                <button
                    onClick={onClose}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-white/6 hover:text-white md:hidden"
                    aria-label="Close sidebar"
                >
                    <X size={16} />
                </button>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                    Navigation
                </p>
                <ul className="space-y-1">
                    {navItems.map(({ href, label, icon: Icon, exact }) => {
                        const active = isActive(href, exact);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    onClick={onClose}
                                    className={`
                                        group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                                        transition-all duration-200 outline-none
                                        focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset
                                        ${active
                                            ? "bg-gradient-to-r from-amber-500/15 to-orange-500/8 text-amber-400 shadow-inner"
                                            : "text-stone-400 hover:bg-white/5 hover:text-stone-100"
                                        }
                                    `}
                                >
                                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${active
                                            ? "bg-amber-400/15 text-amber-400"
                                            : "bg-white/4 text-stone-500 group-hover:bg-white/8 group-hover:text-stone-300"
                                        }`}>
                                        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                                    </span>
                                    <span className="flex-1">{label}</span>
                                    {active && (
                                        <ChevronRight size={13} className="text-amber-500/60" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ── Bottom: admin badge + logout ── */}
            <div className="border-t border-white/[0.06] px-3 py-4 space-y-1">
                {/* Admin user chip */}
                <div className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-black text-stone-950">
                        A
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">Admin</p>
                        <p className="text-[10px] text-stone-500">Super Admin</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                        Pro
                    </span>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset disabled:opacity-50"
                >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/4 text-stone-500">
                        <LogOut size={15} strokeWidth={2} />
                    </span>
                    {loggingOut ? "Logging out…" : "Logout"}
                </button>
            </div>
        </aside>
    );
}