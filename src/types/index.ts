import {
  UserRole,
  ProductType,
  ProductUnit,
  ShippingEligibility,
  ProductStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  FarmBatchStatus,
  FlowerOccasion,
  FlowerEnquiryStatus,
  CouponType,
  FulfillmentType,
  StockCategory,
  StaffRole,
  WageType,
  AttendanceStatus,
  TaskStatus,
  TaskPriority,
  EquipmentCondition,
  ExpenseCategory,
  ExpenseSection,
  GardenVisitStatus,
  BookingStatus,
  ReviewStatus,
} from "@/config/constants";

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  locality: string;
  landmark?: string;
  postalCode: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  b2bProfile?: {
    businessName: string;
    businessType: "HOTEL" | "RESTAURANT" | "CAFE" | "RETAILER" | "OTHER";
    taxId?: string;
    isApproved: boolean;
  };
  savedAddresses?: Address[];
  createdAt: string;
}

export interface ProductDTO {
  id: string;
  title: string;
  slug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | string;
  productType: ProductType;
  fulfillmentType: FulfillmentType;
  description: string;
  shortDescription?: string;
  images: string[];
  unit: ProductUnit;
  pricePerUnit: number;
  compareAtPrice?: number;
  availableQuantity: number;
  reservedQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  orderCutoffTime?: string;
  harvestDate?: string;
  farmBatchId?: string;
  isDailyAvailable: boolean;
  isSeasonal: boolean;
  shippingEligibility: ShippingEligibility;
  storageInstructions?: string;
  shelfLife?: string;
  ingredients?: string[];
  status: ProductStatus;
  featured: boolean;
  pashminaHeritage?: {
    origin: string; // e.g. "Kharnak, Changthang Plateau"
    craftsmanship: string; // e.g. "Handspun on traditional charkha, woven on wooden looms"
    careInstructions: string;
    artisanNotes?: string;
  };
  saplingDetails?: {
    idealPlantingSeason: string; // e.g. "March - April (Spring) or Oct (Autumn)"
    heightInCm?: number;
    sunRequirement: string;
    nativeElevationMeters?: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  reviewsCount: number;
  averageRating: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productType: ProductType;
  displayOrder: number;
  isActive: boolean;
}

export interface FarmBatchDTO {
  id: string;
  batchCode: string;
  cropName: string;
  farmLocation: string;
  greenhouseId?: string;
  sowingDate: string;
  expectedHarvestDate?: string;
  actualHarvestDate?: string;
  expectedQuantity: number;
  actualHarvestedQuantity?: number;
  availableQuantity: number;
  soldQuantity: number;
  wasteQuantity: number;
  unit: ProductUnit;
  status: FarmBatchStatus;
  notes?: string;
  images?: string[];
}

export interface DeliveryZoneDTO {
  id: string;
  name: string;
  code: string;
  areas: string[];
  deliveryFee: number;
  minOrderValue: number;
  freeDeliveryThreshold?: number;
  allowedProductTypes: ProductType[];
  isActive: boolean;
}

export interface DeliverySlotDTO {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  cutoffMinutesBefore: number;
  maxOrdersPerDay: number;
  activeDays: number[];
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  unit: ProductUnit;
  pricePerUnit: number;
  quantity: number;
  productType: ProductType;
  fulfillmentType: FulfillmentType;
  shippingEligibility: ShippingEligibility;
  subtotal: number;
}

export interface CartValidationResult {
  isValid: boolean;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  errors: string[];
  warnings: string[];
  hasPerishableItems: boolean;
  hasPanIndiaItems: boolean;
}

export interface OrderItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  unit: ProductUnit;
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  customerId?: string;
  guestInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  deliveryAddress: Address;
  deliveryZoneId?: string;
  deliverySlot?: {
    slotId: string;
    title: string;
    date: string;
  };
  payment: {
    method: PaymentMethod;
    provider: "RAZORPAY" | "COD";
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: PaymentStatus;
  };
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    updatedBy?: string;
    notes?: string;
  }>;
  couponApplied?: {
    code: string;
    discountAmount: number;
  };
  orderNotes?: string;
  createdAt: string;
}

// Physical Farm Operations Types
export interface StockItemDTO {
  id: string;
  name: string;
  category: StockCategory;
  unit: string;
  quantityOnHand: number;
  reorderThreshold: number;
  supplier?: string;
  lastRestockedDate?: string;
  costPerUnit: number;
  location?: string;
  isLowStock: boolean;
  notes?: string;
  createdAt?: string;
}

export interface StaffMemberDTO {
  id: string;
  name: string;
  role: StaffRole;
  contact: string;
  wageType: WageType;
  wageRate: number; // Daily rate or monthly salary in INR
  startDate: string;
  active: boolean;
  notes?: string;
  createdAt?: string;
}

export interface AttendanceDTO {
  id: string;
  staffMemberId: string;
  staffMemberName?: string;
  date: string;
  status: AttendanceStatus;
  wageCalculated: number;
  notes?: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  category: "FARM" | "GREENHOUSE" | "PASHMINA" | "DELIVERY" | "MAINTENANCE" | "OTHER";
  assignedStaffId?: string;
  assignedStaffName?: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  linkedBatchId?: string;
  linkedOrderId?: string;
  notes?: string;
  createdAt?: string;
}

export interface EquipmentAssetDTO {
  id: string;
  name: string;
  type: string;
  serialNumber?: string;
  purchaseDate?: string;
  condition: EquipmentCondition;
  lastMaintenanceDate?: string;
  nextMaintenanceDueDate?: string;
  maintenanceCost?: number;
  isMaintenanceDue: boolean;
  notes?: string;
}

export interface ExpenseEntryDTO {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  linkedSection: ExpenseSection;
  paidTo?: string;
  notes?: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface GardenVisitDTO {
  id: string;
  visitorName: string;
  email: string;
  phone: string;
  preferredDate: string;
  groupSize: number;
  purpose?: string;
  status: GardenVisitStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingDTO {
  id: string;
  unitTitle: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  status: BookingStatus;
  totalPrice?: number;
  notes?: string;
  createdAt: string;
}

export interface ReviewDTO {
  id: string;
  productId?: string;
  productTitle?: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedBuyer: boolean;
  status: ReviewStatus;
  createdAt: string;
}

export interface ContentBlockDTO {
  id: string;
  key: string;
  title: string;
  section: string;
  content: string;
  metadata?: Record<string, any>;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
