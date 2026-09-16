import { connectDB } from "@/lib/db/connect";
import { Attendance, IAttendance } from "@/models/Attendance";

export const attendanceRepository = {
  async listByDate(date: Date): Promise<IAttendance[]> {
    await connectDB();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("staffMember");
  },

  async markAttendance(data: {
    staffMemberId: string;
    date: Date;
    status: "PRESENT" | "ABSENT" | "HALF_DAY";
    wageCalculated: number;
    notes?: string;
  }): Promise<IAttendance> {
    await connectDB();
    const startOfDay = new Date(data.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data.date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Attendance.findOneAndUpdate(
      {
        staffMember: data.staffMemberId,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      {
        staffMember: data.staffMemberId,
        date: data.date,
        status: data.status,
        wageCalculated: data.wageCalculated,
        notes: data.notes,
      },
      { upsert: true, new: true }
    );
  },

  async getTodayStaffOnDuty(): Promise<number> {
    await connectDB();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await Attendance.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["PRESENT", "HALF_DAY"] },
    });
  },
};
