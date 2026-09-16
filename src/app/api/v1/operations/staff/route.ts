import { NextRequest, NextResponse } from "next/server";
import { staffRepository } from "@/repositories/staffRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const staff = await staffRepository.listAll();
    return NextResponse.json({ success: true, data: staff });
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
    const { name, role, phone, wageType, baseWage, emergencyContact, notes } = body;

    if (!name || !role || !phone || !wageType || baseWage === undefined) {
      return NextResponse.json(
        { success: false, error: "Name, role, phone, wageType, and baseWage are required." },
        { status: 400 }
      );
    }

    const member = await staffRepository.create({
      name,
      role,
      contact: phone,
      wageType,
      wageRate: Number(baseWage),
      notes: notes || (emergencyContact ? `Emergency: ${emergencyContact}` : undefined),
      active: true,
    });

    return NextResponse.json({ success: true, data: member });
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Staff member ID is required." }, { status: 400 });
    }

    const updated = await staffRepository.update(id, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
