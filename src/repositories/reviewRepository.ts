import { connectDB } from "@/lib/db/connect";
import { Review, IReview } from "@/models/Review";

export const reviewRepository = {
  async listApproved(productId?: string, limit = 10): Promise<IReview[]> {
    await connectDB();
    const filter: any = { status: "APPROVED" };
    if (productId) filter.product = productId;
    return await Review.find(filter).sort({ createdAt: -1 }).limit(limit);
  },

  async listAll(): Promise<IReview[]> {
    await connectDB();
    return await Review.find().sort({ createdAt: -1 });
  },

  async create(data: Partial<IReview>): Promise<IReview> {
    await connectDB();
    const review = new Review(data);
    return await review.save();
  },

  async updateStatus(id: string, status: string): Promise<IReview | null> {
    await connectDB();
    return await Review.findByIdAndUpdate(id, { status }, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await Review.findByIdAndDelete(id);
    return !!res;
  },
};
