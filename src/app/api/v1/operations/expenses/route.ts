import { NextRequest, NextResponse } from "next/server";
import { expenseEntryRepository } from "@/repositories/expenseEntryRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const filter: any = {};
    if (section) filter.linkedSection = section;

    const [expenses, bySection, total] = await Promise.all([
      expenseEntryRepository.listAll(filter),
      expenseEntryRepository.getExpensesBySection(),
      expenseEntryRepository.getTotalExpenses(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        expenses,
        bySection,
        total,
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
    const { title, amount, category, linkedSection, date, paidTo, notes } = body;

    if (!title || !amount || !linkedSection) {
      return NextResponse.json(
        { success: false, error: "Title, amount, and linkedSection are required." },
        { status: 400 }
      );
    }

    const entry = await expenseEntryRepository.create({
      title,
      amount: Number(amount),
      category: category || "MATERIALS",
      linkedSection,
      date: date ? new Date(date) : new Date(),
      paidTo,
      notes,
    });

    return NextResponse.json({ success: true, data: entry });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
