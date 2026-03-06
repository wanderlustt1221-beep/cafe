import Link from "next/link";
import { Coffee, MapPin, Phone, Mail, Clock, Flame, Instagram, Twitter, Facebook } from "lucide-react";

const quickLinks = [
    { href: "/menu", label: "Our Menu" },
    { href: "/offers", label: "Offers & Deals" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact Us" },
    { href: "/login", label: "Sign In" },
];

const socialLinks = [
    { href: "#", label: "Instagram", icon: Instagram },
    { href: "#", label: "Twitter / X", icon: Twitter },
    { href: "#", label: "Facebook", icon: Facebook },
];

const hoursData = [
    { day: "Monday – Friday", time: "9:00 AM – 11:00 PM" },
    { day: "Saturday", time: "8:00 AM – 11:30 PM" },
    { day: "Sunday", time: "10:00 AM – 10:00 PM" },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-stone-800/60 bg-stone-950">
            {/* Decorative gradient glow */}
            <div
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-2/3 -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
                style={{ background: "radial-gradient(ellipse, #f59e0b 0%, #ea580c 60%, transparent 100%)" }}
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 md:px-8">

                {/* Top row — brand + newsletter feel */}
                <div className="mb-12 flex flex-col items-start gap-4 border-b border-stone-800/60 pb-10 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                            <Coffee size={22} className="text-stone-950" strokeWidth={2.5} />
                            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow shadow-red-500/50">
                                <Flame size={9} className="text-white" />
                            </span>
                        </div>
                        <div>
                            <p className="font-serif text-2xl font-bold leading-none text-white tracking-tight">
                                Cafe App
                            </p>
                            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
                                Premium Ordering
                            </p>
                        </div>
                    </div>

                    <p className="max-w-sm text-sm leading-relaxed text-stone-400">
                        Crafted with love — premium cafe experience with WhatsApp checkout, exclusive offers, and fast delivery straight to your door.
                    </p>

                    <Link
                        href="/menu"
                        className="group flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:shadow-amber-500/50 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                        Order Now
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                    </Link>
                </div>

                {/* Main grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* About */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-500">
                            About Us
                        </h3>
                        <p className="text-sm leading-7 text-stone-400">
                            We believe great food deserves a great ordering experience. Every cup, every bite — delivered with care and speed.
                        </p>

                        {/* Social icons */}
                        <div className="mt-5 flex items-center gap-2">
                            {socialLinks.map(({ href, label, icon: Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-700/70 bg-stone-900/50 text-stone-400 transition-all duration-200 hover:border-amber-500/40 hover:bg-stone-800 hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                                >
                                    <Icon size={15} strokeWidth={2} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-500">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="group flex items-center gap-2.5 text-sm text-stone-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
                                    >
                                        <span className="h-px w-3 bg-stone-600 transition-all duration-300 group-hover:w-5 group-hover:bg-amber-400" />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-500">
                            Contact
                        </h3>
                        <ul className="space-y-3.5">
                            <li>
                                <a
                                    href="https://maps.google.com/?q=Danta,Sikar,Rajasthan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-3 text-sm text-stone-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
                                >
                                    <MapPin size={15} className="mt-0.5 shrink-0 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                                    <span>Danta, Sikar<br />Rajasthan, India</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919999999999"
                                    className="group flex items-center gap-3 text-sm text-stone-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
                                >
                                    <Phone size={15} className="shrink-0 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                                    +91 9999999999
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@cafeapp.com"
                                    className="group flex items-center gap-3 text-sm text-stone-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
                                >
                                    <Mail size={15} className="shrink-0 text-amber-500/70 group-hover:text-amber-400 transition-colors" />
                                    support@cafeapp.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-500">
                            Opening Hours
                        </h3>
                        <ul className="space-y-3">
                            {hoursData.map(({ day, time }) => (
                                <li key={day} className="flex flex-col gap-0.5">
                                    <span className="text-xs font-semibold text-stone-300">{day}</span>
                                    <span className="flex items-center gap-1.5 text-xs text-stone-500">
                                        <Clock size={11} className="text-amber-500/60" />
                                        {time}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {/* Open status badge */}
                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <span className="text-xs font-semibold text-emerald-400">Open Now</span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-stone-800/60 pt-6 text-xs text-stone-600 sm:flex-row">
                    <p>© 2026 Cafe App. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="transition-colors hover:text-stone-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                            Privacy Policy
                        </Link>
                        <span className="text-stone-800">·</span>
                        <Link href="/terms" className="transition-colors hover:text-stone-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded">
                            Terms of Service
                        </Link>
                        <span className="text-stone-800">·</span>
                        <span className="text-stone-600">
                            Made with <span className="text-amber-500">♥</span> in Rajasthan
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}