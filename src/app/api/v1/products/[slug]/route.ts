import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { productRepository } from "@/repositories/productRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(slug)) {
      product = await productRepository.findById(slug);
    }
    if (!product) {
      product = await productRepository.findBySlug(slug);
    }

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { slug } = await params;
    let targetId = slug;

    if (!mongoose.Types.ObjectId.isValid(slug)) {
      const existing = await productRepository.findBySlug(slug);
      if (!existing) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      targetId = existing._id.toString();
    }

    const body = await req.json();
    const updateData: any = { ...body };

    if (updateData.pricePerUnit !== undefined) {
      updateData.pricePerUnit = Number(updateData.pricePerUnit);
    }
    if (updateData.compareAtPrice !== undefined) {
      updateData.compareAtPrice = updateData.compareAtPrice ? Number(updateData.compareAtPrice) : undefined;
    }
    if (updateData.availableQuantity !== undefined) {
      updateData.availableQuantity = Number(updateData.availableQuantity);
    }
    if (updateData.minOrderQuantity !== undefined) {
      updateData.minOrderQuantity = Number(updateData.minOrderQuantity);
    }
    if (updateData.maxOrderQuantity !== undefined) {
      updateData.maxOrderQuantity = Number(updateData.maxOrderQuantity);
    }
    if (updateData.farmBatch === "" || updateData.farmBatch === null) {
      updateData.farmBatch = undefined;
    }
    if (Array.isArray(updateData.images)) {
      updateData.images = updateData.images.filter(Boolean);
    }

    const updated = await productRepository.update(targetId, updateData);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Product not found to update." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { slug } = await params;
    let targetId = slug;

    if (!mongoose.Types.ObjectId.isValid(slug)) {
      const existing = await productRepository.findBySlug(slug);
      if (!existing) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      targetId = existing._id.toString();
    }

    const success = await productRepository.delete(targetId);
    if (!success) {
      return NextResponse.json({ success: false, error: "Product not found or already deleted." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
