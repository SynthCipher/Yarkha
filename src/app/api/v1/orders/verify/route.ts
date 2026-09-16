import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/services/paymentService";
import { orderRepository } from "@/repositories/orderRepository";
import { inventoryService } from "@/services/inventoryService";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/config/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const isValidSignature = paymentService.verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      // Payment verification failed
      await orderRepository.updateStatus(
        order._id.toString(),
        ORDER_STATUSES.PAYMENT_FAILED,
        "System",
        "Razorpay signature mismatch"
      );
      // Release inventory reservation
      await inventoryService.releaseItems(
        order.items.map((i) => ({ productId: i.product.toString(), quantity: i.quantity }))
      );

      return NextResponse.json(
        { success: false, error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    // Payment Success -> Commit inventory permanently
    await inventoryService.commitItems(
      order.items.map((i) => ({ productId: i.product.toString(), quantity: i.quantity }))
    );

    // Update order status to CONFIRMED
    order.payment.status = PAYMENT_STATUSES.COMPLETED;
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.status = ORDER_STATUSES.CONFIRMED;
    order.statusHistory.push({
      status: ORDER_STATUSES.CONFIRMED,
      timestamp: new Date(),
      notes: "Payment verified successfully via Razorpay.",
    });
    await order.save();

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
