import { NextRequest, NextResponse } from "next/server";
import { taskRepository } from "@/repositories/taskRepository";
import { getSessionUser } from "@/lib/auth/jwt";
import { USER_ROLES } from "@/config/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await taskRepository.listAll(filter);
    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, assignedTo, priority, dueDate, section } = body;

    if (!title || !dueDate) {
      return NextResponse.json(
        { success: false, error: "Task title and due date are required." },
        { status: 400 }
      );
    }

    const task = await taskRepository.create({
      title,
      description,
      assignedTo: assignedTo || undefined,
      priority: priority || "MEDIUM",
      dueDate: new Date(dueDate),
      category: (section === "PASHMINA" ? "PASHMINA" : section === "VEGETABLES" ? "FARM" : section === "FLOWERS" ? "GREENHOUSE" : "OTHER") as any,
      notes: section ? `Section: ${section}` : undefined,
      status: "OPEN",
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.FARM_MANAGER)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Task ID and status are required." }, { status: 400 });
    }

    const updated = await taskRepository.update(id, {
      status,
      ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
      ...(notes ? { notes } : {}),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
