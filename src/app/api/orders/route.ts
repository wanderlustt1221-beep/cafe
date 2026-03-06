import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { generateOrderId } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";

// ── GET /api/orders ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "200"), 500);

    const query: Record<string, any> = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET_ORDERS_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// ── POST /api/orders ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie") ?? "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    let linkedUserId: string | null = null;

    if (token) {
      try {
        const decoded = verifyToken(token) as { userId?: string };

        if (decoded?.userId) {
          const user = await User.findById(decoded.userId).select("_id isActive");

          if (!user) {
            return NextResponse.json(
              { success: false, message: "User not found" },
              { status: 404 }
            );
          }

          if (user.isActive === false) {
            return NextResponse.json(
              {
                success: false,
                message: "Your account has been blocked. You cannot place orders.",
              },
              { status: 403 }
            );
          }

          linkedUserId = user._id.toString();
        }
      } catch {
        // Invalid token -> continue as unauthenticated if needed
      }
    }

    const body = await req.json();

    const order = await Order.create({
      ...body,
      ...(linkedUserId ? { user: linkedUserId } : {}),
      orderId: generateOrderId(),
    });

    return NextResponse.json(
      { success: true, message: "Order created successfully", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order" },
      { status: 500 }
    );
  }
}