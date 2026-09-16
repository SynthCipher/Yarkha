import mongoose, { Schema, Document, Model } from "mongoose";
import { COUPON_TYPES, CouponType } from "@/config/constants";

export interface ICoupon extends Document {
  code: string;
  discountType: CouponType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: Object.values(COUPON_TYPES),
      required: true,
      default: COUPON_TYPES.PERCENTAGE,
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, required: true, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, min: 1 },
    timesUsed: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
