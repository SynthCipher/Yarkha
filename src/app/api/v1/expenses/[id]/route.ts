import { NextRequest, NextResponse } from "next/server";
import { expenseRepository } from "@/repositories/expenseRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

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
    const success = await expenseRepository.delete(id);

    if (!success) {
      return NextResponse.json({ success: false, error: "Expense record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Expense record deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
