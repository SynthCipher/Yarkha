import { connectDB } from "@/lib/db/connect";
import { DeliveryZone, IDeliveryZone } from "@/models/DeliveryZone";
import { DeliverySlot, IDeliverySlot } from "@/models/DeliverySlot";
import { Order } from "@/models/Order";

export const deliveryRepository = {
  async listActiveZones(): Promise<IDeliveryZone[]> {
    await connectDB();
    return await DeliveryZone.find({ isActive: true }).sort({ name: 1 });
  },

  async findZoneByLocality(locality: string): Promise<IDeliveryZone | null> {
    await connectDB();
    const regex = new RegExp(`^${locality.trim()}$`, "i");
    return await DeliveryZone.findOne({
      isActive: true,
      areas: { $regex: regex },
    });
  },

  async listActiveSlots(): Promise<IDeliverySlot[]> {
    await connectDB();
    return await DeliverySlot.find({ isActive: true }).sort({ startTime: 1 });
  },

  async getSlotBookingCountForDate(slotId: string, dateStr: string): Promise<number> {
    await connectDB();
    const targetDate = new Date(dateStr);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return await Order.countDocuments({
      "deliverySlot.slotId": slotId,
      "deliverySlot.date": { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["CANCELLED", "PAYMENT_FAILED"] },
    });
  },

  async createZone(data: Partial<IDeliveryZone>): Promise<IDeliveryZone> {
    await connectDB();
    const zone = new DeliveryZone(data);
    return await zone.save();
  },

  async createSlot(data: Partial<IDeliverySlot>): Promise<IDeliverySlot> {
    await connectDB();
    const slot = new DeliverySlot(data);
    return await slot.save();
  },
};
