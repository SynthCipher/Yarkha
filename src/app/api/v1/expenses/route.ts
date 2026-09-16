import { NextRequest, NextResponse } from "next/server";
import { expenseRepository } from "@/repositories/expenseRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const summary = searchParams.get("summary") === "true";

    if (summary) {
      const stats = await expenseRepository.getFinancialSummary();
      return NextResponse.json({ success: true, data: stats });
    }

    const expenses = await expenseRepository.listAll({ category });
    return NextResponse.json({ success: true, data: expenses });
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

    if (!body.title || !body.category || body.amount === undefined) {
      return NextResponse.json(
        { success: false, error: "Title, category, and amount are required." },
        { status: 400 }
      );
    }

    const expense = await expenseRepository.create({
      title: body.title.trim(),
      category: body.category,
      amount: Number(body.amount),
      date: body.date ? new Date(body.date) : new Date(),
      farmLocation: body.farmLocation || "Stakna Farm, Indus Valley",
      farmBatch: body.farmBatch ? body.farmBatch : undefined,
      paymentMethod: body.paymentMethod || "UPI",
      notes: body.notes?.trim(),
      receiptUrl: body.receiptUrl?.trim(),
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
