export const USER_ROLES = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  FARM_MANAGER: "FARM_MANAGER",
  DELIVERY_STAFF: "DELIVERY_STAFF",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const FULFILLMENT_TYPES = {
  LOCAL_PERISHABLE: "LOCAL_PERISHABLE",
  SHIPPABLE: "SHIPPABLE",
} as const;

export type FulfillmentType = (typeof FULFILLMENT_TYPES)[keyof typeof FULFILLMENT_TYPES];

export const PRODUCT_TYPES = {
  VEGETABLE: "VEGETABLE",
  FLOWER: "FLOWER",
  SAPLING: "SAPLING",
  VALUE_ADDED: "VALUE_ADDED",
  PASHMINA: "PASHMINA",
  BASKET: "BASKET",
  SEASONAL: "SEASONAL",
} as const;

export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

export const STORE_SECTIONS = {
  VEGETABLES: "VEGETABLES",
  FLOWERS: "FLOWERS",
  SAPLINGS: "SAPLINGS",
  VALUE_ADDED: "VALUE_ADDED",
  PASHMINA: "PASHMINA",
  FARMSTAY: "FARMSTAY",
} as const;

export type StoreSection = (typeof STORE_SECTIONS)[keyof typeof STORE_SECTIONS];

export const PRODUCT_UNITS = [
  "kg",
  "gram",
  "500g",
  "250g",
  "piece",
  "bunch",
  "bouquet",
  "box",
  "packet",
  "jar",
  "bottle",
  "sapling",
  "shawl",
  "stole",
  "scarf",
] as const;

export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export const SHIPPING_ELIGIBILITY = {
  LOCAL_DELIVERY_ONLY: "LOCAL_DELIVERY_ONLY",
  PAN_INDIA_ELIGIBLE: "PAN_INDIA_ELIGIBLE",
} as const;

export type ShippingEligibility = (typeof SHIPPING_ELIGIBILITY)[keyof typeof SHIPPING_ELIGIBILITY];

export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const ORDER_STATUSES = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY_FOR_DELIVERY: "READY_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const PAYMENT_METHODS = {
  RAZORPAY: "RAZORPAY",
  COD: "COD",
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const PAYMENT_STATUSES = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

export const FARM_BATCH_STATUSES = {
  PLANNED: "PLANNED",
  SOWED: "SOWED",
  GROWING: "GROWING",
  HARVESTING: "HARVESTING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type FarmBatchStatus = (typeof FARM_BATCH_STATUSES)[keyof typeof FARM_BATCH_STATUSES];

// Physical Farm Operations Constants
export const STOCK_CATEGORIES = [
  "SEEDS",
  "MANURE_COMPOST",
  "PACKAGING_JARS_LABELS",
  "RAW_PASHMINA_WOOL",
  "GREENHOUSE_SHEETING",
  "IRRIGATION_SUPPLIES",
  "TOOLS_CONSUMABLES",
  "OTHER",
] as const;

export type StockCategory = (typeof STOCK_CATEGORIES)[number];

export const STAFF_ROLES = [
  "FARM_HAND",
  "GARDENER",
  "DELIVERY_STAFF",
  "PASHMINA_ARTISAN",
  "ADMIN",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export const WAGE_TYPES = {
  DAILY: "DAILY",
  MONTHLY: "MONTHLY",
} as const;

export type WageType = (typeof WAGE_TYPES)[keyof typeof WAGE_TYPES];

export const ATTENDANCE_STATUSES = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  HALF_DAY: "HALF_DAY",
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[keyof typeof ATTENDANCE_STATUSES];

export const TASK_STATUSES = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES];

export const TASK_PRIORITIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export const EQUIPMENT_CONDITIONS = {
  EXCELLENT: "EXCELLENT",
  GOOD: "GOOD",
  NEEDS_MAINTENANCE: "NEEDS_MAINTENANCE",
  REPAIR_REQUIRED: "REPAIR_REQUIRED",
} as const;

export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[keyof typeof EQUIPMENT_CONDITIONS];

export const EXPENSE_CATEGORIES = [
  "LABOR",
  "MATERIALS",
  "EQUIPMENT",
  "UTILITIES",
  "TRANSPORT",
  "OTHER",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_SECTIONS = [
  "VEGETABLES",
  "FLOWERS",
  "SAPLINGS",
  "VALUE_ADDED",
  "PASHMINA",
  "FARMSTAY",
  "GENERAL",
] as const;

export type ExpenseSection = (typeof EXPENSE_SECTIONS)[number];

export const GARDEN_VISIT_STATUSES = {
  NEW: "NEW",
  APPROVED: "APPROVED",
  CONTACTED: "CONTACTED",
  CANCELLED: "CANCELLED",
} as const;

export type GardenVisitStatus = (typeof GARDEN_VISIT_STATUSES)[keyof typeof GARDEN_VISIT_STATUSES];

export const BOOKING_STATUSES = {
  INQUIRY: "INQUIRY",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export const REVIEW_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

export const FLOWER_OCCASIONS = {
  WEDDING: "WEDDING",
  EVENT: "EVENT",
  ANNIVERSARY: "ANNIVERSARY",
  BIRTHDAY: "BIRTHDAY",
  TEMPLE_OFFERING: "TEMPLE_OFFERING",
  OTHER: "OTHER",
} as const;

export type FlowerOccasion = (typeof FLOWER_OCCASIONS)[keyof typeof FLOWER_OCCASIONS];

export const FLOWER_ENQUIRY_STATUSES = {
  NEW: "NEW",
  REVIEWED: "REVIEWED",
  QUOTED: "QUOTED",
  CONFIRMED: "CONFIRMED",
  FULFILLED: "FULFILLED",
  CANCELLED: "CANCELLED",
} as const;

export type FlowerEnquiryStatus = (typeof FLOWER_ENQUIRY_STATUSES)[keyof typeof FLOWER_ENQUIRY_STATUSES];

export const COUPON_TYPES = {
  PERCENTAGE: "PERCENTAGE",
  FLAT: "FLAT",
} as const;

export type CouponType = (typeof COUPON_TYPES)[keyof typeof COUPON_TYPES];

export const APP_CONFIG = {
  name: "Stakna Farmhouse",
  tagline: "Farm-to-Home Fresh Produce, High-Altitude Blooms & Pashmina · Stakna, Ladakh",
  description:
    "A 2-acre regenerative farm on the Indus River in Stakna, Ladakh. Fresh morning vegetables, solar-greenhouse flowers, native fruit saplings, artisanal preserves, and heritage Pashmina wool.",
  currencySymbol: "₹",
  currencyCode: "INR",
  defaultTaxPercentage: 0,
  defaultOrderCutoffHour: 14, // 2:00 PM cutoff for next-day morning delivery
  contact: {
    phone: "+91 94191 78901",
    whatsapp: "+919419178901",
    email: "contact@staknafarmhouse.com",
    address: "2-Acre Plot, Stakna Village, Indus Valley, Leh District, Ladakh 194201",
  },
  landStage: "Early Land-Development Stage",
  elevation: "3,250m / 10,660ft",
  climateZone: "Cold Arid Trans-Himalayan Plateau",
};
