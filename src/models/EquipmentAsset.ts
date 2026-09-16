import mongoose, { Schema, Document, Model } from "mongoose";
import { EQUIPMENT_CONDITIONS, EquipmentCondition } from "@/config/constants";

export interface IEquipmentAsset extends Document {
  name: string;
  type: string; // e.g. "Tiller", "Solar Irrigation Pump", "Greenhouse Structure", "Delivery Vehicle"
  serialNumber?: string;
  purchaseDate?: Date;
  condition: EquipmentCondition;
  lastMaintenanceDate?: Date;
  nextMaintenanceDueDate?: Date;
  maintenanceCost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentAssetSchema = new Schema<IEquipmentAsset>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    serialNumber: { type: String, trim: true },
    purchaseDate: { type: Date },
    condition: {
      type: String,
      enum: Object.values(EQUIPMENT_CONDITIONS),
      required: true,
      default: EQUIPMENT_CONDITIONS.GOOD,
      index: true,
    },
    lastMaintenanceDate: { type: Date },
    nextMaintenanceDueDate: { type: Date, index: true },
    maintenanceCost: { type: Number, default: 0, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const EquipmentAsset: Model<IEquipmentAsset> =
  mongoose.models.EquipmentAsset ||
  mongoose.model<IEquipmentAsset>("EquipmentAsset", EquipmentAssetSchema);
