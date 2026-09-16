"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { EQUIPMENT_CONDITIONS } from "@/config/constants";

export default function EquipmentOperationsPage() {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [maintenanceItem, setMaintenanceItem] = useState<any | null>(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "IRRIGATION",
    modelNumber: "",
    purchaseCost: 25000,
    condition: "GOOD",
    location: "Stakna Tool Shed",
    nextMaintenanceDueDate: new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .split("T")[0],
    notes: "",
  });

  const loadEquipment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/operations/equipment");
      const json = await res.json();
      if (json.success) {
        setEquipment(json.data.equipment);
        setDueCount(json.data.dueCount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        loadEquipment();
        setFormData({
          name: "",
          category: "IRRIGATION",
          modelNumber: "",
          purchaseCost: 25000,
          condition: "GOOD",
          location: "Stakna Tool Shed",
          nextMaintenanceDueDate: new Date(Date.now() + 30 * 86400000)
            .toISOString()
            .split("T")[0],
          notes: "",
        });
      } else {
        alert(json.error || "Failed to add equipment");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceItem) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/equipment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: maintenanceItem._id,
          logMaintenance: true,
          notes: maintenanceNotes,
          nextDueDate: nextDueDate || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMaintenanceItem(null);
        setMaintenanceNotes("");
        setNextDueDate("");
        loadEquipment();
      } else {
        alert(json.error || "Failed to log maintenance");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
            Physical Farm Operations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Tools, Machinery & Equipment
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Maintain solar thermal pumps, passive greenhouse louvers, wood charkhas, and drip irrigation lines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Equipment</span>
          </button>
          <button
            onClick={loadEquipment}
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
              Total Managed Assets
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {equipment.length} Assets
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Maintenance Due
            </p>
            <h3 className="font-serif font-bold text-2xl text-amber-600 mt-1">
              {dueCount} Assets
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Operational Health
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {equipment.filter((e) => e.condition === "EXCELLENT" || e.condition === "GOOD").length} Healthy
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading equipment...</div>
        ) : equipment.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No equipment recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Equipment / Machinery</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Condition</th>
                  <th className="p-4">Next Due Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {equipment.map((item) => {
                  const isDue =
                    item.condition === "NEEDS_MAINTENANCE" ||
                    item.condition === "REPAIR_REQUIRED" ||
                    (item.nextMaintenanceDueDate &&
                      new Date(item.nextMaintenanceDueDate) <=
                        new Date(Date.now() + 7 * 86400000));

                  return (
                    <tr
                      key={item._id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isDue ? "bg-amber-50/30" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-bold text-stone-900">{item.name}</div>
                        {item.modelNumber && (
                          <span className="text-[10px] text-stone-400">
                            Model: {item.modelNumber}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-stone-600">{item.location}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            item.condition === "EXCELLENT" || item.condition === "GOOD"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.condition === "FAIR"
                              ? "bg-stone-100 text-stone-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.condition.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.nextMaintenanceDueDate ? (
                          <span
                            className={
                              isDue ? "text-amber-700 font-bold" : "text-stone-600"
                            }
                          >
                            {new Date(item.nextMaintenanceDueDate).toLocaleDateString()}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setMaintenanceItem(item)}
                          className="bg-[#FAF7F2] hover:bg-stone-200 border border-stone-300 text-stone-800 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Log Service
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Service Modal */}
      {maintenanceItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Log Maintenance Service: {maintenanceItem.name}
            </h3>

            <form onSubmit={handleLogMaintenance} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Service Notes / Replaced Parts
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Cleared mineral deposits from drip emitter line, lubricated pump bearings"
                  value={maintenanceNotes}
                  onChange={(e) => setMaintenanceNotes(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Next Maintenance Due Date
                </label>
                <input
                  type="date"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMaintenanceItem(null)}
                  className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Record Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Register New Machinery / Asset
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Asset Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apricot-Wood Drop Spindle (Yender)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TEXTILE_LOOM or IRRIGATION"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(EQUIPMENT_CONDITIONS).map((cond) => (
                      <option key={cond} value={cond}>
                        {cond.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={formData.purchaseCost}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Next Service Due</label>
                  <input
                    type="date"
                    value={formData.nextMaintenanceDueDate}
                    onChange={(e) => setFormData({ ...formData, nextMaintenanceDueDate: e.target.value })}
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
                  {isSubmitting ? "Saving..." : "Save Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
