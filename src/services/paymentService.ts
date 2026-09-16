import crypto from "crypto";
import Razorpay from "razorpay";

const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || "";

const razorpayInstance =
  razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes("placeholder")
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

export const paymentService = {
  async createRazorpayOrder({
    amountInRupees,
    receipt,
    notes = {},
  }: {
    amountInRupees: number;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<{ id: string; amount: number; currency: string }> {
    const amountInPaise = Math.round(amountInRupees * 100);

    if (!razorpayInstance) {
      // Mock / Dev fallback when real keys not yet plugged in
      return {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes,
    });

    return {
      id: order.id,
      amount: typeof order.amount === "string" ? parseInt(order.amount, 10) : order.amount,
      currency: order.currency,
    };
  },

  verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
  }: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    if (!razorpayKeySecret || razorpayKeySecret.includes("placeholder")) {
      // Dev mode signature acceptance
      return true;
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  },

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    if (!webhookSecret || webhookSecret.includes("placeholder")) {
      return true;
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    return expectedSignature === signature;
  },
};
