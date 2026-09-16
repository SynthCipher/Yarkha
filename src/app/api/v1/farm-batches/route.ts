import { NextRequest, NextResponse } from "next/server";
import { farmBatchRepository } from "@/repositories/farmBatchRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const batches = await farmBatchRepository.listAll();
    return NextResponse.json({ success: true, data: batches });
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

    if (!body.cropName || !body.sowingDate || body.expectedQuantity === undefined) {
      return NextResponse.json(
        { success: false, error: "Crop name, sowing date, and expected harvest quantity are required." },
        { status: 400 }
      );
    }

    // Auto-generate batchCode if missing
    let batchCode = body.batchCode?.trim()?.toUpperCase();
    if (!batchCode) {
      const prefix = body.cropName.slice(0, 3).toUpperCase();
      const year = new Date(body.sowingDate).getFullYear();
      batchCode = `GB-${year}-${prefix}${Date.now().toString().slice(-3)}`;
    }

    const batch = await farmBatchRepository.create({
      batchCode,
      cropName: body.cropName.trim(),
      farmLocation: body.farmLocation?.trim() || "Stakna Greenhouse, Indus Valley",
      greenhouseId: body.greenhouseId?.trim() || undefined,
      sowingDate: new Date(body.sowingDate),
      expectedHarvestDate: body.expectedHarvestDate ? new Date(body.expectedHarvestDate) : undefined,
      actualHarvestDate: body.actualHarvestDate ? new Date(body.actualHarvestDate) : undefined,
      expectedQuantity: Number(body.expectedQuantity),
      actualHarvestedQuantity: Number(body.actualHarvestedQuantity || 0),
      availableQuantity: Number(body.availableQuantity || body.expectedQuantity),
      soldQuantity: Number(body.soldQuantity || 0),
      wasteQuantity: Number(body.wasteQuantity || 0),
      unit: body.unit || "kg",
      inputCost: Number(body.inputCost || 0),
      seedCost: Number(body.seedCost || 0),
      laborCost: Number(body.laborCost || 0),
      status: body.status || "PLANNED",
      notes: body.notes?.trim(),
    });

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
