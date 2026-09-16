import { connectDB } from "@/lib/db/connect";
import { Order, IOrder } from "@/models/Order";
import { OrderStatus } from "@/config/constants";

export const orderRepository = {
  async create(orderData: Partial<IOrder>): Promise<IOrder> {
    await connectDB();
    const order = new Order(orderData);
    return await order.save();
  },

  async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    await connectDB();
    return await Order.findOne({ orderNumber }).populate("customer");
  },

  async findById(id: string): Promise<IOrder | null> {
    await connectDB();
    return await Order.findById(id).populate("customer");
  },

  async listCustomerOrders(
    customerId: string,
    email?: string,
    phone?: string
  ): Promise<IOrder[]> {
    await connectDB();
    const orConditions: any[] = [{ customer: customerId }];
    if (email) {
      orConditions.push({ "guestInfo.email": email.toLowerCase().trim() });
    }
    if (phone) {
      orConditions.push({ "guestInfo.phone": phone.trim() });
      orConditions.push({ "deliveryAddress.phone": phone.trim() });
    }
    return await Order.find({ $or: orConditions }).sort({ createdAt: -1 });
  },

  async listAll(filters: { status?: OrderStatus; limit?: number; page?: number } = {}) {
    await connectDB();
    const query: any = {};
    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("customer"),
      Order.countDocuments(query),
    ]);

    return { orders, total, page, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    updatedBy?: string,
    notes?: string
  ): Promise<IOrder | null> {
    await connectDB();
    return await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            updatedBy,
            notes,
          },
        },
      },
      { new: true }
    );
  },

  async getMetrics() {
    await connectDB();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, totalRevenueData] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({
        status: { $in: ["PLACED", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY"] },
      }),
      Order.aggregate([
        { $match: { "payment.status": "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$pricing.total" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;
    return { todayOrders, pendingOrders, totalRevenue };
  },
};
