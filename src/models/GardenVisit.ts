import mongoose, { Schema, Document, Model } from "mongoose";
import { GARDEN_VISIT_STATUSES, GardenVisitStatus } from "@/config/constants";

export interface IGardenVisit extends Document {
  visitorName: string;
  email: string;
  phone: string;
  preferredDate: Date;
  groupSize: number;
  purpose?: string;
  status: GardenVisitStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GardenVisitSchema = new Schema<IGardenVisit>(
  {
    visitorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true, index: true },
    groupSize: { type: Number, required: true, default: 2, min: 1, max: 50 },
    purpose: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(GARDEN_VISIT_STATUSES),
      default: GARDEN_VISIT_STATUSES.NEW,
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const GardenVisit: Model<IGardenVisit> =
  mongoose.models.GardenVisit ||
  mongoose.model<IGardenVisit>("GardenVisit", GardenVisitSchema);
