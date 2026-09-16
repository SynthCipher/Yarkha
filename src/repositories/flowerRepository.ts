import { connectDB } from "@/lib/db/connect";
import { CustomFlowerEnquiry, ICustomFlowerEnquiry } from "@/models/CustomFlowerEnquiry";

export const flowerRepository = {
  async createEnquiry(data: Partial<ICustomFlowerEnquiry>): Promise<ICustomFlowerEnquiry> {
    await connectDB();
    const count = await CustomFlowerEnquiry.countDocuments();
    const enquiryNumber = `FLW-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
    const enquiry = new CustomFlowerEnquiry({ ...data, enquiryNumber });
    return await enquiry.save();
  },

  async listEnquiries(limit = 50): Promise<ICustomFlowerEnquiry[]> {
    await connectDB();
    return await CustomFlowerEnquiry.find().sort({ createdAt: -1 }).limit(limit);
  },

  async updateEnquiryStatus(
    id: string,
    status: string,
    quoteAmount?: number,
    adminNotes?: string
  ): Promise<ICustomFlowerEnquiry | null> {
    await connectDB();
    const updates: any = { status };
    if (quoteAmount !== undefined) updates.quoteAmount = quoteAmount;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    return await CustomFlowerEnquiry.findByIdAndUpdate(id, updates, { new: true });
  },
};
