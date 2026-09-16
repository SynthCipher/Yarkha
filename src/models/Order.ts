import mongoose, { Schema, Document, Model } from "mongoose";
import {
  ORDER_STATUSES,
  OrderStatus,
  PAYMENT_METHODS,
  PaymentMethod,
  PAYMENT_STATUSES,
  PaymentStatus,
  PRODUCT_UNITS,
  ProductUnit,
} from "@/config/constants";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  image: string;
  unit: ProductUnit;
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  updatedBy?: string;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer?: mongoose.Types.ObjectId;
  guestInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    taxes: number;
    total: number;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    streetAddress: string;
    locality: string;
    landmark?: string;
    postalCode: string;
    city: string;
    state: string;
  };
  deliveryZone?: mongoose.Types.ObjectId;
  deliverySlot?: {
    slotId: string;
    title: string;
    date: Date;
  };
  payment: {
    method: PaymentMethod;
    provider: "RAZORPAY" | "COD";
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: PaymentStatus;
  };
  status: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  couponApplied?: {
    code: string;
    discountAmount: number;
  };
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    unit: { type: String, enum: PRODUCT_UNITS, required: true },
    pricePerUnit: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0.1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestInfo: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: { type: String, trim: true },
    },
    items: [OrderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      deliveryFee: { type: Number, required: true, default: 0, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      taxes: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      streetAddress: { type: String, required: true },
      locality: { type: String, required: true },
      landmark: { type: String },
      postalCode: { type: String, required: true, default: "194101" },
      city: { type: String, required: true, default: "Leh" },
      state: { type: String, required: true, default: "Ladakh" },
    },
    deliveryZone: { type: Schema.Types.ObjectId, ref: "DeliveryZone" },
    deliverySlot: {
      slotId: { type: String },
      title: { type: String },
      date: { type: Date },
    },
    payment: {
      method: {
        type: String,
        enum: Object.values(PAYMENT_METHODS),
        default: PAYMENT_METHODS.RAZORPAY,
      },
      provider: {
        type: String,
        enum: ["RAZORPAY", "COD"],
        default: "RAZORPAY",
      },
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      status: {
        type: String,
        enum: Object.values(PAYMENT_STATUSES),
        default: PAYMENT_STATUSES.PENDING,
        index: true,
      },
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.PLACED,
      index: true,
    },
    statusHistory: [OrderStatusHistorySchema],
    couponApplied: {
      code: { type: String },
      discountAmount: { type: Number, default: 0 },
    },
    orderNotes: { type: String },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
