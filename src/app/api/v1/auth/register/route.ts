import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { isLimited } = checkRateLimit(`register_${ip}`, 6, 60 * 1000);
    if (isLimited) {
      return NextResponse.json(
        { success: false, error: "Too many registration attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const { user, token } = await authService.register({ name, email, password, phone });
    return NextResponse.json({ success: true, data: { user, token } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}
