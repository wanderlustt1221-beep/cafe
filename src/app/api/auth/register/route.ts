import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  dob: z.string().trim().min(1, "Date of birth is required"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  address: z.object({
    line1: z.string().trim().optional().default(""),
    line2: z.string().trim().optional().default(""),
    city: z.string().trim().optional().default(""),
    state: z.string().trim().optional().default(""),
    pincode: z.string().trim().optional().default(""),
    landmark: z.string().trim().optional().default(""),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalize payload so frontend variations don't break validation
    const normalizedBody = {
      name: body?.name ?? body?.fullName ?? "",
      dob: body?.dob ?? body?.dateOfBirth ?? "",
      email: body?.email ?? "",
      phone: String(body?.phone ?? body?.mobile ?? "").trim(),
      password: body?.password ?? "",
      address: {
        line1: body?.address?.line1 ?? body?.line1 ?? body?.addressLine1 ?? "",
        line2: body?.address?.line2 ?? body?.line2 ?? body?.addressLine2 ?? "",
        city: body?.address?.city ?? body?.city ?? "",
        state: body?.address?.state ?? body?.state ?? "",
        pincode: body?.address?.pincode ?? body?.pincode ?? "",
        landmark:
          body?.address?.landmark ?? body?.landmark ?? "",
      },
    };

    const parsed = registerSchema.safeParse(normalizedBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsed.error.flatten(),
          received: normalizedBody,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({
      email: parsed.data.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(parsed.data.password);

    const user = await User.create({
      name: parsed.data.name,
      dob: parsed.data.dob,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      password: hashedPassword,
      address: parsed.data.address,
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}