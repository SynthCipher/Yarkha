import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, verifyToken } from "@/lib/auth/jwt";
import { userRepository } from "@/repositories/userRepository";

export async function GET(req: NextRequest) {
  try {
    // Check Authorization Bearer header first (for mobile React Native app) or cookie (for Next.js web)
    const authHeader = req.headers.get("authorization");
    let sessionUser = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      sessionUser = await verifyToken(token);
    } else {
      sessionUser = await getSessionUser();
    }

    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await userRepository.findById(sessionUser.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        savedAddresses: user.savedAddresses,
        b2bProfile: user.b2bProfile,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
