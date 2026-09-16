import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeliverySlot extends Document {
  title: string;
  startTime: string; // "16:00"
  endTime: string; // "17:00"
  cutoffMinutesBefore: number; // e.g. 120 minutes before startTime
  maxOrdersPerDay: number;
  activeDays: number[]; // 0=Sunday, 1=Monday... 6=Saturday
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliverySlotSchema = new Schema<IDeliverySlot>(
  {
    title: { type: String, required: true, trim: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    cutoffMinutesBefore: { type: Number, default: 120 },
    maxOrdersPerDay: { type: Number, required: true, default: 30, min: 1 },
    activeDays: [{ type: Number, min: 0, max: 6, default: [0, 1, 2, 3, 4, 5, 6] }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const DeliverySlot: Model<IDeliverySlot> =
  mongoose.models.DeliverySlot ||
  mongoose.model<IDeliverySlot>("DeliverySlot", DeliverySlotSchema);
