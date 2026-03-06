"use client";

// src/components/shared/InstallPwaButton.tsx
// Shows a polished install prompt when the browser's beforeinstallprompt fires.
// Completely hidden if the app is already installed (standalone) or if the
// browser does not support the install prompt.

import { useEffect, useState } from "react";
import { Download, X, Coffee, Smartphone } from "lucide-react";

// Browser install prompt event (non-standard, hence manual typing)
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ─── Storage key — dismiss once per session ───────────────────────────────
const DISMISS_KEY = "cafeapp_pwa_dismissed";

export default function InstallPwaButton() {
    const [prompt,    setPrompt]    = useState<BeforeInstallPromptEvent | null>(null);
    const [visible,   setVisible]   = useState(false);
    const [installing, setInstalling] = useState(false);
    const [installed,  setInstalled]  = useState(false);

    useEffect(() => {
        // Already installed (running in standalone) — never show
        if (window.matchMedia("(display-mode: standalone)").matches) return;
        // User already dismissed this session
        if (sessionStorage.getItem(DISMISS_KEY)) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setPrompt(e as BeforeInstallPromptEvent);
            // Small delay so it doesn't pop immediately on page load
            setTimeout(() => setVisible(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Also detect if installed after the fact
        window.addEventListener("appinstalled", () => {
            setVisible(false);
            setInstalled(true);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!prompt) return;
        setInstalling(true);
        try {
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            if (outcome === "accepted") {
                setInstalled(true);
            }
        } catch { /* ignore */ }
        setVisible(false);
        setInstalling(false);
    };

    const handleDismiss = () => {
        setVisible(false);
        try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    };

    if (!visible || installed) return null;

    return (
        <>
            {/* ── Bottom sheet (mobile-first) ── */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.35s_cubic-bezier(0.16,1,0.3,1)] px-4 pb-safe-area-inset-bottom md:bottom-6 md:left-auto md:right-6 md:max-w-sm"
                role="dialog"
                aria-label="Install Cafe App"
            >
                {/* Card */}
                <div className="relative overflow-hidden rounded-t-3xl border border-stone-700/60 bg-[#13131a] shadow-2xl shadow-black/60 md:rounded-3xl">

                    {/* Amber glow */}
                    <div
                        className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full opacity-[0.12] blur-3xl"
                        style={{ background: "radial-gradient(ellipse, #f59e0b, transparent 70%)" }}
                        aria-hidden="true"
                    />

                    {/* Dismiss */}
                    <button
                        onClick={handleDismiss}
                        className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-xl text-stone-500 transition-colors hover:bg-stone-800 hover:text-stone-300"
                        aria-label="Dismiss install prompt"
                    >
                        <X size={14} />
                    </button>

                    <div className="relative p-5 pb-6">
                        {/* Top row — icon + text */}
                        <div className="mb-4 flex items-center gap-4">
                            {/* App icon */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                                <Coffee size={24} className="text-stone-950" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="font-serif text-[17px] font-bold leading-tight text-white">
                                    Add to Home Screen
                                </p>
                                <p className="mt-0.5 text-xs text-stone-400">
                                    Cafe App · Fast. Fresh. Premium.
                                </p>
                            </div>
                        </div>

                        {/* Feature pills */}
                        <div className="mb-5 flex flex-wrap gap-2">
                            {[
                                "⚡ 60-sec ordering",
                                "🔔 Order updates",
                                "📵 Works offline",
                            ].map((f) => (
                                <span
                                    key={f}
                                    className="rounded-full border border-stone-700/60 bg-stone-800/50 px-3 py-1 text-[11px] font-medium text-stone-300"
                                >
                                    {f}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleInstall}
                            disabled={installing}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 hover:shadow-amber-500/40 disabled:opacity-70"
                        >
                            {installing ? (
                                <>
                                    <Smartphone size={16} className="animate-bounce" />
                                    Installing…
                                </>
                            ) : (
                                <>
                                    <Download size={16} strokeWidth={2.5} />
                                    Install App — It's Free
                                </>
                            )}
                        </button>

                        <p className="mt-2.5 text-center text-[10px] text-stone-600">
                            No app store needed · Tap and it's done
                        </p>
                    </div>
                </div>
            </div>

            {/* Slide-up animation */}
            <style jsx global>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>
        </>
    );
}