import mongoose, { Schema, Document, Model } from "mongoose";
import { REVIEW_STATUSES, ReviewStatus } from "@/config/constants";

export interface IReview extends Document {
  product?: mongoose.Types.ObjectId;
  productTitle?: string;
  authorName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  verifiedBuyer: boolean;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    productTitle: { type: String, trim: true },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    verifiedBuyer: { type: Boolean, default: true },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUSES),
      default: REVIEW_STATUSES.APPROVED,
      index: true,
    },
  },
  { timestamps: true }
);

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
