import Link from "next/link";
import {
    MapPin,
    Phone,
    Clock3,
    MessageCircle,
    Mail,
    ArrowRight,
    Navigation,
    Sparkles,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const MAP_LINK = "https://maps.app.goo.gl/Y5DEiuP4qJcHKfWAA";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export default function ContactPage() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-stone-950 text-white">
                <section className="relative overflow-hidden border-b border-stone-800/70">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.08),transparent_30%)]" />
                    <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
                        <div className="max-w-3xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5">
                                <Sparkles size={14} className="text-amber-400" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
                                    Contact Us
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
                                Visit, Call, or Message Us Anytime
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                                Fresh food, warm vibes, and quick service — if you want to reach us
                                for orders, directions, or cafe details, everything is right here.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110"
                                >
                                    <MessageCircle size={16} />
                                    Order on WhatsApp
                                </Link>

                                <Link
                                    href={MAP_LINK}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/70 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-500/40 hover:bg-stone-800"
                                >
                                    <Navigation size={16} />
                                    Open in Google Maps
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="font-serif text-2xl font-bold text-white">Location</h2>
                                <p className="mt-3 text-sm leading-6 text-stone-400">
                                    Ramgarh side / Danta, Sikar, Rajasthan
                                    <br />
                                    Visit us for fresh coffee, tasty snacks, and a premium cafe
                                    experience.
                                </p>
                                <Link
                                    href={MAP_LINK}
                                    target="_blank"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                                >
                                    Get Directions
                                    <ArrowRight size={14} />
                                </Link>
                            </div>

                            <div className="rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                    <Phone size={20} />
                                </div>
                                <h2 className="font-serif text-2xl font-bold text-white">Call Us</h2>
                                <p className="mt-3 text-sm leading-6 text-stone-400">
                                    For quick help, delivery support, or cafe-related queries, call or
                                    WhatsApp us directly.
                                </p>
                                <a
                                    href={`tel:+${WHATSAPP_NUMBER}`}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                                >
                                    +{WHATSAPP_NUMBER}
                                    <ArrowRight size={14} />
                                </a>
                            </div>

                            <div className="rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                    <Clock3 size={20} />
                                </div>
                                <h2 className="font-serif text-2xl font-bold text-white">Opening Hours</h2>
                                <div className="mt-3 space-y-2 text-sm text-stone-400">
                                    <div className="flex items-center justify-between gap-4">
                                        <span>Monday - Sunday</span>
                                        <span className="font-medium text-stone-200">10:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span>Orders</span>
                                        <span className="font-medium text-stone-200">Available Daily</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-stone-800/70 bg-stone-900/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                                    <Mail size={20} />
                                </div>
                                <h2 className="font-serif text-2xl font-bold text-white">Support</h2>
                                <p className="mt-3 text-sm leading-6 text-stone-400">
                                    For help with orders, table booking, delivery updates, or cafe
                                    inquiries, use WhatsApp for the fastest response.
                                </p>
                                <Link
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                                >
                                    Chat on WhatsApp
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-stone-800/70 bg-stone-900/60 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                            <div className="overflow-hidden rounded-[1.5rem] border border-stone-800 bg-stone-950">
                                <div className="border-b border-stone-800/70 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),transparent_35%),linear-gradient(135deg,#1c1917,#0c0a09)] px-6 py-5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
                                        <Navigation size={12} />
                                        Map & Directions
                                    </div>

                                    <h3 className="mt-4 font-serif text-3xl font-bold text-white">
                                        Find Us Easily
                                    </h3>

                                    <p className="mt-3 max-w-md text-sm leading-7 text-stone-400">
                                        Use the live map below to locate our cafe quickly and get directions without any hassle.
                                    </p>
                                </div>

                                <div className="h-[320px] w-full md:h-[420px]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.6644903203102!2d75.17707504587761!3d27.26207348965363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c8f003bb2017f%3A0x2c8717f3bf912831!2sRamgardh%20bas%20stand%20circle!5e0!3m2!1sen!2sin!4v1772790882554!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="h-full w-full"
                                    />
                                </div>

                                <div className="border-t border-stone-800/70 bg-stone-900/80 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                                            <MapPin size={18} />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-white">Cafe Location</p>
                                            <p className="mt-1 text-sm leading-6 text-stone-400">
                                                Ramgarh Bas Stand Circle
                                                <br />
                                                Danta, Sikar, Rajasthan
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link
                                            href={MAP_LINK}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-bold text-stone-950 transition hover:brightness-110"
                                        >
                                            <Navigation size={16} />
                                            Open Map
                                        </Link>

                                        <Link
                                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/70 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                                        >
                                            <MessageCircle size={16} />
                                            Ask on WhatsApp
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
                    <div className="rounded-[2rem] border border-amber-400/15 bg-gradient-to-br from-amber-400/10 via-orange-500/10 to-stone-900 p-8 md:p-10">
                        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-400">
                                    Need quick help?
                                </p>
                                <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
                                    Order faster with direct WhatsApp support
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300 md:text-base">
                                    Whether you want delivery details, menu help, or directions to the
                                    cafe, the fastest way to reach us is through WhatsApp.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-stone-100"
                                >
                                    <MessageCircle size={16} />
                                    Chat Now
                                </Link>

                                <Link
                                    href="/menu"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Explore Menu
                                    <ArrowRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}