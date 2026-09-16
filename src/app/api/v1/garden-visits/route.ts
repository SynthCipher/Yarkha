import { NextRequest, NextResponse } from "next/server";
import { gardenVisitRepository } from "@/repositories/gardenVisitRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorName, email, phone, preferredDate, groupSize, purpose } = body;

    if (!visitorName || !email || !phone || !preferredDate) {
      return NextResponse.json(
        { success: false, error: "Name, email, phone, and preferred date are required." },
        { status: 400 }
      );
    }

    const visit = await gardenVisitRepository.create({
      visitorName,
      email,
      phone,
      preferredDate: new Date(preferredDate),
      groupSize: Number(groupSize) || 2,
      purpose,
    });

    return NextResponse.json({
      success: true,
      data: visit,
      message: "Garden visit request submitted successfully. We will confirm shortly via phone/email.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const visits = await gardenVisitRepository.listAll();
    return NextResponse.json({ success: true, data: visits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required." }, { status: 400 });
    }

    const updated = await gardenVisitRepository.updateStatus(id, status, notes);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
