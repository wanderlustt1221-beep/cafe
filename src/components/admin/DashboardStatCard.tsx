import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

type Props = {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    trendDirection?: TrendDirection;
    accentColor?: "amber" | "emerald" | "blue" | "violet" | "rose";
};

const COLOR_MAP: Record<
    NonNullable<Props["accentColor"]>,
    { iconBg: string; iconText: string; glow: string; border: string; valueBg: string }
> = {
    amber: {
        iconBg: "bg-amber-500/12",
        iconText: "text-amber-400",
        glow: "rgba(245,158,11,0.08)",
        border: "border-amber-500/15",
        valueBg: "from-amber-400 to-orange-400",
    },
    emerald: {
        iconBg: "bg-emerald-500/12",
        iconText: "text-emerald-400",
        glow: "rgba(16,185,129,0.08)",
        border: "border-emerald-500/15",
        valueBg: "from-emerald-400 to-teal-400",
    },
    blue: {
        iconBg: "bg-sky-500/12",
        iconText: "text-sky-400",
        glow: "rgba(14,165,233,0.08)",
        border: "border-sky-500/15",
        valueBg: "from-sky-400 to-blue-400",
    },
    violet: {
        iconBg: "bg-violet-500/12",
        iconText: "text-violet-400",
        glow: "rgba(139,92,246,0.08)",
        border: "border-violet-500/15",
        valueBg: "from-violet-400 to-purple-400",
    },
    rose: {
        iconBg: "bg-rose-500/12",
        iconText: "text-rose-400",
        glow: "rgba(244,63,94,0.08)",
        border: "border-rose-500/15",
        valueBg: "from-rose-400 to-pink-400",
    },
};

const TREND_ICONS: Record<TrendDirection, typeof TrendingUp> = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
};

const TREND_COLORS: Record<TrendDirection, string> = {
    up: "text-emerald-400",
    down: "text-rose-400",
    neutral: "text-stone-500",
};

export default function DashboardStatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendDirection = "neutral",
    accentColor = "amber",
}: Props) {
    const c = COLOR_MAP[accentColor];
    const TrendIcon = TREND_ICONS[trendDirection];

    return (
        <article
            className={`relative overflow-hidden rounded-2xl border ${c.border} bg-[#111118] p-5 transition-all duration-300 hover:bg-[#14141e]`}
            style={{ boxShadow: `0 4px 24px ${c.glow}` }}
        >
            {/* Subtle ambient blob */}
            <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl"
                style={{ background: `radial-gradient(ellipse, ${c.glow.replace("0.08", "0.5")} 0%, transparent 70%)` }}
                aria-hidden="true"
            />

            <div className="relative flex items-start justify-between gap-3">
                {/* Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.iconText}`}>
                    <Icon size={20} strokeWidth={1.8} />
                </div>

                {/* Trend badge */}
                {trend && (
                    <div className={`flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[11px] font-semibold ${TREND_COLORS[trendDirection]}`}>
                        <TrendIcon size={11} strokeWidth={2.5} />
                        {trend}
                    </div>
                )}
            </div>

            <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500">{title}</p>
                <p
                    className={`mt-1.5 font-serif text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${c.valueBg}`}
                >
                    {value}
                </p>
                {description && (
                    <p className="mt-1.5 text-xs text-stone-600">{description}</p>
                )}
            </div>
        </article>
    );
}