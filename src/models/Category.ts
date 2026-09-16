import mongoose, { Schema, Document, Model } from "mongoose";
import { PRODUCT_TYPES, ProductType } from "@/config/constants";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productType: ProductType;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, trim: true },
    image: { type: String },
    productType: {
      type: String,
      enum: Object.values(PRODUCT_TYPES),
      required: true,
      index: true,
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

if (mongoose.models.Category) {
  delete (mongoose.models as any).Category;
}

export const Category: Model<ICategory> =
  mongoose.model<ICategory>("Category", CategorySchema);
