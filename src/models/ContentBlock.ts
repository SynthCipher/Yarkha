import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContentBlock extends Document {
  key: string; // unique slug e.g. "farm-story", "pashmina-heritage", "homepage-hero"
  title: string;
  section: string;
  content: string; // Markdown or HTML
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ContentBlockSchema = new Schema<IContentBlock>(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    section: { type: String, required: true, default: "general", index: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const ContentBlock: Model<IContentBlock> =
  mongoose.models.ContentBlock ||
  mongoose.model<IContentBlock>("ContentBlock", ContentBlockSchema);
