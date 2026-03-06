// src/components/orders/OrderTimeline.tsx

import {
    CheckCircle2, Circle, Clock,
    ChefHat, Truck, PartyPopper, XCircle, Package,
} from "lucide-react";

// Real enum from Order schema
type OrderStatus = "received" | "preparing" | "out_for_delivery" | "delivered";

type Step = {
    status: OrderStatus;
    label: string;
    description: string;
    icon: React.ElementType;
};

const ALL_STEPS: Step[] = [
    {
        status: "received",
        label: "Order Received",
        description: "Your order has been placed successfully",
        icon: Clock,
    },
    {
        status: "preparing",
        label: "Preparing",
        description: "Our chef is preparing your order fresh",
        icon: ChefHat,
    },
    {
        status: "out_for_delivery",
        label: "Out for Delivery",
        description: "Your order is on the way!",
        icon: Truck,
    },
    {
        status: "delivered",
        label: "Delivered",
        description: "Enjoy your meal! 🎉",
        icon: PartyPopper,
    },
];

// Index of each status in the flow
const STATUS_INDEX: Record<OrderStatus, number> = {
    received: 0,
    preparing: 1,
    out_for_delivery: 2,
    delivered: 3,
};

type Props = {
    status: string;
    orderType?: string;
    createdAt?: string;
};

export default function OrderTimeline({ status, orderType, createdAt }: Props) {
    if (status === "cancelled") {
        // "cancelled" isn't in the schema enum but handle gracefully if it ever appears
        return (
            <div className="flex flex-col items-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
                <XCircle size={44} className="text-rose-400" strokeWidth={1.5} />
                <p className="mt-4 font-serif text-xl font-bold text-white">Order Cancelled</p>
                <p className="mt-2 text-sm text-stone-500">
                    This order has been cancelled. Contact us if you need help.
                </p>
            </div>
        );
    }

    // For pickup orders, hide the delivery step
    const steps = orderType === "pickup"
        ? ALL_STEPS.filter((s) => s.status !== "out_for_delivery")
        : ALL_STEPS;

    const currentIndex = STATUS_INDEX[status as OrderStatus] ?? 0;

    return (
        <div className="space-y-0">
            {steps.map((step, i) => {
                // Re-map index against filtered steps for pickup
                const stepIndex = STATUS_INDEX[step.status];
                const isCompleted = currentIndex > stepIndex;
                const isActive = currentIndex === stepIndex;
                const isLast = i === steps.length - 1;

                return (
                    <div key={step.status} className="flex gap-4">
                        {/* Icon column + connector */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                                        ? "border-emerald-500 bg-emerald-500/15"
                                        : isActive
                                            ? "border-amber-400 bg-amber-400/15"
                                            : "border-stone-800 bg-white/[0.02]"
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 size={16} className="text-emerald-400" strokeWidth={2.5} />
                                ) : isActive ? (
                                    <step.icon size={16} className="text-amber-400" strokeWidth={2} />
                                ) : (
                                    <Circle size={16} className="text-stone-700" strokeWidth={2} />
                                )}

                                {/* Pulse ring on active step */}
                                {isActive && (
                                    <span className="absolute -inset-1 animate-ping rounded-full border-2 border-amber-400/30" />
                                )}
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div
                                    className={`mt-1 w-0.5 min-h-[28px] flex-1 rounded-full transition-colors ${isCompleted ? "bg-emerald-500/35" : "bg-stone-800"
                                        }`}
                                />
                            )}
                        </div>

                        {/* Text */}
                        <div className={`pb-7 pt-1 ${isLast ? "pb-0" : ""}`}>
                            <p
                                className={`text-sm font-semibold leading-none ${isCompleted
                                        ? "text-stone-400"
                                        : isActive
                                            ? "text-white"
                                            : "text-stone-700"
                                    }`}
                            >
                                {step.label}
                            </p>
                            <p
                                className={`mt-1.5 text-xs leading-relaxed ${isActive ? "text-stone-400" : "text-stone-700"
                                    }`}
                            >
                                {step.description}
                            </p>
                            {isActive && step.status === "received" && createdAt && (
                                <p className="mt-1 text-[10px] text-stone-700">
                                    {new Date(createdAt).toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}