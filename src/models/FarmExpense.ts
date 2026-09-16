import mongoose, { Schema, Document, Model } from "mongoose";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "@/config/constants";

export interface IFarmExpense extends Document {
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  farmBatch?: mongoose.Types.ObjectId;
  farmLocation: string;
  paymentMethod: "CASH" | "UPI" | "BANK_TRANSFER";
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FarmExpenseSchema = new Schema<IFarmExpense>(
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
    farmBatch: { type: Schema.Types.ObjectId, ref: "FarmBatch" },
    farmLocation: {
      type: String,
      required: true,
      default: "Stakna Farm, Indus Valley",
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER"],
      default: "UPI",
    },
    receiptUrl: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const FarmExpense: Model<IFarmExpense> =
  mongoose.models.FarmExpense ||
  mongoose.model<IFarmExpense>("FarmExpense", FarmExpenseSchema);
