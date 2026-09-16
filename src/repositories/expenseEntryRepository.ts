import { connectDB } from "@/lib/db/connect";
import { ExpenseEntry, IExpenseEntry } from "@/models/ExpenseEntry";
import { ExpenseSection } from "@/config/constants";

export const expenseEntryRepository = {
  async listAll(filter: any = {}): Promise<IExpenseEntry[]> {
    await connectDB();
    return await ExpenseEntry.find(filter).sort({ date: -1 });
  },

  async findById(id: string): Promise<IExpenseEntry | null> {
    await connectDB();
    return await ExpenseEntry.findById(id);
  },

  async create(data: Partial<IExpenseEntry>): Promise<IExpenseEntry> {
    await connectDB();
    const entry = new ExpenseEntry(data);
    return await entry.save();
  },

  async update(id: string, data: Partial<IExpenseEntry>): Promise<IExpenseEntry | null> {
    await connectDB();
    return await ExpenseEntry.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await ExpenseEntry.findByIdAndDelete(id);
    return !!res;
  },

  async getExpensesBySection(): Promise<Record<ExpenseSection, number>> {
    await connectDB();
    const result = await ExpenseEntry.aggregate([
      {
        $group: {
          _id: "$linkedSection",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const breakdown: any = {
      VEGETABLES: 0,
      FLOWERS: 0,
      SAPLINGS: 0,
      VALUE_ADDED: 0,
      PASHMINA: 0,
      FARMSTAY: 0,
      GENERAL: 0,
    };

    result.forEach((r) => {
      if (r._id) {
        breakdown[r._id] = r.total;
      }
    });

    return breakdown;
  },

  async getTotalExpenses(): Promise<number> {
    await connectDB();
    const result = await ExpenseEntry.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total || 0;
  },
};
