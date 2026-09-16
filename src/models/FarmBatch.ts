import mongoose, { Schema, Document, Model } from "mongoose";
import {
  FARM_BATCH_STATUSES,
  FarmBatchStatus,
  PRODUCT_UNITS,
  ProductUnit,
} from "@/config/constants";

export interface IFarmBatch extends Document {
  batchCode: string;
  cropName: string;
  farmLocation: string;
  greenhouseId?: string;
  sowingDate: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  expectedQuantity: number;
  actualHarvestedQuantity?: number;
  availableQuantity: number;
  soldQuantity: number;
  wasteQuantity: number;
  unit: ProductUnit;
  inputCost?: number;
  seedCost?: number;
  laborCost?: number;
  projectedRevenue?: number;
  status: FarmBatchStatus;
  notes?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FarmBatchSchema = new Schema<IFarmBatch>(
  {
    batchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    cropName: { type: String, required: true, trim: true, index: true },
    farmLocation: { type: String, required: true, default: "Stakna Farm, Indus Valley" },
    greenhouseId: { type: String, trim: true },
    sowingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date },
    actualHarvestDate: { type: Date },
    expectedQuantity: { type: Number, required: true, min: 0 },
    actualHarvestedQuantity: { type: Number, default: 0, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    wasteQuantity: { type: Number, default: 0, min: 0 },
    unit: {
      type: String,
      enum: PRODUCT_UNITS,
      required: true,
      default: "kg",
    },
    inputCost: { type: Number, default: 0, min: 0 },
    seedCost: { type: Number, default: 0, min: 0 },
    laborCost: { type: Number, default: 0, min: 0 },
    projectedRevenue: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: Object.values(FARM_BATCH_STATUSES),
      default: FARM_BATCH_STATUSES.PLANNED,
      index: true,
    },
    notes: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const FarmBatch: Model<IFarmBatch> =
  mongoose.models.FarmBatch || mongoose.model<IFarmBatch>("FarmBatch", FarmBatchSchema);
