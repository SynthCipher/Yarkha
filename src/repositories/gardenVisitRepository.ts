import { connectDB } from "@/lib/db/connect";
import { GardenVisit, IGardenVisit } from "@/models/GardenVisit";

export const gardenVisitRepository = {
  async listAll(): Promise<IGardenVisit[]> {
    await connectDB();
    return await GardenVisit.find().sort({ preferredDate: 1, createdAt: -1 });
  },

  async create(data: Partial<IGardenVisit>): Promise<IGardenVisit> {
    await connectDB();
    const visit = new GardenVisit(data);
    return await visit.save();
  },

  async updateStatus(id: string, status: string, notes?: string): Promise<IGardenVisit | null> {
    await connectDB();
    return await GardenVisit.findByIdAndUpdate(
      id,
      { status, ...(notes ? { notes } : {}) },
      { new: true }
    );
  },

  async countPending(): Promise<number> {
    await connectDB();
    return await GardenVisit.countDocuments({ status: "NEW" });
  },
};
