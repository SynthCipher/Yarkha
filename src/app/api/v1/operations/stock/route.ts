import { NextRequest, NextResponse } from "next/server";
import { stockRepository } from "@/repositories/stockRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const items = await stockRepository.listAll();
    const lowStock = await stockRepository.getLowStockItems();

    return NextResponse.json({
      success: true,
      data: {
        items,
        lowStockCount: lowStock.length,
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
    const { name, category, quantity, unit, minThreshold, reorderQuantity, location, costPerUnit, supplier } = body;

    if (!name || !category || quantity === undefined || !unit) {
      return NextResponse.json(
        { success: false, error: "Name, category, quantity, and unit are required." },
        { status: 400 }
      );
    }

    const item = await stockRepository.create({
      name,
      category,
      quantityOnHand: Number(quantity),
      unit,
      reorderThreshold: Number(minThreshold) || 5,
      location: location || "Main Stakna Storehouse",
      costPerUnit: costPerUnit ? Number(costPerUnit) : 0,
      supplier,
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
    const { id, adjustment, newQuantity, notes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Stock item ID is required." }, { status: 400 });
    }

    let updated;
    if (adjustment !== undefined) {
      updated = await stockRepository.adjustQuantity(id, Number(adjustment), notes);
    } else if (newQuantity !== undefined) {
      updated = await stockRepository.update(id, { quantityOnHand: Number(newQuantity) });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
