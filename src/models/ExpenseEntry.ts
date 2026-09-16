import mongoose, { Schema, Document, Model } from "mongoose";
import {
  EXPENSE_CATEGORIES,
  ExpenseCategory,
  EXPENSE_SECTIONS,
  ExpenseSection,
} from "@/config/constants";

export interface IExpenseEntry extends Document {
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  linkedSection: ExpenseSection;
  paidTo?: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseEntrySchema = new Schema<IExpenseEntry>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now, index: true },
    linkedSection: {
      type: String,
      enum: EXPENSE_SECTIONS,
      required: true,
      default: "GENERAL",
      index: true,
    },
    paidTo: { type: String, trim: true },
    notes: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

ExpenseEntrySchema.index({ linkedSection: 1, date: -1 });

export const ExpenseEntry: Model<IExpenseEntry> =
  mongoose.models.ExpenseEntry ||
  mongoose.model<IExpenseEntry>("ExpenseEntry", ExpenseEntrySchema);
