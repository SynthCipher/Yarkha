import { connectDB } from "@/lib/db/connect";
import { Product, IProduct } from "@/models/Product";
import { ProductType, PRODUCT_STATUS } from "@/config/constants";

export interface ProductFilters {
  productType?: ProductType;
  fulfillmentType?: string;
  categorySlug?: string;
  isDailyAvailable?: boolean;
  isSeasonal?: boolean;
  featured?: boolean;
  search?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export const productRepository = {
  async findById(id: string): Promise<IProduct | null> {
    await connectDB();
    return await Product.findById(id).populate("category").populate("farmBatch");
  },

  async findBySlug(slug: string): Promise<IProduct | null> {
    await connectDB();
    return await Product.findOne({ slug }).populate("category").populate("farmBatch");
  },

  async list(filters: ProductFilters = {}) {
    await connectDB();
    const query: any = {};
    if (filters.status && filters.status !== "ALL") {
      query.status = filters.status;
    } else if (!filters.status) {
      query.status = PRODUCT_STATUS.PUBLISHED;
    }

    if (filters.productType) {
      query.productType = filters.productType;
    }
    if (filters.fulfillmentType) {
      query.fulfillmentType = filters.fulfillmentType;
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }
    if (filters.isDailyAvailable !== undefined) {
      query.isDailyAvailable = filters.isDailyAvailable;
    }
    if (filters.isSeasonal !== undefined) {
      query.isSeasonal = filters.isSeasonal;
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 24;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category")
        .sort({ featured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async reserveInventory(productId: string, quantity: number): Promise<boolean> {
    await connectDB();
    // Atomic reservation: only increment reservedQuantity if availableQuantity - reservedQuantity >= quantity
    const updated = await Product.findOneAndUpdate(
      {
        _id: productId,
        $expr: {
          $gte: [
            { $subtract: ["$availableQuantity", "$reservedQuantity"] },
            quantity,
          ],
        },
      },
      {
        $inc: { reservedQuantity: quantity },
      },
      { new: true }
    );
    return !!updated;
  },

  async releaseInventory(productId: string, quantity: number): Promise<void> {
    await connectDB();
    await Product.findByIdAndUpdate(productId, {
      $inc: { reservedQuantity: -quantity },
    });
  },

  async commitDeduction(productId: string, quantity: number): Promise<void> {
    await connectDB();
    // Deduct both available and reserved quantity permanently
    await Product.findByIdAndUpdate(productId, {
      $inc: {
        availableQuantity: -quantity,
        reservedQuantity: -quantity,
      },
    });
  },

  async create(data: Partial<IProduct>): Promise<IProduct> {
    await connectDB();
    const product = new Product(data);
    return await product.save();
  },

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    await connectDB();
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  },

  async countLowStock(threshold = 5): Promise<number> {
    await connectDB();
    return await Product.countDocuments({
      status: PRODUCT_STATUS.PUBLISHED,
      $expr: {
        $lte: [{ $subtract: ["$availableQuantity", "$reservedQuantity"] }, threshold],
      },
    });
  },
};
