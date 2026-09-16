"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { TASK_STATUSES, TASK_PRIORITIES, EXPENSE_SECTIONS } from "@/config/constants";

export default function TasksOperationsPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "MEDIUM",
    dueDate: new Date().toISOString().split("T")[0],
    section: "VEGETABLES",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        fetch("/api/v1/operations/tasks"),
        fetch("/api/v1/operations/staff"),
      ]);
      const [tJson, sJson] = await tRes.json();
      if (tJson.success) setTasks(tJson.data);
      if (sJson.success) setStaff(sJson.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        loadData();
        setFormData({
          title: "",
          description: "",
          assignedTo: "",
          priority: "MEDIUM",
          dueDate: new Date().toISOString().split("T")[0],
          section: "VEGETABLES",
        });
      } else {
        alert(json.error || "Failed to create task");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/v1/operations/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === "ALL") return true;
    return t.status === statusFilter;
  });

  const openCount = tasks.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
            Physical Farm Operations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Work & Field Tasks Board
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Assign and monitor field activities, greenhouse maintenance, seed sowing, and loom weaving.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
          <button
            onClick={loadData}
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Open / Pending Tasks
            </p>
            <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
              {openCount} Open
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              In Progress
            </p>
            <h3 className="font-serif font-bold text-2xl text-blue-600 mt-1">
              {inProgressCount} Active
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Completed Tasks
            </p>
            <h3 className="font-serif font-bold text-2xl text-emerald-600 mt-1">
              {completedCount} Done
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === st
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-[#FAF7F2] text-stone-600 hover:bg-stone-200"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl">
            Loading farm tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl">
            No tasks found matching this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((t) => {
              const isOverdue =
                t.status !== "COMPLETED" && new Date(t.dueDate) < new Date();

              return (
                <div
                  key={t._id}
                  className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md">
                        Section: {t.section}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.priority === "URGENT" || t.priority === "HIGH"
                            ? "bg-red-100 text-red-800"
                            : t.priority === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-stone-900 mb-1">
                      {t.title}
                    </h3>
                    {t.description && (
                      <p className="text-xs text-stone-600 font-light leading-relaxed mb-3">
                        {t.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span className={isOverdue ? "text-red-600 font-bold" : ""}>
                          Due: {new Date(t.dueDate).toLocaleDateString()}{" "}
                          {isOverdue && "(Overdue)"}
                        </span>
                      </span>
                      {t.assignedTo && (
                        <span>
                          Assigned: <strong>{t.assignedTo.name}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                    <span
                      className={`text-[11px] font-bold uppercase ${
                        t.status === "COMPLETED"
                          ? "text-emerald-700"
                          : t.status === "IN_PROGRESS"
                          ? "text-blue-600"
                          : "text-amber-700"
                      }`}
                    >
                      ● {t.status.replace("_", " ")}
                    </span>

                    <div className="flex gap-2">
                      {t.status !== "IN_PROGRESS" && t.status !== "COMPLETED" && (
                        <button
                          onClick={() => updateTaskStatus(t._id, "IN_PROGRESS")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                        >
                          Start Task
                        </button>
                      )}
                      {t.status !== "COMPLETED" && (
                        <button
                          onClick={() => updateTaskStatus(t._id, "COMPLETED")}
                          className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {t.status === "COMPLETED" && (
                        <button
                          onClick={() => updateTaskStatus(t._id, "OPEN")}
                          className="text-stone-400 hover:text-stone-700 text-[11px] underline"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Create New Farm Task
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect Trombe Wall insulation in Greenhouse 2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Details, steps, and expected deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(EXPENSE_SECTIONS).map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(TASK_PRIORITIES).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Assign Worker</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {staff.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.role.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Creating..." : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
