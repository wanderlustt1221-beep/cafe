"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
    User, Mail, Lock, Phone, Calendar, MapPin, Eye, EyeOff,
    ArrowRight, Loader2, Building2, Hash, Navigation,
} from "lucide-react";

type FieldProps = {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    autoComplete?: string;
    icon: React.ReactNode;
    rightEl?: React.ReactNode;
    required?: boolean;
    colSpan?: boolean;
};

function Field({
    id, label, type = "text", value, onChange, placeholder,
    autoComplete, icon, rightEl, required, colSpan,
}: FieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${colSpan ? "sm:col-span-2" : ""}`}>
            <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {label}
            </label>
            <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-stone-500">{icon}</span>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="w-full rounded-xl border border-stone-700/70 bg-stone-800/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-stone-600 transition-colors duration-200 focus:border-amber-500/60 focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                {rightEl && <span className="absolute right-3.5">{rightEl}</span>}
            </div>
        </div>
    );
}

type SectionProps = { title: string; children: React.ReactNode };
function Section({ title, children }: SectionProps) {
    return (
        <div>
            <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-500/80">
                <span className="h-px flex-1 bg-stone-800" />
                {title}
                <span className="h-px flex-1 bg-stone-800" />
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
        </div>
    );
}

type FormState = {
    name: string; dob: string; email: string; phone: string; password: string;
    addressLine1: string; addressLine2: string; city: string;
    state: string; pincode: string; landmark: string;
};

const INITIAL: FormState = {
    name: "", dob: "", email: "", phone: "", password: "",
    addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", landmark: "",
};

export default function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
    const [form, setForm] = useState<FormState>(INITIAL);
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = (key: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const required: (keyof FormState)[] = ["name", "email", "phone", "password", "addressLine1", "city", "state", "pincode"];
        const missing = required.filter((k) => !form[k].trim());
        if (missing.length) {
            toast.error("Please fill in all required fields");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Registration failed. Please try again.");
            } else {
                toast.success("Account created! Please sign in. 🎉");
                setForm(INITIAL);
                onSuccess();
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
                <h2 className="font-serif text-2xl font-bold text-white">Join and order</h2>
                <p className="mt-1 text-sm text-stone-500">Create your account in seconds. Fresh food awaits.</p>
            </div>

            {/* Personal info */}
            <Section title="Personal Info">
                <Field id="reg-name" label="Full Name *" value={form.name} onChange={set("name")}
                    placeholder="Your full name" autoComplete="name"
                    icon={<User size={14} strokeWidth={2} />} required colSpan />

                <Field id="reg-dob" label="Date of Birth" type="date" value={form.dob} onChange={set("dob")}
                    placeholder="" autoComplete="bday"
                    icon={<Calendar size={14} strokeWidth={2} />} />

                <Field id="reg-phone" label="Phone *" type="tel" value={form.phone} onChange={set("phone")}
                    placeholder="+91 98765 43210" autoComplete="tel"
                    icon={<Phone size={14} strokeWidth={2} />} required />
            </Section>

            {/* Account */}
            <Section title="Account">
                <Field id="reg-email" label="Email *" type="email" value={form.email} onChange={set("email")}
                    placeholder="you@example.com" autoComplete="email"
                    icon={<Mail size={14} strokeWidth={2} />} required colSpan />

                <Field id="reg-password" label="Password *"
                    type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                    placeholder="Create a strong password" autoComplete="new-password"
                    icon={<Lock size={14} strokeWidth={2} />}
                    rightEl={
                        <button type="button" onClick={() => setShowPass((p) => !p)}
                            aria-label={showPass ? "Hide password" : "Show password"}
                            className="text-stone-500 transition-colors hover:text-stone-300 focus:outline-none">
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    }
                    required colSpan />
            </Section>

            {/* Address */}
            <Section title="Delivery Address">
                <Field id="reg-addr1" label="Address Line 1 *" value={form.addressLine1} onChange={set("addressLine1")}
                    placeholder="House / Flat / Building No." autoComplete="address-line1"
                    icon={<MapPin size={14} strokeWidth={2} />} required colSpan />

                <Field id="reg-addr2" label="Address Line 2" value={form.addressLine2} onChange={set("addressLine2")}
                    placeholder="Street / Colony / Area" autoComplete="address-line2"
                    icon={<MapPin size={14} strokeWidth={2} />} colSpan />

                <Field id="reg-landmark" label="Landmark" value={form.landmark} onChange={set("landmark")}
                    placeholder="Near temple, school, etc." autoComplete="off"
                    icon={<Navigation size={14} strokeWidth={2} />} colSpan />

                <Field id="reg-city" label="City *" value={form.city} onChange={set("city")}
                    placeholder="City" autoComplete="address-level2"
                    icon={<Building2 size={14} strokeWidth={2} />} required />

                <Field id="reg-state" label="State *" value={form.state} onChange={set("state")}
                    placeholder="State" autoComplete="address-level1"
                    icon={<Building2 size={14} strokeWidth={2} />} required />

                <Field id="reg-pincode" label="Pincode *" value={form.pincode} onChange={set("pincode")}
                    placeholder="000000" autoComplete="postal-code"
                    icon={<Hash size={14} strokeWidth={2} />} required />
            </Section>

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
                        Create Account
                        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-stone-600">
                Join 2,400+ customers already ordering with us.
            </p>
        </form>
    );
}