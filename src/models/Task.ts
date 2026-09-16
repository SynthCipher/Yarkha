import mongoose, { Schema, Document, Model } from "mongoose";
import { TASK_STATUSES, TaskStatus, TASK_PRIORITIES, TaskPriority } from "@/config/constants";

export interface ITask extends Document {
  title: string;
  description?: string;
  category: "FARM" | "GREENHOUSE" | "PASHMINA" | "DELIVERY" | "MAINTENANCE" | "OTHER";
  assignedTo?: mongoose.Types.ObjectId;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  linkedBatch?: mongoose.Types.ObjectId;
  linkedOrder?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["FARM", "GREENHOUSE", "PASHMINA", "DELIVERY", "MAINTENANCE", "OTHER"],
      required: true,
      default: "FARM",
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "StaffMember",
      index: true,
    },
    dueDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(TASK_STATUSES),
      required: true,
      default: TASK_STATUSES.OPEN,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITIES),
      required: true,
      default: TASK_PRIORITIES.MEDIUM,
    },
    linkedBatch: {
      type: Schema.Types.ObjectId,
      ref: "FarmBatch",
    },
    linkedOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
