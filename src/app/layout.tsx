// src/app/layout.tsx
// Updated: PWA metadata, theme color, apple tags, icon references.
// All existing layout code preserved.

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// ─── Viewport (theme color lives here in Next.js 14+) ─────────────────────
export const viewport: Viewport = {
    themeColor:          "#f59e0b",
    width:               "device-width",
    initialScale:        1,
    maximumScale:        1,
    userScalable:        false,
    viewportFit:         "cover",
};

// ─── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    // Core
    title: {
        default:  "Cafe App — Premium Ordering",
        template: "%s | Cafe App",
    },
    description: "Order fresh food & coffee in under 60 seconds. Delivered hot to your door.",
    applicationName: "Cafe App",

    // PWA / installability
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable:       true,
        statusBarStyle: "black-translucent",
        title:         "Cafe App",
        startupImage:  [
            // Covers most common iPhone sizes — all point to your 512 icon
            // Replace with proper splash screens if you generate them later
            { url: "/icon-512.png" },
        ],
    },

    // Open Graph (for share previews)
    openGraph: {
        type:        "website",
        siteName:    "Cafe App",
        title:       "Cafe App — Premium Ordering",
        description: "Order fresh food & coffee in under 60 seconds.",
        images:      [{ url: "/icon-512.png", width: 512, height: 512 }],
    },

    // Icons
    icons: {
        icon: [
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        shortcut: "/icon-192.png",
    },

    // SEO
    keywords: ["cafe", "food ordering", "delivery", "coffee", "burgers", "pizza"],
    robots: {
        index:  true,
        follow: true,
    },
};

// ─── Root layout ───────────────────────────────────────────────────────────
export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="bg-neutral-950 text-white antialiased">
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "#1c1c24",
                            color:      "#f5f5f4",
                            border:     "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            fontSize:   "14px",
                        },
                        success: {
                            iconTheme: { primary: "#f59e0b", secondary: "#1c1c24" },
                        },
                        error: {
                            iconTheme: { primary: "#f43f5e", secondary: "#1c1c24" },
                        },
                    }}
                />
            </body>
        </html>
    );
}