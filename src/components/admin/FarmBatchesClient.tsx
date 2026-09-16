"use client";

import React, { useState } from "react";
import {
  Sprout,
  Plus,
  Calendar,
  Layers,
  MapPin,
  TrendingUp,
  AlertCircle,
  Check,
  X,
  Trash2,
  Edit2,
  DollarSign,
  Package,
} from "lucide-react";
import { PRODUCT_UNITS, FARM_BATCH_STATUSES, FarmBatchStatus } from "@/config/constants";

interface FarmBatchesClientProps {
  initialBatches: any[];
}

export function FarmBatchesClient({ initialBatches }: FarmBatchesClientProps) {
  const [batches, setBatches] = useState(initialBatches);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    batchCode: "",
    cropName: "",
    farmLocation: "Stakna Greenhouse #1, Indus Valley",
    greenhouseId: "GH-01",
    sowingDate: new Date().toISOString().split("T")[0],
    expectedHarvestDate: "",
    actualHarvestDate: "",
    expectedQuantity: 100,
    actualHarvestedQuantity: 0,
    availableQuantity: 100,
    soldQuantity: 0,
    wasteQuantity: 0,
    unit: "kg",
    inputCost: 4500,
    seedCost: 1500,
    laborCost: 3000,
    status: "PLANNED" as FarmBatchStatus,
    notes: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const openNewBatchModal = () => {
    setEditingBatchId(null);
    setFormData({
      batchCode: "",
      cropName: "",
      farmLocation: "Stakna Greenhouse #1, Indus Valley",
      greenhouseId: "GH-01",
      sowingDate: new Date().toISOString().split("T")[0],
      expectedHarvestDate: "",
      actualHarvestDate: "",
      expectedQuantity: 100,
      actualHarvestedQuantity: 0,
      availableQuantity: 100,
      soldQuantity: 0,
      wasteQuantity: 0,
      unit: "kg",
      inputCost: 4500,
      seedCost: 1500,
      laborCost: 3000,
      status: "PLANNED",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (batch: any) => {
    setEditingBatchId(batch._id);
    setFormData({
      batchCode: batch.batchCode || "",
      cropName: batch.cropName || "",
      farmLocation: batch.farmLocation || "Stakna Greenhouse #1",
      greenhouseId: batch.greenhouseId || "",
      sowingDate: batch.sowingDate ? new Date(batch.sowingDate).toISOString().split("T")[0] : "",
      expectedHarvestDate: batch.expectedHarvestDate ? new Date(batch.expectedHarvestDate).toISOString().split("T")[0] : "",
      actualHarvestDate: batch.actualHarvestDate ? new Date(batch.actualHarvestDate).toISOString().split("T")[0] : "",
      expectedQuantity: batch.expectedQuantity || 0,
      actualHarvestedQuantity: batch.actualHarvestedQuantity || 0,
      availableQuantity: batch.availableQuantity || 0,
      soldQuantity: batch.soldQuantity || 0,
      wasteQuantity: batch.wasteQuantity || 0,
      unit: batch.unit || "kg",
      inputCost: batch.inputCost || 0,
      seedCost: batch.seedCost || 0,
      laborCost: batch.laborCost || 0,
      status: batch.status || "PLANNED",
      notes: batch.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let res;
      if (editingBatchId) {
        res = await fetch(`/api/v1/farm-batches/${editingBatchId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/v1/farm-batches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to save batch");

      if (editingBatchId) {
        setBatches((prev) => prev.map((b) => (b._id === editingBatchId ? json.data : b)));
        showNotification("success", `Batch ${formData.batchCode || json.data.batchCode} updated!`);
      } else {
        setBatches((prev) => [json.data, ...prev]);
        showNotification("success", `New batch ${json.data.batchCode} registered successfully!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to save batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBatch = async (id: string, code: string) => {
    if (!confirm(`Delete farm batch ${code}?`)) return;

    try {
      const res = await fetch(`/api/v1/farm-batches/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);

      setBatches((prev) => prev.filter((b) => b._id !== id));
      showNotification("success", `Batch ${code} deleted.`);
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete batch");
    }
  };

  const totalHarvested = batches.reduce((sum, b) => sum + (b.actualHarvestedQuantity || 0), 0);
  const totalSold = batches.reduce((sum, b) => sum + (b.soldQuantity || 0), 0);
  const totalWaste = batches.reduce((sum, b) => sum + (b.wasteQuantity || 0), 0);
  const totalInputCost = batches.reduce((sum, b) => sum + (b.inputCost || 0), 0);

  const filteredBatches = batches.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesSearch =
      b.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-700"
              : "bg-rose-900 text-rose-100 border-rose-700"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Farm Batches & Crop Lifecycle
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Track greenhouse sowing cycles, harvest yields, waste ratios, and direct input costs.
          </p>
        </div>

        <button
          onClick={openNewBatchModal}
          className="inline-flex items-center justify-center gap-2 bg-[#1E3A2B] hover:bg-[#15291E] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Crop Batch</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#78716C]">
            Total Harvest Yield
          </p>
          <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
            {totalHarvested.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg</span>
          </h3>
          <span className="text-[10px] text-emerald-700 font-semibold">Active Cycle Production</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#78716C]">
            Total Sold / Fulfilled
          </p>
          <h3 className="font-serif font-bold text-2xl text-[#B45309] mt-1">
            {totalSold.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg</span>
          </h3>
          <span className="text-[10px] text-amber-800 font-semibold">
            {totalHarvested > 0 ? ((totalSold / totalHarvested) * 100).toFixed(0) : 0}% Harvest Sale Rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#78716C]">
            Compost / Waste Ratio
          </p>
          <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
            {totalWaste.toFixed(1)} <span className="text-xs font-normal text-stone-500">kg</span>
          </h3>
          <span className="text-[10px] text-stone-500 font-semibold">Regenerative Soil Compost</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#78716C]">
            Batch Input Costs
          </p>
          <h3 className="font-serif font-bold text-2xl text-rose-700 mt-1">
            ₹{totalInputCost.toLocaleString("en-IN")}
          </h3>
          <span className="text-[10px] text-stone-500 font-semibold">Seeds & Labor Invested</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search batches by crop, code, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", ...Object.values(FARM_BATCH_STATUSES)].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#1E3A2B] text-white"
                  : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[#78716C] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Batch Code</th>
                <th className="py-3.5 px-4">Crop Name</th>
                <th className="py-3.5 px-4">Greenhouse / Location</th>
                <th className="py-3.5 px-4">Sowing & Harvest</th>
                <th className="py-3.5 px-4">Yield / Sold</th>
                <th className="py-3.5 px-4">Input Cost</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredBatches.map((b) => (
                <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1C1917]">{b.batchCode}</td>
                  <td className="py-3.5 px-4 font-bold text-[#1C1917]">{b.cropName}</td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <p className="font-medium text-stone-800">{b.farmLocation}</p>
                    {b.greenhouseId && <span className="text-[10px] text-stone-500">{b.greenhouseId}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">
                    <p className="text-[11px]">Sowed: {new Date(b.sowingDate).toLocaleDateString()}</p>
                    <p className="text-[10px] text-stone-500">
                      {b.actualHarvestDate
                        ? `Harvested: ${new Date(b.actualHarvestDate).toLocaleDateString()}`
                        : b.expectedHarvestDate
                        ? `Exp: ${new Date(b.expectedHarvestDate).toLocaleDateString()}`
                        : "Growing"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#1C1917]">
                      {b.actualHarvestedQuantity || 0} / {b.expectedQuantity} {b.unit}
                    </p>
                    <span className="text-[10px] text-amber-800 font-semibold">
                      Sold: {b.soldQuantity || 0} {b.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-700">
                    ₹{(b.inputCost || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === "HARVESTING"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "GROWING"
                          ? "bg-blue-100 text-blue-800"
                          : b.status === "COMPLETED"
                          ? "bg-stone-100 text-stone-700"
                          : "bg-amber-100 text-[#92400E]"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-[#1E3A2B] hover:text-white text-stone-700 transition-colors"
                        title="Edit batch"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(b._id, b.batchCode)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                        title="Delete batch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Batch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF7F2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {editingBatchId ? "Edit Farm Batch" : "Register New Crop Sowing Batch"}
                </h3>
                <p className="text-xs text-stone-500">Record sowing date, harvest estimates, and operational input costs.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBatch} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Passive Solar Cherry Tomatoes"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Batch Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={formData.batchCode}
                    onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Location</label>
                  <input
                    type="text"
                    value={formData.farmLocation}
                    onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                    placeholder="Stakna Greenhouse #1"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Greenhouse / Bed ID</label>
                  <input
                    type="text"
                    value={formData.greenhouseId}
                    onChange={(e) => setFormData({ ...formData, greenhouseId: e.target.value })}
                    placeholder="GH-01"
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Sowing Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.sowingDate}
                    onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Expected Qty *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.expectedQuantity}
                    onChange={(e) => setFormData({ ...formData, expectedQuantity: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Actual Harvested Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.actualHarvestedQuantity}
                    onChange={(e) => setFormData({ ...formData, actualHarvestedQuantity: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-semibold"
                  >
                    {PRODUCT_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Total Input Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.inputCost}
                    onChange={(e) => setFormData({ ...formData, inputCost: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold text-rose-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Seed Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.seedCost}
                    onChange={(e) => setFormData({ ...formData, seedCost: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Labor Cost (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.laborCost}
                    onChange={(e) => setFormData({ ...formData, laborCost: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold"
                  >
                    {Object.values(FARM_BATCH_STATUSES).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Waste / Compost (kg)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.wasteQuantity}
                    onChange={(e) => setFormData({ ...formData, wasteQuantity: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notes & Soil Conditions</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Irrigation schedule, glacial melt source, organic certification notes..."
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#15291E] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingBatchId ? "Update Batch" : "Save Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
