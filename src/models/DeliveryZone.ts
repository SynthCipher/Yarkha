import mongoose, { Schema, Document, Model } from "mongoose";
import { PRODUCT_TYPES, ProductType } from "@/config/constants";

export interface IDeliveryZone extends Document {
  name: string;
  code: string;
  areas: string[];
  deliveryFee: number;
  minOrderValue: number;
  freeDeliveryThreshold?: number;
  allowedProductTypes: ProductType[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    areas: [{ type: String, required: true, trim: true, index: true }],
    deliveryFee: { type: Number, required: true, default: 50, min: 0 },
    minOrderValue: { type: Number, required: true, default: 200, min: 0 },
    freeDeliveryThreshold: { type: Number, min: 0 },
    allowedProductTypes: [
      {
        type: String,
        enum: Object.values(PRODUCT_TYPES),
        default: Object.values(PRODUCT_TYPES),
      },
    ],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const DeliveryZone: Model<IDeliveryZone> =
  mongoose.models.DeliveryZone ||
  mongoose.model<IDeliveryZone>("DeliveryZone", DeliveryZoneSchema);
