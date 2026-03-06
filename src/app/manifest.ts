// src/app/manifest.ts
// Next.js App Router web app manifest — auto-served at /manifest.webmanifest

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name:             "Cafe App — Premium Ordering",
        short_name:       "Cafe App",
        description:      "Order fresh food & coffee in under 60 seconds. Delivered hot to your door.",
        start_url:        "/",
        display:          "standalone",
        orientation:      "portrait",
        background_color: "#0a0a0f",
        theme_color:      "#f59e0b",
        categories:       ["food", "shopping", "lifestyle"],
        icons: [
            {
                src:     "/icon-192.png",
                sizes:   "192x192",
                type:    "image/png",
                purpose: "any",
            },
            {
                src:     "/icon-192.png",
                sizes:   "192x192",
                type:    "image/png",
                purpose: "maskable",
            },
            {
                src:     "/icon-512.png",
                sizes:   "512x512",
                type:    "image/png",
                purpose: "any",
            },
            {
                src:     "/icon-512.png",
                sizes:   "512x512",
                type:    "image/png",
                purpose: "maskable",
            },
        ],
        screenshots: [],
    };
}