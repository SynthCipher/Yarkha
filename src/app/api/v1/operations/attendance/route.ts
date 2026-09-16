import { NextRequest, NextResponse } from "next/server";
import { attendanceRepository } from "@/repositories/attendanceRepository";
import { staffRepository } from "@/repositories/staffRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const date = new Date(dateStr);

    const records = await attendanceRepository.listByDate(date);
    const staff = await staffRepository.listAll({ active: true });

    return NextResponse.json({
      success: true,
      data: {
        date: dateStr,
        records,
        activeStaff: staff,
      },
    });
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
    const { staffMemberId, date, status, wageCalculated, notes } = body;

    if (!staffMemberId || !date || !status) {
      return NextResponse.json(
        { success: false, error: "staffMemberId, date, and status are required." },
        { status: 400 }
      );
    }

    const record = await attendanceRepository.markAttendance({
      staffMemberId,
      date: new Date(date),
      status,
      wageCalculated: Number(wageCalculated) || 0,
      notes,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
