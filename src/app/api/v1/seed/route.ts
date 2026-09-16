import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed";

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with authentic Ladakh farm data!",
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
