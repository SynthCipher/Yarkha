import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via upload_stream
    const uploadPromise = new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "yarkha_products",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Cloudinary upload failed"));
          } else {
            resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        }
      );
      uploadStream.end(buffer);
    });

    const result = await uploadPromise;
    return NextResponse.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 500 });
  }
}
