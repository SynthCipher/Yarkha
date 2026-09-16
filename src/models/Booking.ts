import mongoose, { Schema, Document, Model } from "mongoose";
import { BOOKING_STATUSES, BookingStatus } from "@/config/constants";

export interface IBooking extends Document {
  unitTitle: string; // e.g., "Solar Thermal Eco-Cottage #1"
  checkInDate: Date;
  checkOutDate: Date;
  guestCount: number;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  status: BookingStatus;
  totalPrice?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    unitTitle: { type: String, required: true, default: "Stakna Farmhouse Retreat" },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guestCount: { type: Number, required: true, default: 2, min: 1 },
    guestInfo: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUSES),
      default: BOOKING_STATUSES.INQUIRY,
      index: true,
    },
    totalPrice: { type: Number, min: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
