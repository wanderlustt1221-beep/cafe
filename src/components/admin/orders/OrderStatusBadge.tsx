// src/components/admin/orders/OrderStatusBadge.tsx

export type OrderStatus =
    | "received"
    | "preparing"
    | "out_for_delivery"
    | "delivered";

export const STATUS_CONFIG: Record<OrderStatus, { label: string; classes: string }> = {
    received: { label: "Received", classes: "border-amber-500/25 bg-amber-500/10 text-amber-400" },
    preparing: { label: "Preparing", classes: "border-sky-500/25 bg-sky-500/10 text-sky-400" },
    out_for_delivery: { label: "Out for Delivery", classes: "border-orange-500/25 bg-orange-500/10 text-orange-400" },
    delivered: { label: "Delivered", classes: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" },
};

export const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

export function OrderStatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as OrderStatus] ?? {
        label: status,
        classes: "border-stone-700 bg-stone-800 text-stone-400",
    };
    return (
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.classes}`}>
            {cfg.label}
        </span>
    );
}