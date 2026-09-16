import { connectDB } from "@/lib/db/connect";
import { FarmBatch, IFarmBatch } from "@/models/FarmBatch";

export const farmBatchRepository = {
  async listAll(): Promise<IFarmBatch[]> {
    await connectDB();
    return await FarmBatch.find().sort({ sowingDate: -1 });
  },

  async findById(id: string): Promise<IFarmBatch | null> {
    await connectDB();
    return await FarmBatch.findById(id);
  },

  async create(data: Partial<IFarmBatch>): Promise<IFarmBatch> {
    await connectDB();
    const batch = new FarmBatch(data);
    return await batch.save();
  },

  async update(id: string, data: Partial<IFarmBatch>): Promise<IFarmBatch | null> {
    await connectDB();
    return await FarmBatch.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await FarmBatch.findByIdAndDelete(id);
    return !!res;
  },

  async getBatchAnalytics() {
    await connectDB();
    return await FarmBatch.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalProduced: { $sum: "$actualHarvestedQuantity" },
          totalSold: { $sum: "$soldQuantity" },
          totalWaste: { $sum: "$wasteQuantity" },
        },
      },
    ]);
  },
};
