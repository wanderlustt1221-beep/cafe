"use client";

// src/components/shared/Navbar.tsx
// Updated: admin panel link shown when user.role === "admin"
// + InstallPwaButton rendered at end of component
// All existing code preserved exactly — only additive changes.

import Link from "next/link";
import { ShoppingCart, Coffee, Menu, X, Flame, LogOut, Loader2, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import InstallPwaButton from "@/components/shared/InstallPwaButton";

// ─── Types ────────────────────────────────────────────────────────────────
type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
};

type AuthState = "loading" | "authenticated" | "unauthenticated";

// ─── Nav links ────────────────────────────────────────────────────────────
const navLinks = [
    { href: "/",            label: "Home" },
    { href: "/menu",        label: "Menu" },
    { href: "/track-order", label: "Track Orders" },
    { href: "/reviews",     label: "Reviews" },
    { href: "/contact",     label: "Contact" },
];

function getFirstName(name: string): string {
    return name.split(" ")[0] ?? name;
}

// ─── Component ────────────────────────────────────────────────────────────
export default function Navbar() {
    const totalItems = useCartStore((state) => state.getTotalItems());
    const [isOpen,     setIsOpen]     = useState(false);
    const [mounted,    setMounted]    = useState(false);
    const [scrolled,   setScrolled]   = useState(false);
    const [authState,  setAuthState]  = useState<AuthState>("loading");
    const [user,       setUser]       = useState<AuthUser | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);
    const router = useRouter();

    // ── Fetch current session ─────────────────────────────────────────────
    const fetchMe = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    setAuthState("authenticated");
                    try {
                        localStorage.setItem(
                            "cafeapp_user",
                            JSON.stringify({
                                name:    data.user.name,
                                email:   data.user.email,
                                phone:   data.user.phone   ?? "",
                                address: data.user.address ?? "",
                            })
                        );
                    } catch { /* ignore */ }
                    return;
                }
            }
        } catch { /* treat as unauthenticated */ }
        setUser(null);
        setAuthState("unauthenticated");
        try { localStorage.removeItem("cafeapp_user"); } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchMe();
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchMe]);

    // ── Logout ────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        setLoggingOut(true);
        setIsOpen(false);
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch { /* ignore */ }
        try { localStorage.removeItem("cafeapp_user"); } catch { /* ignore */ }
        setUser(null);
        setAuthState("unauthenticated");
        setLoggingOut(false);
        router.push("/");
        router.refresh();
    };

    // ── Desktop auth area ─────────────────────────────────────────────────
    const renderDesktopAuth = () => {
        if (authState === "loading") {
            return (
                <div className="hidden h-9 w-9 items-center justify-center md:flex">
                    <Loader2 size={15} className="animate-spin text-stone-600" />
                </div>
            );
        }

        if (authState === "authenticated" && user) {
            return (
                <div className="hidden items-center gap-2 md:flex">
                    {/* Admin panel link — only for admins */}
                    {user.role === "admin" && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 transition-all duration-200 hover:border-amber-500/60 hover:bg-amber-500/20 hover:text-amber-300"
                        >
                            <LayoutDashboard size={13} strokeWidth={2.5} />
                            Admin
                        </Link>
                    )}

                    {/* Avatar + name chip */}
                    <div className="flex items-center gap-2 rounded-lg border border-stone-700/60 bg-stone-900/60 px-3 py-1.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-black text-stone-950 shadow-sm">
                            {getFirstName(user.name)[0].toUpperCase()}
                        </div>
                        <span className="max-w-[90px] truncate text-sm font-semibold text-stone-200">
                            {getFirstName(user.name)}
                        </span>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        aria-label="Logout"
                        className="flex items-center gap-1.5 rounded-lg border border-stone-700/70 bg-stone-900/60 px-3 py-2 text-sm font-medium text-stone-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loggingOut
                            ? <Loader2 size={14} className="animate-spin" />
                            : <LogOut size={14} strokeWidth={2} />
                        }
                        <span className="hidden lg:inline">Logout</span>
                    </button>
                </div>
            );
        }

        // Unauthenticated
        return (
            <Link
                href="/auth"
                className="hidden rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-300 transition-all duration-200 hover:border-amber-500/60 hover:bg-stone-800 hover:text-white md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
                Sign In
            </Link>
        );
    };

    // ── Mobile auth section ───────────────────────────────────────────────
    const renderMobileAuth = () => {
        if (authState === "loading") {
            return (
                <div className="flex items-center justify-center py-3">
                    <Loader2 size={15} className="animate-spin text-stone-600" />
                </div>
            );
        }

        if (authState === "authenticated" && user) {
            return (
                <>
                    {/* Admin link — mobile */}
                    {user.role === "admin" && (
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm font-bold text-amber-400 transition-all duration-200 hover:bg-amber-500/15"
                        >
                            <LayoutDashboard size={15} strokeWidth={2.5} />
                            Admin Panel
                        </Link>
                    )}

                    {/* User info block */}
                    <div className="flex items-center gap-3 rounded-xl border border-stone-800/60 bg-stone-800/30 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-stone-950 shadow-sm">
                            {getFirstName(user.name)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">{user.name}</p>
                            <p className="truncate text-[11px] text-stone-500">{user.email}</p>
                        </div>
                    </div>

                    {/* Logout row */}
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loggingOut
                            ? <Loader2 size={14} className="animate-spin" />
                            : <LogOut size={14} strokeWidth={2} />
                        }
                        Logout
                    </button>
                </>
            );
        }

        // Unauthenticated
        return (
            <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-300 transition-all duration-200 hover:bg-stone-800/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
            >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50 transition-colors group-hover:bg-amber-400" />
                Sign In
            </Link>
        );
    };

    return (
        <>
            {/* Announcement bar */}
            <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-widest text-stone-900">
                🔥 Free delivery on orders above ₹499
            </div>

            <header
                className={`sticky top-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "border-b border-stone-800/80 bg-stone-950/95 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                        : "border-b border-stone-800/40 bg-stone-950/80 backdrop-blur-md"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">

                    {/* ── Logo ── */}
                    <Link
                        href="/"
                        className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                        aria-label="Cafe App Home"
                    >
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-amber-500/50">
                            <Coffee size={20} className="text-stone-950" strokeWidth={2.5} />
                            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 shadow shadow-red-500/50">
                                <Flame size={8} className="text-white" />
                            </span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-serif text-lg font-bold leading-none tracking-tight text-white transition-colors group-hover:text-amber-300">
                                Cafe App
                            </p>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-500/80">
                                Premium Ordering
                            </p>
                        </div>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="group relative rounded-lg px-3 py-2 text-sm font-medium text-stone-300 outline-none transition-colors duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-950"
                            >
                                <span className="relative z-10">{label}</span>
                                <span className="absolute inset-0 rounded-lg bg-stone-800/0 transition-colors duration-200 group-hover:bg-stone-800/60" />
                                <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-amber-400 transition-all duration-300 group-hover:w-4/5" />
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right actions ── */}
                    <div className="flex items-center gap-2 md:gap-3">

                        {/* Desktop auth */}
                        {renderDesktopAuth()}

                        {/* Cart */}
                        <Link
                            href="/cart"
                            aria-label={`Cart with ${mounted ? totalItems : 0} items`}
                            className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-700/80 bg-stone-900/60 text-stone-300 shadow-inner transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-800 hover:text-amber-400 hover:shadow-amber-500/10 outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                            <ShoppingCart
                                size={18}
                                className="transition-transform duration-300 group-hover:scale-110"
                                strokeWidth={2}
                            />
                            {mounted && totalItems > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 animate-[pop_0.3s_ease] items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-1 text-[10px] font-extrabold leading-none text-stone-950 shadow-lg shadow-amber-500/40">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-700 text-stone-300 transition-all duration-200 hover:border-stone-600 hover:bg-stone-800 hover:text-white md:hidden outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                            aria-controls="mobile-menu"
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                        >
                            <span className={`transition-all duration-300 ${isOpen ? "absolute rotate-90 scale-90 opacity-0" : "rotate-0 scale-100 opacity-100"}`}>
                                <Menu size={20} />
                            </span>
                            <span className={`transition-all duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "absolute -rotate-90 scale-90 opacity-0"}`}>
                                <X size={20} />
                            </span>
                        </button>
                    </div>
                </div>

                {/* ── Mobile menu ── */}
                <div
                    id="mobile-menu"
                    className={`overflow-hidden border-t border-stone-800/60 bg-stone-950 transition-all duration-500 ease-in-out md:hidden ${
                        isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                >
                    <div className="flex flex-col gap-1 px-4 py-4">

                        {/* Nav links */}
                        {navLinks.map(({ href, label }, index) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-300 transition-all duration-200 hover:bg-stone-800/80 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50 transition-colors group-hover:bg-amber-400" />
                                {label}
                            </Link>
                        ))}

                        <div className="my-2 h-px bg-stone-800/80" />

                        {/* Mobile auth */}
                        {renderMobileAuth()}

                        <div className="my-1 h-px bg-stone-800/80" />

                        {/* Cart */}
                        <Link
                            href="/cart"
                            onClick={() => setIsOpen(false)}
                            className="mt-1 flex items-center justify-between rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3 text-sm font-semibold text-amber-400 outline-none transition-all duration-200 hover:from-amber-500/20 hover:to-orange-500/20 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingCart size={16} />
                                View Cart
                            </span>
                            {mounted && totalItems > 0 && (
                                <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-stone-950">
                                    {totalItems} items
                                </span>
                            )}
                        </Link>

                        {/* Order CTA */}
                        <Link
                            href="/menu"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 outline-none transition-all duration-200 hover:brightness-110 hover:shadow-amber-500/40 focus-visible:ring-2 focus-visible:ring-amber-400"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── PWA install prompt — global, renders once ── */}
            <InstallPwaButton />

            <style jsx global>{`
                @keyframes pop {
                    0%   { transform: scale(0.5); opacity: 0; }
                    70%  { transform: scale(1.2); }
                    100% { transform: scale(1);   opacity: 1; }
                }
            `}</style>
        </>
    );
}