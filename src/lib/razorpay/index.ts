import crypto from "crypto";
import Razorpay from "razorpay";

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

export const razorpayInstance =
  razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes("placeholder")
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!razorpayKeySecret || razorpayKeySecret.includes("placeholder")) {
    return true; // Dev mode acceptance
  }

  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return generatedSignature === signature;
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  if (!webhookSecret || webhookSecret.includes("placeholder")) {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
}
