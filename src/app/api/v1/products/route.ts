import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/repositories/productRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productType = searchParams.get("type") as any;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const result = await productRepository.list({
      productType,
      featured,
      search,
      status,
      limit,
      page,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.category || !body.pricePerUnit) {
      return NextResponse.json(
        { success: false, error: "Title, category, and price per unit are required." },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let slug = body.slug?.trim()?.toLowerCase();
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Check slug uniqueness
    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const cleanData: any = {
      ...body,
      slug,
      pricePerUnit: Number(body.pricePerUnit),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : undefined,
      availableQuantity: Number(body.availableQuantity || 0),
      reservedQuantity: Number(body.reservedQuantity || 0),
      minOrderQuantity: Number(body.minOrderQuantity || 1),
      maxOrderQuantity: Number(body.maxOrderQuantity || 20),
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images.filter(Boolean)
        : ["/images/hero.jpg"],
    };

    if (!cleanData.farmBatch || cleanData.farmBatch === "") {
      delete cleanData.farmBatch;
    }

    const product = await productRepository.create(cleanData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
