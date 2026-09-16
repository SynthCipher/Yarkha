import { NextRequest, NextResponse } from "next/server";
import { deliveryService } from "@/services/deliveryService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locality, postalCode, cartProductTypes, orderSubtotal } = body;

    if (!locality) {
      return NextResponse.json(
        { success: false, error: "Locality is required" },
        { status: 400 }
      );
    }

    const result = await deliveryService.checkEligibility({
      locality,
      postalCode,
      cartProductTypes: cartProductTypes || [],
      orderSubtotal: orderSubtotal || 0,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
