import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES = [
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
] as const;

type ValidStatus = (typeof VALID_STATUSES)[number];

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("GET_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, ...otherUpdates } = body;

    const updatePayload: Record<string, any> = { ...otherUpdates };

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status as ValidStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
          },
          { status: 400 }
        );
      }

      updatePayload.status = status;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error: any) {
    console.error("PATCH_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update order" },
      { status: 500 }
    );
  }
}