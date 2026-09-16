import { productRepository } from "@/repositories/productRepository";
import { Coupon } from "@/models/Coupon";
import { CartValidationResult, CartItem } from "@/types";
import { PRODUCT_TYPES, FULFILLMENT_TYPES } from "@/config/constants";

export interface RawCartItemInput {
  productId: string;
  quantity: number;
}

export const pricingService = {
  async validateAndCalculateCart({
    items,
    couponCode,
    deliveryFee = 0,
  }: {
    items: RawCartItemInput[];
    couponCode?: string;
    deliveryFee?: number;
  }): Promise<CartValidationResult> {
    const validatedItems: CartItem[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let subtotal = 0;
    let hasPerishableItems = false;
    let hasPanIndiaItems = false;

    for (const raw of items) {
      const product = await productRepository.findById(raw.productId);
      if (!product || product.status !== "PUBLISHED") {
        errors.push(`A product in your cart is no longer available.`);
        continue;
      }

      const availableStock = product.availableQuantity - product.reservedQuantity;
      if (availableStock <= 0) {
        errors.push(`"${product.title}" is currently out of stock.`);
        continue;
      }

      let requestedQty = raw.quantity;
      if (requestedQty < product.minOrderQuantity) {
        warnings.push(
          `Minimum order for "${product.title}" is ${product.minOrderQuantity} ${product.unit}. Adjusted quantity.`
        );
        requestedQty = product.minOrderQuantity;
      }

      if (requestedQty > product.maxOrderQuantity) {
        warnings.push(
          `Maximum order for "${product.title}" is ${product.maxOrderQuantity} ${product.unit}. Adjusted quantity.`
        );
        requestedQty = product.maxOrderQuantity;
      }

      if (requestedQty > availableStock) {
        warnings.push(
          `Only ${availableStock} ${product.unit} of "${product.title}" remaining in harvest today.`
        );
        requestedQty = availableStock;
      }

      const itemSubtotal = Math.round(requestedQty * product.pricePerUnit);
      subtotal += itemSubtotal;

      const itemFulfillment =
        product.fulfillmentType ||
        (product.productType === PRODUCT_TYPES.VALUE_ADDED ||
        product.productType === PRODUCT_TYPES.PASHMINA
          ? FULFILLMENT_TYPES.SHIPPABLE
          : FULFILLMENT_TYPES.LOCAL_PERISHABLE);

      if (itemFulfillment === FULFILLMENT_TYPES.LOCAL_PERISHABLE) {
        hasPerishableItems = true;
      } else {
        hasPanIndiaItems = true;
      }

      validatedItems.push({
        productId: product._id.toString(),
        title: product.title,
        slug: product.slug,
        image: product.images[0] || "/images/hero.jpg",
        unit: product.unit,
        pricePerUnit: product.pricePerUnit,
        quantity: requestedQty,
        productType: product.productType,
        fulfillmentType: itemFulfillment,
        shippingEligibility: product.shippingEligibility,
        subtotal: itemSubtotal,
      });
    }

    // Coupon calculation
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
      });

      if (coupon) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === "PERCENTAGE") {
            const rawDiscount = (subtotal * coupon.discountValue) / 100;
            discount = coupon.maxDiscountAmount
              ? Math.min(rawDiscount, coupon.maxDiscountAmount)
              : rawDiscount;
          } else {
            discount = coupon.discountValue;
          }
          discount = Math.min(discount, subtotal);
        } else {
          warnings.push(
            `Coupon "${coupon.code}" requires a minimum order value of ₹${coupon.minOrderValue}.`
          );
        }
      } else {
        warnings.push(`Invalid or expired coupon code.`);
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discount);

    return {
      isValid: errors.length === 0 && validatedItems.length > 0,
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount,
      total,
      errors,
      warnings,
      hasPerishableItems,
      hasPanIndiaItems,
    };
  },
};
