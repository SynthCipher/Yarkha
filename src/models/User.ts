import mongoose, { Schema, Document, Model } from "mongoose";
import { USER_ROLES, UserRole } from "@/config/constants";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  phone?: string;
  passwordHash?: string;
  password?: string;
  role: UserRole;
  b2bProfile?: {
    businessName: string;
    businessType: "HOTEL" | "RESTAURANT" | "CAFE" | "RETAILER" | "OTHER";
    taxId?: string;
    isApproved: boolean;
  };
  savedAddresses: Array<{
    fullName: string;
    phone: string;
    streetAddress: string;
    locality: string;
    landmark?: string;
    postalCode: string;
    city: string;
    state: string;
    isDefault?: boolean;
  }>;
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    streetAddress: { type: String, required: true, trim: true },
    locality: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    postalCode: { type: String, required: true, default: "194101" },
    city: { type: String, required: true, default: "Leh" },
    state: { type: String, required: true, default: "Ladakh" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: { type: String, trim: true, lowercase: true, index: true },
    phone: { type: String, trim: true, index: true },
    passwordHash: { type: String, required: false },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
      index: true,
    },
    b2bProfile: {
      businessName: { type: String, trim: true },
      businessType: {
        type: String,
        enum: ["HOTEL", "RESTAURANT", "CAFE", "RETAILER", "OTHER"],
      },
      taxId: { type: String, trim: true },
      isApproved: { type: Boolean, default: false },
    },
    savedAddresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
