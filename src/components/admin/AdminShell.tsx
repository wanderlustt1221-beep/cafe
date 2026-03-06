"use client";

// src/components/admin/AdminShell.tsx
// This is the UI shell that was previously in admin/layout.tsx.
// Extracted here so layout.tsx can be a server component (needed for auth guard).
// All existing UI is preserved exactly.

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Main content area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminTopbar onMenuClick={() => setSidebarOpen((o) => !o)} />

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}