import mongoose, { Schema, Document, Model } from "mongoose";
import {
  PRODUCT_TYPES,
  ProductType,
  PRODUCT_UNITS,
  ProductUnit,
  SHIPPING_ELIGIBILITY,
  ShippingEligibility,
  PRODUCT_STATUS,
  ProductStatus,
  FULFILLMENT_TYPES,
  FulfillmentType,
} from "@/config/constants";

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  productType: ProductType;
  fulfillmentType: FulfillmentType;
  description: string;
  shortDescription?: string;
  images: string[];
  unit: ProductUnit;
  pricePerUnit: number;
  compareAtPrice?: number;
  availableQuantity: number;
  reservedQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  orderCutoffTime?: string; // e.g. "14:00" for LOCAL_PERISHABLE
  harvestDate?: Date;
  farmBatch?: mongoose.Types.ObjectId;
  isDailyAvailable: boolean;
  isSeasonal: boolean;
  shippingEligibility: ShippingEligibility;
  storageInstructions?: string;
  shelfLife?: string;
  ingredients?: string[];
  status: ProductStatus;
  featured: boolean;
  pashminaHeritage?: {
    origin: string; // e.g. "Kharnak, Changthang Plateau"
    craftsmanship: string; // e.g. "Handspun on traditional charkha, woven on wooden looms"
    careInstructions: string;
    artisanNotes?: string;
  };
  saplingDetails?: {
    idealPlantingSeason: string;
    heightInCm?: number;
    sunRequirement: string;
    nativeElevationMeters?: number;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  reviewsCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    productType: {
      type: String,
      enum: Object.values(PRODUCT_TYPES),
      required: true,
      index: true,
    },
    fulfillmentType: {
      type: String,
      enum: Object.values(FULFILLMENT_TYPES),
      required: true,
      default: FULFILLMENT_TYPES.LOCAL_PERISHABLE,
      index: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    images: [{ type: String, required: true }],
    unit: {
      type: String,
      enum: PRODUCT_UNITS,
      required: true,
      default: "kg",
    },
    pricePerUnit: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    availableQuantity: { type: Number, required: true, default: 0, min: 0 },
    reservedQuantity: { type: Number, required: true, default: 0, min: 0 },
    minOrderQuantity: { type: Number, required: true, default: 1, min: 0.1 },
    maxOrderQuantity: { type: Number, required: true, default: 20 },
    orderCutoffTime: { type: String, default: "14:00" },
    harvestDate: { type: Date },
    farmBatch: { type: Schema.Types.ObjectId, ref: "FarmBatch" },
    isDailyAvailable: { type: Boolean, default: true },
    isSeasonal: { type: Boolean, default: false },
    shippingEligibility: {
      type: String,
      enum: Object.values(SHIPPING_ELIGIBILITY),
      default: SHIPPING_ELIGIBILITY.LOCAL_DELIVERY_ONLY,
      index: true,
    },
    storageInstructions: { type: String },
    shelfLife: { type: String },
    ingredients: [{ type: String }],
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.PUBLISHED,
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    pashminaHeritage: {
      origin: { type: String, trim: true },
      craftsmanship: { type: String, trim: true },
      careInstructions: { type: String, trim: true },
      artisanNotes: { type: String, trim: true },
    },
    saplingDetails: {
      idealPlantingSeason: { type: String, trim: true },
      heightInCm: { type: Number },
      sunRequirement: { type: String, trim: true },
      nativeElevationMeters: { type: Number },
    },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: [{ type: String }],
    },
    reviewsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 5, min: 0, max: 5 },
  },
  { timestamps: true }
);

if (mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product: Model<IProduct> =
  mongoose.model<IProduct>("Product", ProductSchema);
