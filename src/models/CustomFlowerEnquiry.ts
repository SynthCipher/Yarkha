import mongoose, { Schema, Document, Model } from "mongoose";
import {
  FLOWER_OCCASIONS,
  FlowerOccasion,
  FLOWER_ENQUIRY_STATUSES,
  FlowerEnquiryStatus,
} from "@/config/constants";

export interface ICustomFlowerEnquiry extends Document {
  enquiryNumber: string;
  customer?: mongoose.Types.ObjectId;
  contactName: string;
  phone: string;
  email?: string;
  occasion: FlowerOccasion;
  preferredDate: Date;
  budgetRange?: string;
  flowerPreferences?: string;
  colorPalette?: string;
  messageNote?: string;
  additionalRequirements?: string;
  referenceImages: string[];
  status: FlowerEnquiryStatus;
  quoteAmount?: number;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomFlowerEnquirySchema = new Schema<ICustomFlowerEnquiry>(
  {
    enquiryNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    contactName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true },
    occasion: {
      type: String,
      enum: Object.values(FLOWER_OCCASIONS),
      required: true,
      default: FLOWER_OCCASIONS.OTHER,
    },
    preferredDate: { type: Date, required: true },
    budgetRange: { type: String },
    flowerPreferences: { type: String },
    colorPalette: { type: String },
    messageNote: { type: String },
    additionalRequirements: { type: String },
    referenceImages: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(FLOWER_ENQUIRY_STATUSES),
      default: FLOWER_ENQUIRY_STATUSES.NEW,
      index: true,
    },
    quoteAmount: { type: Number, min: 0 },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const CustomFlowerEnquiry: Model<ICustomFlowerEnquiry> =
  mongoose.models.CustomFlowerEnquiry ||
  mongoose.model<ICustomFlowerEnquiry>(
    "CustomFlowerEnquiry",
    CustomFlowerEnquirySchema
  );
