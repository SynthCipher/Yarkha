import { NextRequest, NextResponse } from "next/server";
import { deliveryService } from "@/services/deliveryService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const slots = await deliveryService.getAvailableSlotsForDate(date);
    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
