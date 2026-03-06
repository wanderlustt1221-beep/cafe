import AuthTabs from "@/components/auth/AuthTabs";
import { Coffee, Star, Zap, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

const brandPoints = [
    { icon: Zap, text: "Order in under 60 seconds" },
    { icon: Star, text: "4.9★ rated by 2,400+ customers" },
    { icon: Clock, text: "Fresh food delivered in 25 min" },
    { icon: ShieldCheck, text: "WhatsApp checkout — no app needed" },
];

type AuthPageProps = {
    searchParams?: Promise<{
        redirect?: string;
    }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
    const params = await searchParams;
    const redirectTo = params?.redirect || "/";

    return (
        <div className="relative min-h-screen overflow-hidden bg-stone-950">
            <div
                className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full opacity-[0.08] blur-3xl"
                style={{ background: "radial-gradient(ellipse, #f59e0b, transparent 70%)" }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl"
                style={{ background: "radial-gradient(ellipse, #ea580c, transparent 70%)" }}
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: "radial-gradient(circle, #d97706 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
                aria-hidden="true"
            />

            <div className="relative mx-auto grid min-h-screen max-w-7xl px-4 py-10 md:grid-cols-2 md:items-center md:gap-12 md:px-8 lg:gap-20">
                <div className="hidden flex-col justify-center md:flex">
                    <Link href="/" className="group mb-12 inline-flex w-fit items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 transition-transform duration-300 group-hover:scale-110">
                            <Coffee size={22} className="text-stone-950" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-serif text-xl font-bold leading-none text-white">Cafe App</p>
                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">
                                Premium Ordering
                            </p>
                        </div>
                    </Link>

                    <h1 className="font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
                        Your favourite cafe,{" "}
                        <span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, #f97316)" }}
                        >
                            now online.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-md text-base leading-relaxed text-stone-400">
                        Fresh food, fast ordering, and a seamless WhatsApp checkout experience.
                        Join thousands of happy customers today.
                    </p>

                    <ul className="mt-10 space-y-4">
                        {brandPoints.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
                                    <Icon size={15} className="text-amber-400" strokeWidth={2} />
                                </div>
                                <span className="text-sm text-stone-300">{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-12 inline-flex w-fit items-center gap-4 rounded-2xl border border-stone-800/70 bg-stone-900/60 p-4">
                        <div className="flex -space-x-2">
                            {["P", "R", "A"].map((initial, i) => (
                                <div
                                    key={i}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-900 bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-stone-950"
                                >
                                    {initial}
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="mt-0.5 text-xs text-stone-400">
                                Loved by <span className="font-semibold text-white">2,400+</span> customers
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-center">
                    <Link href="/" className="group mb-8 inline-flex items-center gap-3 md:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
                            <Coffee size={18} className="text-stone-950" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-serif text-lg font-bold leading-none text-white">Cafe App</p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-500/80">
                                Premium Ordering
                            </p>
                        </div>
                    </Link>

                    <AuthTabs redirectTo={redirectTo} />
                </div>
            </div>
        </div>
    );
}