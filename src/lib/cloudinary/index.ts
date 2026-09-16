import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

if (cloudName && apiKey && apiSecret && !cloudName.includes("placeholder")) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export { cloudinary };

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder = "stakna-farmhouse"
): Promise<{ url: string; publicId: string }> {
  if (!cloudName || cloudName.includes("placeholder") || !apiKey) {
    // In dev mode when real Cloudinary credentials aren't set, return mock URL
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    return {
      url: `/images/hero.jpg`,
      publicId: `${folder}/${mockId}`,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      )
      .end(fileBuffer);
  });
}
