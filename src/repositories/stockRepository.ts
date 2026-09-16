import { connectDB } from "@/lib/db/connect";
import { StockItem, IStockItem } from "@/models/StockItem";

export const stockRepository = {
  async listAll(filter: any = {}): Promise<IStockItem[]> {
    await connectDB();
    return await StockItem.find(filter).sort({ category: 1, name: 1 });
  },

  async findById(id: string): Promise<IStockItem | null> {
    await connectDB();
    return await StockItem.findById(id);
  },

  async create(data: Partial<IStockItem>): Promise<IStockItem> {
    await connectDB();
    const item = new StockItem(data);
    return await item.save();
  },

  async update(id: string, data: Partial<IStockItem>): Promise<IStockItem | null> {
    await connectDB();
    return await StockItem.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await StockItem.findByIdAndDelete(id);
    return !!res;
  },

  async getLowStockItems(): Promise<IStockItem[]> {
    await connectDB();
    return await StockItem.find({
      $expr: { $lte: ["$quantityOnHand", "$reorderThreshold"] },
    }).sort({ quantityOnHand: 1 });
  },

  async adjustQuantity(id: string, adjustment: number, notes?: string): Promise<IStockItem | null> {
    await connectDB();
    return await StockItem.findByIdAndUpdate(
      id,
      {
        $inc: { quantityOnHand: adjustment },
        ...(notes ? { notes } : {}),
      },
      { new: true }
    );
  },
};
