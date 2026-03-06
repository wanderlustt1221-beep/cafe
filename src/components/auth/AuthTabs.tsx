"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type Tab = "login" | "register";

type AuthTabsProps = {
    redirectTo?: string;
};

export default function AuthTabs({ redirectTo = "/" }: AuthTabsProps) {
    const [activeTab, setActiveTab] = useState<Tab>("login");

    return (
        <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-stone-800/70 bg-stone-900/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
                <div className="relative flex border-b border-stone-800/70 bg-stone-950/60 p-1.5">
                    <div
                        className="absolute bottom-1.5 top-1.5 w-[calc(50%-6px)] rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25 transition-all duration-300 ease-out"
                        style={{
                            left: activeTab === "login" ? "6px" : "calc(50% + 0px)",
                        }}
                        aria-hidden="true"
                    />

                    <button
                        type="button"
                        onClick={() => setActiveTab("login")}
                        aria-selected={activeTab === "login"}
                        role="tab"
                        className={`relative z-10 flex-1 rounded-2xl py-2.5 text-sm font-bold transition-colors duration-300 ${activeTab === "login"
                                ? "text-stone-950"
                                : "text-stone-400 hover:text-stone-200"
                            }`}
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        aria-selected={activeTab === "register"}
                        role="tab"
                        className={`relative z-10 flex-1 rounded-2xl py-2.5 text-sm font-bold transition-colors duration-300 ${activeTab === "register"
                                ? "text-stone-950"
                                : "text-stone-400 hover:text-stone-200"
                            }`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="p-6 md:p-7">
                    {activeTab === "login" ? (
                        <LoginForm redirectTo={redirectTo} />
                    ) : (
                        <RegisterForm onSuccess={() => setActiveTab("login")} />
                    )}
                </div>
            </div>

            <p className="mt-5 text-center text-xs text-stone-600">
                By continuing, you agree to our{" "}
                <a
                    href="#"
                    className="text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-300"
                >
                    Terms
                </a>{" "}
                &{" "}
                <a
                    href="#"
                    className="text-stone-500 underline underline-offset-2 transition-colors hover:text-stone-300"
                >
                    Privacy Policy
                </a>
            </p>
        </div>
    );
}