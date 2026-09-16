import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/models/User";
import { UserRole } from "@/config/constants";

export const userRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    return await User.findOne({ email: email.toLowerCase().trim() });
  },

  async findByEmailOrUsername(identifier: string): Promise<IUser | null> {
    await connectDB();
    const clean = identifier.toLowerCase().trim();
    return await User.findOne({
      $or: [{ email: clean }, { username: clean }],
    });
  },

  async findById(id: string): Promise<IUser | null> {
    await connectDB();
    return await User.findById(id);
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role?: UserRole;
  }): Promise<IUser> {
    await connectDB();
    const user = new User({
      ...data,
      email: data.email.toLowerCase().trim(),
    });
    return await user.save();
  },

  async addAddress(userId: string, address: any): Promise<IUser | null> {
    await connectDB();
    return await User.findByIdAndUpdate(
      userId,
      { $push: { savedAddresses: address } },
      { new: true }
    );
  },

  async countCustomers(): Promise<number> {
    await connectDB();
    return await User.countDocuments();
  },

  async listRecent(limit = 10): Promise<IUser[]> {
    await connectDB();
    return await User.find().sort({ createdAt: -1 }).limit(limit);
  },
};
