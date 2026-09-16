import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  seo: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String, required: true },
    author: { type: String, required: true, default: "Yarkha Farm Team" },
    category: { type: String, required: true, default: "Himalayan Agriculture" },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
    seo: {
      title: { type: String },
      description: { type: String },
      canonicalUrl: { type: String },
    },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
