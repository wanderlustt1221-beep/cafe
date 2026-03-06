"use client";

// src/components/auth/LoginForm.tsx
// Updated: role-based redirect after login + blocked user error handling.

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────
type LoginFormProps = {
    redirectTo?: string;
};

// ─── Types ────────────────────────────────────────────────────────────────
type FieldProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    autoComplete?: string;
    icon: React.ReactNode;
    rightEl?: React.ReactNode;
    required?: boolean;
};

// ─── Reusable field ───────────────────────────────────────────────────────
function Field({
    id,
    label,
    type,
    value,
    onChange,
    placeholder,
    autoComplete,
    icon,
    rightEl,
    required,
}: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-xs font-semibold uppercase tracking-wider text-stone-400"
            >
                {label}
            </label>

            <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-stone-500">
                    {icon}
                </span>

                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full rounded-xl border border-stone-700/70 bg-stone-800/60 py-3 pl-10 pr-10 text-sm text-white placeholder:text-stone-600 transition-colors duration-200 focus:border-amber-500/60 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />

                {rightEl && <span className="absolute right-3.5">{rightEl}</span>}
            </div>
        </div>
    );
}

// ─── Login form ───────────────────────────────────────────────────────────
export default function LoginForm({ redirectTo = "/" }: LoginFormProps) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Login failed. Please try again.");
                return;
            }

            toast.success("Welcome back! 👋");

            const role = data.user?.role ?? "user";
            const redirect = searchParams.get("redirect") || redirectTo;

            // ── Role based redirect ───────────────────────────────────────
            if (role === "admin") {

                const dest =
                    redirect?.startsWith("/admin") ? redirect : "/admin";

                router.push(dest);

            } else {

                const dest =
                    redirect && !redirect.startsWith("/admin")
                        ? redirect
                        : "/";

                router.push(dest);
            }

        } catch {

            toast.error("Something went wrong. Please try again.");

        } finally {

            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Header */}
            <div className="mb-1">
                <h2 className="font-serif text-2xl font-bold text-white">
                    Welcome back
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                    Sign in to continue ordering your favourites.
                </p>
            </div>

            <Field
                id="login-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                autoComplete="email"
                icon={<Mail size={15} strokeWidth={2} />}
                required
            />

            <Field
                id="login-password"
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                autoComplete="current-password"
                icon={<Lock size={15} strokeWidth={2} />}
                rightEl={
                    <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        className="text-stone-500 transition-colors hover:text-stone-300 focus:outline-none"
                    >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                }
                required
            />

            {/* Forgot password */}
            <div className="-mt-2 flex justify-end">
                <a
                    href="#"
                    className="text-xs text-stone-500 underline underline-offset-2 transition-colors hover:text-amber-400"
                >
                    Forgot password?
                </a>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <>
                        Sign In
                        <ArrowRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-stone-600">
                Fresh food, fast ordering — made just for you.
            </p>
        </form>
    );
}