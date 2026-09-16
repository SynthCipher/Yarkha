import { connectDB } from "@/lib/db/connect";
import { ContentBlock, IContentBlock } from "@/models/ContentBlock";

export const contentRepository = {
  async getByKey(key: string): Promise<IContentBlock | null> {
    await connectDB();
    return await ContentBlock.findOne({ key });
  },

  async upsert(
    key: string,
    data: { title: string; section: string; content: string; metadata?: Record<string, any> }
  ): Promise<IContentBlock> {
    await connectDB();
    return await ContentBlock.findOneAndUpdate(
      { key },
      { ...data, key },
      { upsert: true, new: true }
    );
  },

  async listAll(): Promise<IContentBlock[]> {
    await connectDB();
    return await ContentBlock.find().sort({ section: 1, key: 1 });
  },
};
