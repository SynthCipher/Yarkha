import { NextRequest, NextResponse } from "next/server";
import { equipmentRepository } from "@/repositories/equipmentRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const equipment = await equipmentRepository.listAll();
    const dueCount = await equipmentRepository.getMaintenanceDueCount();

    return NextResponse.json({
      success: true,
      data: {
        equipment,
        dueCount,
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
    const { name, category, modelNumber, purchaseDate, purchaseCost, condition, location, nextMaintenanceDueDate, notes } = body;

    if (!name || !category) {
      return NextResponse.json({ success: false, error: "Name and category are required." }, { status: 400 });
    }

    const item = await equipmentRepository.create({
      name,
      type: category,
      serialNumber: modelNumber,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      condition: condition || "GOOD",
      nextMaintenanceDueDate: nextMaintenanceDueDate ? new Date(nextMaintenanceDueDate) : undefined,
      notes,
    });

    return NextResponse.json({ success: true, data: item });
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
    const { id, condition, logMaintenance, notes, nextDueDate } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Equipment ID is required." }, { status: 400 });
    }

    let updated;
    if (logMaintenance) {
      updated = await equipmentRepository.logMaintenance(id, {
        notes,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
      });
    } else {
      updated = await equipmentRepository.update(id, {
        ...(condition ? { condition } : {}),
        ...(notes ? { notes } : {}),
        ...(nextDueDate ? { nextMaintenanceDueDate: new Date(nextDueDate) } : {}),
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
