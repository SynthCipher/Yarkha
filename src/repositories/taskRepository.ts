import { connectDB } from "@/lib/db/connect";
import { Task, ITask } from "@/models/Task";

export const taskRepository = {
  async listAll(filter: any = {}): Promise<ITask[]> {
    await connectDB();
    return await Task.find(filter)
      .populate("assignedTo")
      .populate("linkedBatch")
      .sort({ dueDate: 1 });
  },

  async findById(id: string): Promise<ITask | null> {
    await connectDB();
    return await Task.findById(id).populate("assignedTo").populate("linkedBatch");
  },

  async create(data: Partial<ITask>): Promise<ITask> {
    await connectDB();
    const task = new Task(data);
    return await task.save();
  },

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    await connectDB();
    return await Task.findByIdAndUpdate(id, data, { new: true }).populate("assignedTo");
  },

  async delete(id: string): Promise<boolean> {
    await connectDB();
    const res = await Task.findByIdAndDelete(id);
    return !!res;
  },

  async getOpenTasksCount(): Promise<number> {
    await connectDB();
    return await Task.countDocuments({ status: { $in: ["OPEN", "IN_PROGRESS"] } });
  },

  async getDueTasks(limit = 5): Promise<ITask[]> {
    await connectDB();
    return await Task.find({ status: { $in: ["OPEN", "IN_PROGRESS"] } })
      .populate("assignedTo")
      .sort({ dueDate: 1 })
      .limit(limit);
  },
};
