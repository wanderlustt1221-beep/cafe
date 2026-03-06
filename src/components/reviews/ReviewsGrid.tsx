"use client";

// src/components/reviews/ReviewsGrid.tsx
// Handles: 4-per-row grid (same height), view-more modal, add-review (logged-in only)

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Star, Quote, X, MessageSquarePlus,
    ArrowRight, Loader2, Send, CheckCircle2,
    LogIn, Lock,
} from "lucide-react";
import Link from "next/link";
import type { PublicReview } from "@/app/(main)/reviews/page";

// ─── Gradient palette for avatars ────────────────────────────────────────
const GRADS = [
    ["#fbbf24","#f97316"],
    ["#f97316","#ef4444"],
    ["#34d399","#10b981"],
    ["#60a5fa","#3b82f6"],
    ["#a78bfa","#8b5cf6"],
    ["#f472b6","#ec4899"],
    ["#fb923c","#f59e0b"],
    ["#4ade80","#22d3ee"],
    ["#818cf8","#6366f1"],
    ["#38bdf8","#0ea5e9"],
];

const getGrad = (i: number) => GRADS[i % GRADS.length];

function initials(name: string) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function timeAgo(iso: string) {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60)   return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    const d = Math.floor(s / 86400);
    if (d < 7)  return `${d}d ago`;
    if (d < 30) return `${Math.floor(d / 7)}w ago`;
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Stars ────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((s) => (
                <Star
                    key={s} size={size}
                    className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-stone-800 text-stone-800"}
                />
            ))}
        </div>
    );
}

// ─── Interactive star input ───────────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    const [hov, setHov] = useState(0);
    const labels = ["","Poor","Fair","Good","Great","Excellent!"];
    return (
        <div>
            <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => (
                    <button
                        key={s} type="button"
                        onClick={() => onChange(s)}
                        onMouseEnter={() => setHov(s)}
                        onMouseLeave={() => setHov(0)}
                        className="transition-transform hover:scale-125 active:scale-110"
                    >
                        <Star
                            size={28}
                            className={s <= (hov || value)
                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                : "fill-stone-800 text-stone-700"}
                        />
                    </button>
                ))}
            </div>
            {(hov || value) > 0 && (
                <p className="mt-1.5 text-[11px] font-semibold text-amber-400">
                    {labels[hov || value]}
                </p>
            )}
        </div>
    );
}

// ─── Full-review modal ────────────────────────────────────────────────────
function ReviewModal({ review, idx, onClose }: { review: PublicReview; idx: number; onClose: () => void }) {
    const [from, to] = getGrad(idx);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-3xl border border-stone-700/60 bg-[#141418] p-7 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-800 hover:text-white"
                >
                    <X size={15} />
                </button>

                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black text-stone-950 shadow-lg"
                        style={{ backgroundImage: `linear-gradient(135deg,${from},${to})` }}
                    >
                        {initials(review.userName)}
                    </div>
                    <div>
                        <p className="font-serif text-xl font-bold text-white">{review.userName}</p>
                        <div className="mt-1 flex items-center gap-2.5">
                            <Stars rating={review.rating} size={13} />
                            <span className="text-[11px] text-stone-600">{timeAgo(review.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Full comment */}
                <div className="relative mt-5 rounded-xl border border-stone-800/50 bg-stone-900/60 p-5">
                    <Quote size={22} className="absolute -left-1 -top-1 text-stone-800" />
                    <p className="pl-5 text-sm leading-7 text-stone-300">{review.comment}</p>
                </div>

                <p className="mt-3 text-right text-[11px] text-stone-700">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "long", year: "numeric",
                    })}
                </p>
            </div>
        </div>
    );
}

// ─── Add review modal ─────────────────────────────────────────────────────
function AddReviewModal({
    userName,
    onClose,
}: {
    userName: string;
    onClose: () => void;
}) {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const [form, setForm]   = useState({ rating: 0, comment: "" });
    const [loading, setLoading] = useState(false);
    const [done, setDone]   = useState(false);
    const [err, setErr]     = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr("");
        if (!form.rating)               return setErr("Please pick a star rating");
        if (form.comment.trim().length < 10) return setErr("Review must be at least 10 characters");

        setLoading(true);
        try {
            const res  = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userName.trim(),
                    rating:   form.rating,
                    comment:  form.comment.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) { setErr(data.message ?? "Something went wrong"); return; }
            setDone(true);
            startTransition(() => router.refresh());
        } catch {
            setErr("Network error — please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md rounded-3xl border border-stone-700/60 bg-[#141418] p-7 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-800 hover:text-white"
                >
                    <X size={15} />
                </button>

                {done ? (
                    /* ── Success ── */
                    <div className="flex flex-col items-center py-6 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10">
                            <CheckCircle2 size={30} className="text-emerald-400" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white">Thank you!</h3>
                        <p className="mt-2 text-sm text-stone-400">
                            Your review has been submitted successfully.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-2.5 text-sm font-bold text-stone-950 transition-all hover:brightness-110"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    /* ── Form ── */
                    <>
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10">
                                <MessageSquarePlus size={18} className="text-amber-400" strokeWidth={1.8} />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-white">Write a Review</h3>
                                <p className="text-xs text-stone-500">
                                    Posting as <span className="font-semibold text-stone-300">{userName}</span>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} noValidate className="space-y-5">
                            {/* Star rating */}
                            <div>
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-stone-500">
                                    Your Rating *
                                </p>
                                <StarInput
                                    value={form.rating}
                                    onChange={(n) => setForm((f) => ({ ...f, rating: n }))}
                                />
                            </div>

                            {/* Comment */}
                            <div>
                                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-500">
                                    Your Review *
                                </p>
                                <textarea
                                    value={form.comment}
                                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                                    placeholder="Tell us about your order — taste, delivery, experience…"
                                    rows={4}
                                    maxLength={500}
                                    className="w-full resize-none rounded-xl border border-stone-700/60 bg-stone-800/60 px-4 py-3 text-sm text-white placeholder:text-stone-600 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/15"
                                />
                                <p className="mt-1 text-right text-[10px] text-stone-700">
                                    {form.comment.length}/500
                                </p>
                            </div>

                            {/* Error */}
                            {err && (
                                <div className="rounded-xl border border-rose-500/20 bg-rose-500/8 px-4 py-2.5 text-xs text-rose-400">
                                    {err}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 disabled:opacity-60"
                            >
                                {loading
                                    ? <Loader2 size={15} className="animate-spin" />
                                    : <><Send size={14} strokeWidth={2.5} /> Submit Review</>
                                }
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Not-logged-in nudge modal ────────────────────────────────────────────
function LoginNudgeModal({ onClose }: { onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm rounded-3xl border border-stone-700/60 bg-[#141418] p-8 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-800 hover:text-white"
                >
                    <X size={15} />
                </button>

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/8 mx-auto">
                    <Lock size={26} className="text-amber-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Login Required</h3>
                <p className="mt-2 text-sm text-stone-400">
                    You need to be logged in to share a review.
                </p>
                <div className="mt-6 flex gap-3">
                    <Link
                        href="/auth"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110"
                    >
                        <LogIn size={14} strokeWidth={2.5} /> Login
                    </Link>
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-stone-700 bg-stone-800/40 py-3 text-sm font-semibold text-stone-300 transition-all hover:bg-stone-800 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Single review card — fixed height with clamped text ─────────────────
const CLAMP = 120; // characters before "View more"

function ReviewCard({
    review,
    idx,
    onExpand,
}: {
    review: PublicReview;
    idx: number;
    onExpand: () => void;
}) {
    const [from, to] = getGrad(idx);
    const isLong     = review.comment.length > CLAMP;
    const preview    = isLong
        ? review.comment.slice(0, CLAMP).trimEnd() + "…"
        : review.comment;

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-stone-800/60 bg-stone-900/60 p-5 transition-all duration-200 hover:border-stone-700/70 hover:bg-stone-900/80 hover:shadow-lg hover:shadow-black/30">
            {/* Header */}
            <div className="mb-3.5 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-black text-stone-950 shadow-md"
                        style={{ backgroundImage: `linear-gradient(135deg,${from},${to})` }}
                    >
                        {initials(review.userName)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">{review.userName}</p>
                        <p className="text-[10px] text-stone-600">{timeAgo(review.createdAt)}</p>
                    </div>
                </div>
                <Stars rating={review.rating} size={11} />
            </div>

            {/* Comment body — fixed height so all cards align */}
            <div className="relative flex-1">
                <Quote size={16} className="absolute -left-0.5 -top-0.5 text-stone-800" />
                <p className="pl-5 text-[13px] leading-6 text-stone-300">{preview}</p>
            </div>

            {/* View more */}
            {isLong && (
                <button
                    onClick={onExpand}
                    className="mt-2.5 self-start pl-5 text-[11px] font-semibold text-amber-500 transition-colors hover:text-amber-400"
                >
                    View more →
                </button>
            )}

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-stone-800/50 pt-3">
                <span className="rounded-full border border-amber-400/12 bg-amber-400/6 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400/70">
                    ★ {review.rating}.0
                </span>
                <span className="text-[9px] uppercase tracking-widest text-stone-700">Verified</span>
            </div>
        </article>
    );
}

// ─── Main exported component ──────────────────────────────────────────────
export default function ReviewsGrid({ reviews }: { reviews: PublicReview[] }) {
    const [expanded,   setExpanded]   = useState<{ review: PublicReview; idx: number } | null>(null);
    const [showAdd,    setShowAdd]    = useState(false);
    const [showLogin,  setShowLogin]  = useState(false);
    const [loggedUser, setLoggedUser] = useState<string | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Check login status once on mount via /api/auth/me
    useEffect(() => {
        fetch("/api/auth/me", { credentials: "include" })
            .then((r) => r.json())
            .then((d) => {
                if (d.success && d.user?.name) setLoggedUser(d.user.name);
            })
            .catch(() => {})
            .finally(() => setAuthChecked(true));
    }, []);

    const handleAddClick = () => {
        if (!authChecked) return; // still loading
        if (loggedUser)   setShowAdd(true);
        else              setShowLogin(true);
    };

    return (
        <>
            {/* Modals */}
            {expanded && (
                <ReviewModal
                    review={expanded.review}
                    idx={expanded.idx}
                    onClose={() => setExpanded(null)}
                />
            )}
            {showAdd && loggedUser && (
                <AddReviewModal
                    userName={loggedUser}
                    onClose={() => setShowAdd(false)}
                />
            )}
            {showLogin && (
                <LoginNudgeModal onClose={() => setShowLogin(false)} />
            )}

            {/* ── Grid section ── */}
            <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">

                {/* Row header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500">
                            Testimonials
                        </p>
                        <h2 className="mt-1.5 font-serif text-2xl font-bold text-white md:text-3xl">
                            Fresh from our customers
                        </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {reviews.length > 0 && (
                            <span className="text-xs text-stone-600">
                                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                            </span>
                        )}
                        <button
                            onClick={handleAddClick}
                            disabled={!authChecked}
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-stone-950 shadow-md shadow-amber-500/20 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-70"
                        >
                            <MessageSquarePlus size={15} strokeWidth={2.5} />
                            Write a Review
                        </button>
                    </div>
                </div>

                {/* Grid — 2 cols mobile, 4 cols desktop, equal height rows */}
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-800/50 bg-stone-900/30 py-24 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-800 bg-stone-900">
                            <MessageSquarePlus size={26} className="text-stone-700" strokeWidth={1.5} />
                        </div>
                        <p className="font-serif text-xl font-bold text-white">No reviews yet</p>
                        <p className="mt-2 text-sm text-stone-600">Be the first to share your experience!</p>
                        <button
                            onClick={handleAddClick}
                            className="mt-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-bold text-stone-950 transition-all hover:brightness-110"
                        >
                            Write a Review
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3.5 md:gap-4 lg:grid-cols-4">
                        {reviews.map((review, i) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                idx={i}
                                onExpand={() => setExpanded({ review, idx: i })}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Bottom CTA banner ── */}
            <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-stone-800/60 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 p-8 md:p-10">
                    <div
                        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-[0.06] blur-3xl"
                        style={{ background: "radial-gradient(ellipse,#f59e0b,transparent 70%)" }}
                        aria-hidden="true"
                    />
                    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10">
                                <MessageSquarePlus size={20} className="text-amber-400" strokeWidth={1.8} />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold text-white">Share Your Experience</h3>
                                <p className="mt-1 text-sm text-stone-400">
                                    Enjoyed your order? Your honest feedback helps us serve everyone better.
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-3">
                            <button
                                onClick={handleAddClick}
                                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110"
                            >
                                Write a Review
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <Link
                                href="/menu"
                                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/40 px-6 py-3 text-sm font-semibold text-stone-300 transition-all hover:bg-stone-800 hover:text-white"
                            >
                                Explore Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}