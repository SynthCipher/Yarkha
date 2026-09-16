import { connectDB } from "@/lib/db/connect";
import { FarmExpense, IFarmExpense } from "@/models/FarmExpense";
import { Order } from "@/models/Order";
import { FarmBatch } from "@/models/FarmBatch";

export const expenseRepository = {
  async create(data: Partial<IFarmExpense>): Promise<IFarmExpense> {
    await connectDB();
    const expense = new FarmExpense(data);
    return await expense.save();
  },

  async listAll(filters: { category?: string; farmLocation?: string; limit?: number } = {}): Promise<IFarmExpense[]> {
    await connectDB();
    const query: any = {};
    if (filters.category && filters.category !== "ALL") {
      query.category = filters.category;
    }
    if (filters.farmLocation) {
      query.farmLocation = filters.farmLocation;
    }

    return await FarmExpense.find(query)
      .populate("farmBatch")
      .sort({ date: -1 })
      .limit(filters.limit || 100);
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await FarmExpense.findByIdAndDelete(id);
    return !!res;
  },

  async getFinancialSummary() {
    await connectDB();

    // 1. Total Expenses & Category Breakdown
    const categoryAgg = await FarmExpense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalExpenses = categoryAgg.reduce((sum, c) => sum + c.total, 0);

    // 2. Total Order Revenue
    const revenueAgg = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["CANCELLED", "PAYMENT_FAILED"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricing.total" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    const totalOrders = revenueAgg[0]?.totalOrders || 0;

    // 3. Batch Yield & Direct Batch Input Costs
    const batchAgg = await FarmBatch.aggregate([
      {
        $group: {
          _id: null,
          totalHarvestYield: { $sum: "$actualHarvestedQuantity" },
          totalInputCosts: { $sum: "$inputCost" },
          totalSoldQty: { $sum: "$soldQuantity" },
        },
      },
    ]);

    const totalHarvestYield = batchAgg[0]?.totalHarvestYield || 0;
    const totalBatchInputCosts = batchAgg[0]?.totalInputCosts || 0;
    const totalSoldQty = batchAgg[0]?.totalSoldQty || 0;

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const costPerKgHarvested = totalHarvestYield > 0 ? totalExpenses / totalHarvestYield : 0;

    return {
      totalRevenue,
      totalOrders,
      totalExpenses,
      netProfit,
      profitMargin,
      totalHarvestYield,
      totalBatchInputCosts,
      totalSoldQty,
      costPerKgHarvested,
      categoryBreakdown: categoryAgg.map((c) => ({
        category: c._id,
        total: c.total,
        percentage: totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0,
        count: c.count,
      })),
    };
  },
};
