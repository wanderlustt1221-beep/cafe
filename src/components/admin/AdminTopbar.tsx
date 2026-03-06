"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Search, ShieldCheck } from "lucide-react";

// ─── Page title map ───────────────────────────────────────────────────────
const PAGE_META: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Dashboard", subtitle: "Overview of your cafe operations" },
    "/admin/products": { title: "Products", subtitle: "Manage your menu items and stock" },
    "/admin/orders": { title: "Orders", subtitle: "View and manage customer orders" },
    "/admin/users": { title: "Users", subtitle: "Registered customer accounts" },
    "/admin/reviews": { title: "Reviews", subtitle: "Customer feedback and ratings" },
    "/admin/offers": { title: "Offers", subtitle: "Promotions and discount deals" },
};

function getPageMeta(pathname: string) {
    return (
        PAGE_META[pathname] ??
        PAGE_META[Object.keys(PAGE_META).find((k) => pathname.startsWith(k) && k !== "/admin") ?? ""] ??
        { title: "Admin", subtitle: "Cafe App Admin Panel" }
    );
}

type Props = { onMenuClick: () => void };

export default function AdminTopbar({ onMenuClick }: Props) {
    const pathname = usePathname();
    const { title, subtitle } = getPageMeta(pathname);

    return (
        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#0d0d14]/80 px-4 py-3 backdrop-blur-md md:px-6">

            {/* Left: hamburger (mobile) + page info */}
            <div className="flex items-center gap-3 min-w-0">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-stone-400 transition-colors hover:bg-white/6 hover:text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={17} strokeWidth={2} />
                </button>

                {/* Breadcrumb / title */}
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="font-serif text-lg font-bold leading-none text-white md:text-xl">
                            {title}
                        </h1>
                    </div>
                    <p className="mt-0.5 hidden truncate text-[11px] text-stone-500 sm:block">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Right: search shell + admin badge */}
            <div className="flex items-center gap-2 md:gap-3">

                {/* Search shell — desktop only */}
                <div className="relative hidden md:block">
                    <Search
                        size={13}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-600"
                        strokeWidth={2}
                    />
                    <input
                        type="text"
                        readOnly
                        placeholder="Search…"
                        className="w-44 cursor-default rounded-xl border border-white/[0.07] bg-white/[0.04] py-2 pl-8 pr-3 text-xs text-stone-500 placeholder:text-stone-700 focus:outline-none lg:w-56"
                        aria-label="Search (coming soon)"
                    />
                </div>

                {/* Notification bell */}
                <button
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-stone-500 transition-colors hover:bg-white/6 hover:text-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    aria-label="Notifications"
                >
                    <Bell size={15} strokeWidth={2} />
                    {/* Notification dot */}
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_1px_rgba(251,191,36,0.6)]" />
                </button>

                {/* Admin badge */}
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-black text-stone-950 shadow-sm">
                        A
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-semibold leading-none text-stone-200">Admin</p>
                    </div>
                    <ShieldCheck size={13} className="hidden text-amber-400 sm:block" strokeWidth={2.5} />
                </div>
            </div>
        </header>
    );
}