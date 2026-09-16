import { NextRequest, NextResponse } from "next/server";
import { contentRepository } from "@/repositories/contentRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET() {
  try {
    const blocks = await contentRepository.listAll();
    return NextResponse.json({ success: true, data: blocks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { key, title, section, content, metadata } = body;

    if (!key || !title || !content) {
      return NextResponse.json(
        { success: false, error: "key, title, and content are required." },
        { status: 400 }
      );
    }

    const block = await contentRepository.upsert(key, {
      title,
      section: section || "story",
      content,
      metadata,
    });

    return NextResponse.json({ success: true, data: block });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
