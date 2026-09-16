import mongoose, { Schema, Document, Model } from "mongoose";
import { ATTENDANCE_STATUSES, AttendanceStatus } from "@/config/constants";

export interface IAttendance extends Document {
  staffMember: mongoose.Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  wageCalculated: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    staffMember: {
      type: Schema.Types.ObjectId,
      ref: "StaffMember",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUSES),
      required: true,
      default: ATTENDANCE_STATUSES.PRESENT,
    },
    wageCalculated: { type: Number, required: true, default: 0, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

// One attendance record per staff member per calendar day
AttendanceSchema.index({ staffMember: 1, date: 1 });

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
