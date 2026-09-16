import mongoose, { Schema, Document, Model } from "mongoose";
import { STOCK_CATEGORIES, StockCategory } from "@/config/constants";

export interface IStockItem extends Document {
  name: string;
  category: StockCategory;
  unit: string; // e.g. "kg", "packets", "rolls", "jars", "meters"
  quantityOnHand: number;
  reorderThreshold: number;
  supplier?: string;
  lastRestockedDate?: Date;
  costPerUnit: number;
  location?: string; // e.g. "Greenhouse Shed 2", "Root Cellar", "Wool Store"
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StockItemSchema = new Schema<IStockItem>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: STOCK_CATEGORIES,
      required: true,
      index: true,
    },
    unit: { type: String, required: true, default: "kg" },
    quantityOnHand: { type: Number, required: true, default: 0, min: 0 },
    reorderThreshold: { type: Number, required: true, default: 10, min: 0 },
    supplier: { type: String, trim: true },
    lastRestockedDate: { type: Date },
    costPerUnit: { type: Number, required: true, default: 0, min: 0 },
    location: { type: String, trim: true },
    notes: { type: String },
  },
  { timestamps: true }
);

StockItemSchema.index({ category: 1, quantityOnHand: 1 });

export const StockItem: Model<IStockItem> =
  mongoose.models.StockItem || mongoose.model<IStockItem>("StockItem", StockItemSchema);
