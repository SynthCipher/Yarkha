import { connectDB } from "@/lib/db/connect";
import { Category, ICategory } from "@/models/Category";
import { ProductType } from "@/config/constants";

export const categoryRepository = {
  async listActive(): Promise<ICategory[]> {
    await connectDB();
    return await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  },

  async findBySlug(slug: string): Promise<ICategory | null> {
    await connectDB();
    return await Category.findOne({ slug, isActive: true });
  },

  async findByType(productType: ProductType): Promise<ICategory[]> {
    await connectDB();
    return await Category.find({ productType, isActive: true }).sort({ displayOrder: 1 });
  },

  async create(data: Partial<ICategory>): Promise<ICategory> {
    await connectDB();
    const category = new Category(data);
    return await category.save();
  },

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    await connectDB();
    return await Category.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await Category.findByIdAndDelete(id);
    return !!res;
  },
};
