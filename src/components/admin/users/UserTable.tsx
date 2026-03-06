"use client";

// src/components/admin/users/UserTable.tsx

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    Search, Users, CheckCircle2, XCircle,
    ShieldOff, ShieldCheck, Phone, Calendar,
    ShoppingBag, Crown, Loader2,
} from "lucide-react";

// ─── Types (aligned with real User schema) ────────────────────────────────
export type UserRow = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "user" | "admin";
    isActive: boolean;
    ordersCount: number;
    createdAt: string;
};

type Props = { users: UserRow[] };

// ─── Role badge ───────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: "user" | "admin" }) {
    if (role === "admin") {
        return (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                <Crown size={8} /> Admin
            </span>
        );
    }
    return (
        <span className="rounded-full border border-stone-700/50 bg-white/[0.03] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-600">
            User
        </span>
    );
}

// ─── Status badge ─────────────────────────────────────────────────────────
function StatusBadge({ isActive }: { isActive: boolean }) {
    if (isActive) {
        return (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={12} strokeWidth={2.5} /> Active
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400">
            <XCircle size={12} strokeWidth={2.5} /> Blocked
        </span>
    );
}

// ─── Avatar initial ───────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
    return (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/25 to-orange-500/25 text-xs font-black text-amber-300 ring-1 ring-amber-500/15">
            {name.trim()[0]?.toUpperCase() ?? "?"}
        </div>
    );
}

// ─── Block / Unblock button ───────────────────────────────────────────────
function ToggleActiveButton({
    user,
    onToggle,
    isLoading,
}: {
    user: UserRow;
    onToggle: () => void;
    isLoading: boolean;
}) {
    // Never allow blocking an admin
    if (user.role === "admin") {
        return (
            <span
                title="Admin accounts cannot be blocked"
                className="cursor-not-allowed text-[11px] text-stone-700"
            >
                —
            </span>
        );
    }

    return (
        <button
            onClick={onToggle}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${user.isActive
                    ? "border-rose-500/20 bg-rose-500/8 text-rose-400 hover:bg-rose-500/15"
                    : "border-emerald-500/20 bg-emerald-500/8 text-emerald-400 hover:bg-emerald-500/15"
                }`}
        >
            {isLoading ? (
                <Loader2 size={11} className="animate-spin" />
            ) : user.isActive ? (
                <ShieldOff size={11} />
            ) : (
                <ShieldCheck size={11} />
            )}
            {user.isActive ? "Block" : "Unblock"}
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────
export default function UserTable({ users: initialUsers }: Props) {
    const [users, setUsers] = useState<UserRow[]>(initialUsers);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState<string | null>(null); // stores _id being toggled

    // Client-side filter
    const visible = users.filter((u) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.phone.includes(q)
        );
    });

    const handleToggle = async (user: UserRow) => {
        setLoading(user._id);
        try {
            const res = await fetch(`/api/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !user.isActive }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message ?? "Failed to update user");
                return;
            }

            // Optimistic update — reflect change immediately
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === user._id ? { ...u, isActive: !user.isActive } : u
                )
            );
            toast.success(user.isActive ? "User blocked" : "User unblocked");
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <>
            {/* Search */}
            <div className="mb-4">
                <div className="relative max-w-sm">
                    <Search
                        size={13}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or phone…"
                        className="w-full rounded-xl border border-white/[0.07] bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-stone-300 placeholder:text-stone-700 focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                    />
                </div>
            </div>

            {visible.length === 0 ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                        <Users size={24} className="text-stone-600" strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-base font-bold text-white">
                        {users.length === 0 ? "No users yet" : "No users match your search"}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                        {users.length === 0
                            ? "Registered customers will appear here."
                            : "Try a different name, email or phone number."}
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table ── */}
                    <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] md:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    {[
                                        "User", "Email", "Phone",
                                        "Orders", "Role", "Status",
                                        "Joined", "Actions",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {visible.map((user) => (
                                    <tr
                                        key={user._id}
                                        className={`transition-colors hover:bg-white/[0.02] ${!user.isActive ? "opacity-60" : ""}`}
                                    >
                                        {/* Name + avatar */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar name={user.name} />
                                                <span className="font-semibold text-stone-200">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-stone-400">
                                            {user.email}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-4 py-3 text-stone-500">
                                            {user.phone || "—"}
                                        </td>

                                        {/* Orders count */}
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 font-serif font-bold text-amber-400">
                                                <ShoppingBag size={11} className="text-amber-500/60" />
                                                {user.ordersCount}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            <RoleBadge role={user.role} />
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <StatusBadge isActive={user.isActive} />
                                        </td>

                                        {/* Joined */}
                                        <td className="px-4 py-3">
                                            <span className="text-[11px] text-stone-600">
                                                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit", month: "short", year: "numeric",
                                                })}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <ToggleActiveButton
                                                user={user}
                                                onToggle={() => handleToggle(user)}
                                                isLoading={loading === user._id}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile cards ── */}
                    <div className="space-y-3 md:hidden">
                        {visible.map((user) => (
                            <div
                                key={user._id}
                                className={`rounded-2xl border border-white/[0.06] bg-[#111118] p-4 transition-opacity ${!user.isActive ? "opacity-60" : ""}`}
                            >
                                {/* Top row */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={user.name} />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-white">{user.name}</p>
                                                <RoleBadge role={user.role} />
                                            </div>
                                            <p className="text-xs text-stone-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <StatusBadge isActive={user.isActive} />
                                </div>

                                {/* Meta row */}
                                <div className="mt-3 grid grid-cols-2 gap-y-1.5 border-t border-white/[0.04] pt-3 text-xs text-stone-500">
                                    <span className="flex items-center gap-1.5">
                                        <Phone size={10} /> {user.phone || "—"}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <ShoppingBag size={10} />
                                        <span className="font-bold text-amber-400">{user.ordersCount}</span> orders
                                    </span>
                                    <span className="col-span-2 flex items-center gap-1.5">
                                        <Calendar size={10} />
                                        Joined {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit", month: "short", year: "numeric",
                                        })}
                                    </span>
                                </div>

                                {/* Action */}
                                {user.role !== "admin" && (
                                    <div className="mt-3">
                                        <ToggleActiveButton
                                            user={user}
                                            onToggle={() => handleToggle(user)}
                                            isLoading={loading === user._id}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Count strip */}
                    <p className="mt-3 text-right text-[11px] text-stone-700">
                        {visible.length} of {users.length} user{users.length !== 1 ? "s" : ""}
                    </p>
                </>
            )}
        </>
    );
}