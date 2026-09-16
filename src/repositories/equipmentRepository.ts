import { connectDB } from "@/lib/db/connect";
import { EquipmentAsset, IEquipmentAsset } from "@/models/EquipmentAsset";

export const equipmentRepository = {
  async listAll(filter: any = {}): Promise<IEquipmentAsset[]> {
    await connectDB();
    return await EquipmentAsset.find(filter).sort({ nextMaintenanceDueDate: 1 });
  },

  async findById(id: string): Promise<IEquipmentAsset | null> {
    await connectDB();
    return await EquipmentAsset.findById(id);
  },

  async create(data: Partial<IEquipmentAsset>): Promise<IEquipmentAsset> {
    await connectDB();
    const item = new EquipmentAsset(data);
    return await item.save();
  },

  async update(id: string, data: Partial<IEquipmentAsset>): Promise<IEquipmentAsset | null> {
    await connectDB();
    return await EquipmentAsset.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await EquipmentAsset.findByIdAndDelete(id);
    return !!res;
  },

  async getMaintenanceDueCount(): Promise<number> {
    await connectDB();
    const inNext7Days = new Date();
    inNext7Days.setDate(inNext7Days.getDate() + 7);

    return await EquipmentAsset.countDocuments({
      $or: [
        { condition: { $in: ["NEEDS_MAINTENANCE", "REPAIR_REQUIRED"] } },
        { nextMaintenanceDueDate: { $lte: inNext7Days } },
      ],
    });
  },

  async getEquipmentDueForMaintenance(limit = 5): Promise<IEquipmentAsset[]> {
    await connectDB();
    const inNext14Days = new Date();
    inNext14Days.setDate(inNext14Days.getDate() + 14);

    return await EquipmentAsset.find({
      $or: [
        { condition: { $in: ["NEEDS_MAINTENANCE", "REPAIR_REQUIRED"] } },
        { nextMaintenanceDueDate: { $lte: inNext14Days } },
      ],
    })
      .sort({ nextMaintenanceDueDate: 1 })
      .limit(limit);
  },

  async logMaintenance(
    id: string,
    data: { notes?: string; nextDueDate?: Date; cost?: number }
  ): Promise<IEquipmentAsset | null> {
    await connectDB();
    return await EquipmentAsset.findByIdAndUpdate(
      id,
      {
        lastMaintenanceDate: new Date(),
        condition: "GOOD",
        ...(data.notes ? { notes: data.notes } : {}),
        ...(data.nextDueDate ? { nextMaintenanceDueDate: data.nextDueDate } : {}),
        ...(data.cost ? { maintenanceCost: data.cost } : {}),
      },
      { new: true }
    );
  },
};
