import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/repositories/orderRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES, ORDER_STATUSES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { orderNumber } = await params;
    const body = await req.json();
    const { status, notes } = body;

    if (!Object.values(ORDER_STATUSES).includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updated = await orderRepository.updateStatus(
      order._id.toString(),
      status,
      session.name,
      notes
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
