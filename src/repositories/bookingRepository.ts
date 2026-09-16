import { connectDB } from "@/lib/db/connect";
import { Booking, IBooking } from "@/models/Booking";

export const bookingRepository = {
  async listAll(): Promise<IBooking[]> {
    await connectDB();
    return await Booking.find().sort({ checkInDate: 1 });
  },

  async create(data: Partial<IBooking>): Promise<IBooking> {
    await connectDB();
    const booking = new Booking(data);
    return await booking.save();
  },

  async findById(id: string): Promise<IBooking | null> {
    await connectDB();
    return await Booking.findById(id);
  },

  async updateStatus(id: string, status: string): Promise<IBooking | null> {
    await connectDB();
    return await Booking.findByIdAndUpdate(id, { status }, { new: true });
  },
};
