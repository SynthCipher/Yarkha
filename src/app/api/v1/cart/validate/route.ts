import { NextRequest, NextResponse } from "next/server";
import { pricingService } from "@/services/pricingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, deliveryFee } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Items array is required" },
        { status: 400 }
      );
    }

    const result = await pricingService.validateAndCalculateCart({
      items,
      couponCode,
      deliveryFee,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
