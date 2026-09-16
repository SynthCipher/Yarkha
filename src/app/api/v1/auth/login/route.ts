import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { checkRateLimit } from "@/lib/auth/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { isLimited } = checkRateLimit(`login_${ip}`, 10, 60 * 1000);
    if (isLimited) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Identifier (email/username) and password are required." },
        { status: 400 }
      );
    }

    const { user, token } = await authService.login({ identifier, password });
    return NextResponse.json({ success: true, data: { user, token } });
  } catch (error: any) {
    console.error("LOGIN ROUTE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 401 }
    );
  }
}
