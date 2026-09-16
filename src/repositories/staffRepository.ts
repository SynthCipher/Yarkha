import { connectDB } from "@/lib/db/connect";
import { StaffMember, IStaffMember } from "@/models/StaffMember";

export const staffRepository = {
  async listAll(filter: any = {}): Promise<IStaffMember[]> {
    await connectDB();
    return await StaffMember.find(filter).sort({ active: -1, name: 1 });
  },

  async findById(id: string): Promise<IStaffMember | null> {
    await connectDB();
    return await StaffMember.findById(id);
  },

  async create(data: Partial<IStaffMember>): Promise<IStaffMember> {
    await connectDB();
    const staff = new StaffMember(data);
    return await staff.save();
  },

  async update(id: string, data: Partial<IStaffMember>): Promise<IStaffMember | null> {
    await connectDB();
    return await StaffMember.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await StaffMember.findByIdAndDelete(id);
    return !!res;
  },

  async countActive(): Promise<number> {
    await connectDB();
    return await StaffMember.countDocuments({ active: true });
  },
};
