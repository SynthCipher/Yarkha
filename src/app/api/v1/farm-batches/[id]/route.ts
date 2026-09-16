import { NextRequest, NextResponse } from "next/server";
import { farmBatchRepository } from "@/repositories/farmBatchRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const batch = await farmBatchRepository.findById(id);
    if (!batch) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: batch });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updateData: any = { ...body };
    if (updateData.sowingDate) updateData.sowingDate = new Date(updateData.sowingDate);
    if (updateData.expectedHarvestDate) updateData.expectedHarvestDate = new Date(updateData.expectedHarvestDate);
    if (updateData.actualHarvestDate) updateData.actualHarvestDate = new Date(updateData.actualHarvestDate);

    if (updateData.expectedQuantity !== undefined) updateData.expectedQuantity = Number(updateData.expectedQuantity);
    if (updateData.actualHarvestedQuantity !== undefined) updateData.actualHarvestedQuantity = Number(updateData.actualHarvestedQuantity);
    if (updateData.availableQuantity !== undefined) updateData.availableQuantity = Number(updateData.availableQuantity);
    if (updateData.soldQuantity !== undefined) updateData.soldQuantity = Number(updateData.soldQuantity);
    if (updateData.wasteQuantity !== undefined) updateData.wasteQuantity = Number(updateData.wasteQuantity);
    if (updateData.inputCost !== undefined) updateData.inputCost = Number(updateData.inputCost);
    if (updateData.seedCost !== undefined) updateData.seedCost = Number(updateData.seedCost);
    if (updateData.laborCost !== undefined) updateData.laborCost = Number(updateData.laborCost);

    const updated = await farmBatchRepository.update(id, updateData);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const success = await farmBatchRepository.delete(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Batch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Batch deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
