// src/app/(main)/reviews/page.tsx
// This is a SERVER COMPONENT that fetches real approved reviews from MongoDB
// and passes them to the client component below.

import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ReviewsGrid from "@/components/reviews/ReviewsGrid";
import { Star, BadgeCheck, TrendingUp } from "lucide-react";

// ─── Shape passed to client ───────────────────────────────────────────────
export type PublicReview = {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
};

// ─── Real data from MongoDB ───────────────────────────────────────────────
async function getApprovedReviews(): Promise<PublicReview[]> {
    await connectDB();
    const docs = await Review.find({ isApproved: true })
        .sort({ createdAt: -1 })
        .lean();

    return (docs as any[]).map((r) => ({
        _id:       String(r._id),
        userName:  r.userName ?? "Anonymous",
        rating:    r.rating   ?? 5,
        comment:   r.comment  ?? "",
        createdAt: r.createdAt
            ? new Date(r.createdAt).toISOString()
            : new Date().toISOString(),
    }));
}

// ─── Mini components (server-safe) ───────────────────────────────────────
function StarFill({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={s <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-stone-800 text-stone-800"}
                />
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default async function ReviewsPage() {
    const reviews   = await getApprovedReviews();
    const total     = reviews.length;
    const avgNum    = total > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / total
        : 5;
    const avgRating = avgNum.toFixed(1);

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        return {
            stars: star,
            pct:   total > 0 ? Math.round((count / total) * 100) : 0,
        };
    });

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-stone-950">

                {/* ════════════════════════════════
                    HERO — score + heading + bars
                ════════════════════════════════ */}
                <section className="relative overflow-hidden border-b border-stone-800/50 pb-14 pt-16">

                    {/* Ambient glow */}
                    <div
                        className="pointer-events-none absolute -top-48 left-1/2 h-[500px] w-[900px] -translate-x-1/2 opacity-[0.055] blur-[120px]"
                        style={{ background: "radial-gradient(ellipse, #f59e0b 0%, #ea580c 45%, transparent 75%)" }}
                        aria-hidden="true"
                    />

                    <div className="relative mx-auto max-w-7xl px-4 md:px-8">

                        {/* Top row */}
                        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

                            {/* Left — heading */}
                            <div className="max-w-xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/8 px-4 py-1.5">
                                    <Star size={11} className="fill-amber-400 text-amber-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">
                                        Customer Reviews
                                    </span>
                                </div>
                                <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-[52px]">
                                    What our customers{" "}
                                    <span
                                        className="bg-clip-text text-transparent"
                                        style={{ backgroundImage: "linear-gradient(135deg,#fbbf24,#f97316)" }}
                                    >
                                        are saying
                                    </span>
                                </h1>
                                <p className="mt-3 text-base leading-relaxed text-stone-400">
                                    Real reviews from real customers. Every word here is genuine —
                                    unedited, unfiltered feedback from the people we serve.
                                </p>

                                {/* Trust pills */}
                                <div className="mt-5 flex flex-wrap items-center gap-4">
                                    {[
                                        { icon: BadgeCheck, text: "All from verified customers" },
                                        { icon: TrendingUp,  text: `${avgRating}★ average rating` },
                                    ].map(({ icon: Icon, text }) => (
                                        <div key={text} className="flex items-center gap-1.5 text-xs text-stone-500">
                                            <Icon size={12} className="text-amber-500/60" strokeWidth={2} />
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — score card */}
                            <div className="w-full shrink-0 md:w-52">
                                <div className="rounded-2xl border border-stone-800/70 bg-stone-900/70 p-5">
                                    {/* Big number */}
                                    <div className="mb-3 flex items-end gap-2">
                                        <p className="font-serif text-6xl font-black leading-none text-white">
                                            {avgRating}
                                        </p>
                                        <p className="mb-1.5 text-xs text-stone-600">/ 5</p>
                                    </div>
                                    <StarFill rating={Math.round(avgNum)} size={16} />
                                    <p className="mt-2 text-[11px] text-stone-600">
                                        {total > 0 ? `${total} review${total !== 1 ? "s" : ""}` : "Be the first!"}
                                    </p>

                                    {/* Breakdown bars */}
                                    {total > 0 && (
                                        <div className="mt-4 space-y-1.5">
                                            {ratingBreakdown.map(({ stars, pct }) => (
                                                <div key={stars} className="flex items-center gap-2">
                                                    <span className="w-3 shrink-0 text-right text-[10px] font-bold text-stone-600">
                                                        {stars}
                                                    </span>
                                                    <Star size={7} className="shrink-0 fill-amber-400 text-amber-400" />
                                                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-800">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="w-6 shrink-0 text-[9px] text-stone-700">
                                                        {pct}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    GRID + MODALS  (client island)
                ════════════════════════════════ */}
                <ReviewsGrid reviews={reviews} />

            </main>
            <Footer />
        </>
    );
}