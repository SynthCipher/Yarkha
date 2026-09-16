import { deliveryRepository } from "@/repositories/deliveryRepository";
import { PRODUCT_TYPES, ProductType, SHIPPING_ELIGIBILITY } from "@/config/constants";

export interface DeliveryEligibilityResult {
  isEligible: boolean;
  zone: any | null;
  deliveryFee: number;
  minOrderValue: number;
  reason?: string;
}

export const deliveryService = {
  async checkEligibility({
    locality,
    postalCode,
    cartProductTypes,
    orderSubtotal,
  }: {
    locality: string;
    postalCode?: string;
    cartProductTypes: ProductType[];
    orderSubtotal: number;
  }): Promise<DeliveryEligibilityResult> {
    const hasFreshPerishables = cartProductTypes.some(
      (t) =>
        t === PRODUCT_TYPES.VEGETABLE ||
        t === PRODUCT_TYPES.FLOWER ||
        t === PRODUCT_TYPES.SAPLING ||
        t === PRODUCT_TYPES.SEASONAL
    );

    // Find zone by locality
    const matchedZone = await deliveryRepository.findZoneByLocality(locality);

    if (hasFreshPerishables) {
      if (!matchedZone) {
        return {
          isEligible: false,
          zone: null,
          deliveryFee: 0,
          minOrderValue: 0,
          reason: `Fresh vegetables, flowers, and saplings are hand-delivered within the Leh Valley only. "${locality}" is outside our local delivery zone. Please choose a Leh delivery address or order Pan-India shippable preserves & pashmina.`,
        };
      }

      if (orderSubtotal < matchedZone.minOrderValue) {
        return {
          isEligible: false,
          zone: matchedZone,
          deliveryFee: matchedZone.deliveryFee,
          minOrderValue: matchedZone.minOrderValue,
          reason: `Minimum fresh produce order for ${matchedZone.name} is ₹${matchedZone.minOrderValue}. Please add ₹${matchedZone.minOrderValue - orderSubtotal} more to proceed.`,
        };
      }

      const deliveryFee =
        matchedZone.freeDeliveryThreshold &&
        orderSubtotal >= matchedZone.freeDeliveryThreshold
          ? 0
          : matchedZone.deliveryFee;

      return {
        isEligible: true,
        zone: matchedZone,
        deliveryFee,
        minOrderValue: matchedZone.minOrderValue,
      };
    }

    // Only value-added & pashmina non-perishables (pan-India eligible)
    if (matchedZone) {
      const deliveryFee =
        matchedZone.freeDeliveryThreshold &&
        orderSubtotal >= matchedZone.freeDeliveryThreshold
          ? 0
          : matchedZone.deliveryFee;

      return {
        isEligible: true,
        zone: matchedZone,
        deliveryFee,
        minOrderValue: matchedZone.minOrderValue,
      };
    }

    // Standard national courier rate for shippable products outside Leh (Free above ₹2,000 / Pashmina)
    const panIndiaDeliveryFee = orderSubtotal >= 2000 ? 0 : 120;
    return {
      isEligible: true,
      zone: null,
      deliveryFee: panIndiaDeliveryFee,
      minOrderValue: 300,
    };
  },

  async getAvailableSlotsForDate(dateStr: string) {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday
    const allSlots = await deliveryRepository.listActiveSlots();

    const availableSlots = [];

    for (const slot of allSlots) {
      if (!slot.activeDays.includes(dayOfWeek)) {
        continue;
      }

      const bookedCount = await deliveryRepository.getSlotBookingCountForDate(
        slot._id.toString(),
        dateStr
      );

      const remainingCapacity = Math.max(0, slot.maxOrdersPerDay - bookedCount);

      availableSlots.push({
        id: slot._id.toString(),
        title: slot.title,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isFull: remainingCapacity === 0,
        remainingCapacity,
      });
    }

    return availableSlots;
  },
};
