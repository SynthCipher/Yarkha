import { NextRequest, NextResponse } from "next/server";
import { pricingService } from "@/services/pricingService";
import { deliveryService } from "@/services/deliveryService";
import { inventoryService } from "@/services/inventoryService";
import { paymentService } from "@/services/paymentService";
import { orderRepository } from "@/repositories/orderRepository";
import { notificationService } from "@/services/notificationService";
import { getSessionUser } from "@/lib/auth/jwt";
import { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS, USER_ROLES } from "@/config/constants";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();

    // Guard: Block admins and farm managers from placing storefront retail orders
    if (
      session &&
      (session.role === USER_ROLES.ADMIN || session.role === USER_ROLES.FARM_MANAGER)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Administrators cannot place orders from the storefront. Please sign out or use a customer account.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      items,
      deliveryAddress,
      deliverySlot,
      couponCode,
      paymentMethod = PAYMENT_METHODS.RAZORPAY,
      orderNotes,
      guestInfo,
    } = body;

    if (!items || !items.length || !deliveryAddress) {
      return NextResponse.json(
        { success: false, error: "Items and delivery address are required." },
        { status: 400 }
      );
    }

    // 1. Validate cart and calculate server-side pricing
    const cartTypes = items.map((i: any) => i.productType);
    const initialPricing = await pricingService.validateAndCalculateCart({
      items,
      couponCode,
      deliveryFee: 0,
    });

    if (!initialPricing.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: initialPricing.errors[0] || "Cart validation failed.",
          warnings: initialPricing.warnings,
        },
        { status: 400 }
      );
    }

    // 2. Validate delivery zone eligibility
    const eligibility = await deliveryService.checkEligibility({
      locality: deliveryAddress.locality,
      postalCode: deliveryAddress.postalCode,
      cartProductTypes: cartTypes,
      orderSubtotal: initialPricing.subtotal,
    });

    if (!eligibility.isEligible) {
      return NextResponse.json(
        { success: false, error: eligibility.reason || "Delivery not available for this area." },
        { status: 400 }
      );
    }

    // 3. Recalculate with confirmed delivery fee
    const finalPricing = await pricingService.validateAndCalculateCart({
      items,
      couponCode,
      deliveryFee: eligibility.deliveryFee,
    });

    // 4. Atomic Inventory Reservation
    const reservation = await inventoryService.reserveItems(
      items.map((i: any) => ({ productId: i.productId, quantity: i.quantity }))
    );

    if (!reservation.success) {
      return NextResponse.json(
        { success: false, error: reservation.reason || "Unable to reserve inventory." },
        { status: 409 }
      );
    }

    // 5. Generate Order Number
    const count = await orderRepository.listAll({ limit: 1 });
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count.total + 1).padStart(5, "0")}`;

    // 6. Razorpay Order Creation
    let razorpayOrderId = undefined;
    if (paymentMethod === PAYMENT_METHODS.RAZORPAY) {
      const rzpOrder = await paymentService.createRazorpayOrder({
        amountInRupees: finalPricing.total,
        receipt: orderNumber,
        notes: {
          orderNumber,
          locality: deliveryAddress.locality,
        },
      });
      razorpayOrderId = rzpOrder.id;
    }

    // 7. Persist Order in MongoDB
    const order = await orderRepository.create({
      orderNumber,
      customer: session?.userId as any,
      guestInfo: session ? undefined : guestInfo,
      items: finalPricing.items.map((i) => ({
        product: i.productId as any,
        title: i.title,
        slug: i.slug,
        image: i.image,
        unit: i.unit,
        pricePerUnit: i.pricePerUnit,
        quantity: i.quantity,
        subtotal: i.subtotal,
      })),
      pricing: {
        subtotal: finalPricing.subtotal,
        deliveryFee: finalPricing.deliveryFee,
        discount: finalPricing.discount,
        taxes: 0,
        total: finalPricing.total,
      },
      deliveryAddress,
      deliveryZone: eligibility.zone?._id,
      deliverySlot: deliverySlot
        ? {
            slotId: deliverySlot.slotId,
            title: deliverySlot.title,
            date: new Date(deliverySlot.date),
          }
        : undefined,
      payment: {
        method: paymentMethod,
        provider: paymentMethod === PAYMENT_METHODS.COD ? "COD" : "RAZORPAY",
        razorpayOrderId,
        status:
          paymentMethod === PAYMENT_METHODS.COD
            ? PAYMENT_STATUSES.PENDING
            : PAYMENT_STATUSES.PENDING,
      },
      status: ORDER_STATUSES.PLACED,
      statusHistory: [
        {
          status: ORDER_STATUSES.PLACED,
          timestamp: new Date(),
          notes: "Order placed via online platform.",
        },
      ],
      couponApplied: couponCode
        ? { code: couponCode, discountAmount: finalPricing.discount }
        : undefined,
      orderNotes,
    });

    // 8. Trigger Email Notification
    notificationService.sendOrderConfirmation(order).catch(console.error);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.pricing.total,
        razorpayOrderId,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        paymentMethod,
      },
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await orderRepository.listCustomerOrders(
      session.userId,
      session.email
    );
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
