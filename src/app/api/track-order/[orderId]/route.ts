import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    const { orderId } = await context.params;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        status: order.status,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("TRACK_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to track order" },
      { status: 500 }
    );
  }
}