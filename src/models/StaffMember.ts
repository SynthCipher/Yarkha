import mongoose, { Schema, Document, Model } from "mongoose";
import { STAFF_ROLES, StaffRole, WAGE_TYPES, WageType } from "@/config/constants";

export interface IStaffMember extends Document {
  name: string;
  role: StaffRole;
  contact: string; // phone number
  wageType: WageType;
  wageRate: number; // Daily rate or monthly base salary in INR
  startDate: Date;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffMemberSchema = new Schema<IStaffMember>(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: STAFF_ROLES,
      required: true,
      index: true,
    },
    contact: { type: String, required: true, trim: true },
    wageType: {
      type: String,
      enum: Object.values(WAGE_TYPES),
      required: true,
      default: WAGE_TYPES.DAILY,
    },
    wageRate: { type: Number, required: true, min: 0 },
    startDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true, index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const StaffMember: Model<IStaffMember> =
  mongoose.models.StaffMember || mongoose.model<IStaffMember>("StaffMember", StaffMemberSchema);
