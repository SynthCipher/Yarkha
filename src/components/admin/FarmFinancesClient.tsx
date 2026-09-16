"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  X,
  Calendar,
  Layers,
  MapPin,
  CreditCard,
  PieChart,
  Receipt,
  Sprout,
  Truck,
  Package,
} from "lucide-react";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "@/config/constants";

interface FarmFinancesClientProps {
  initialExpenses: any[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    totalHarvestYield: number;
    costPerKgHarvested: number;
    categoryBreakdown: Array<{
      category: string;
      total: number;
      percentage: number;
      count: number;
    }>;
  };
  farmBatches: any[];
}

export function FarmFinancesClient({
  initialExpenses,
  summary: initialSummary,
  farmBatches,
}: FarmFinancesClientProps) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [summary, setSummary] = useState(initialSummary);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "SEEDS" as ExpenseCategory,
    amount: 1500,
    date: new Date().toISOString().split("T")[0],
    farmLocation: "Stakna Farm, Indus Valley",
    farmBatch: "",
    paymentMethod: "UPI" as "CASH" | "UPI" | "BANK_TRANSFER",
    notes: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          farmBatch: formData.farmBatch || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record expense");
      }

      setExpenses((prev) => [json.data, ...prev]);

      // Refresh summary
      const sumRes = await fetch("/api/v1/expenses?summary=true");
      const sumJson = await sumRes.json();
      if (sumJson.success) {
        setSummary(sumJson.data);
      }

      showNotification("success", `Expense of ₹${formData.amount} recorded successfully!`);
      setIsModalOpen(false);
      setFormData({
        title: "",
        category: "MATERIALS",
        amount: 1500,
        date: new Date().toISOString().split("T")[0],
        farmLocation: "Stakna Farm, Indus Valley",
        farmBatch: "",
        paymentMethod: "UPI",
        notes: "",
      });
    } catch (err: any) {
      showNotification("error", err.message || "Failed to record expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, title: string) => {
    if (!confirm(`Delete expense "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/expenses/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);

      setExpenses((prev) => prev.filter((item) => item._id !== id));

      const sumRes = await fetch("/api/v1/expenses?summary=true");
      const sumJson = await sumRes.json();
      if (sumJson.success) setSummary(sumJson.data);

      showNotification("success", "Expense deleted.");
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesCategory = selectedCategory === "ALL" || e.category === selectedCategory;
    const matchesSearch =
      e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.farmLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "SEEDS":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "FERTILIZER_COMPOST":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "LABOR":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "GREENHOUSE_EQUIPMENT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PACKAGING":
        return "bg-stone-100 text-stone-800 border-stone-200";
      case "TRANSPORT_FUEL":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
            Farm Finances & Operating Costs
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Track seed procurement, greenhouse heating, labor wages, packaging, and net harvest profit margins.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#1E3A2B] hover:bg-[#15291E] text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Record Farm Expense</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Order Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#1C1917] mt-2">
            ₹{summary.totalRevenue.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-stone-500 mt-1">From {summary.totalOrders} fulfilled customer orders</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Farm Expenses
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-serif font-bold text-rose-700 mt-2">
            ₹{summary.totalExpenses.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] text-stone-500 mt-1">{expenses.length} operational expense items logged</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Net Operating Profit
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                summary.netProfit >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3
            className={`text-2xl font-serif font-bold mt-2 ${
              summary.netProfit >= 0 ? "text-emerald-800" : "text-amber-800"
            }`}
          >
            ₹{summary.netProfit.toLocaleString("en-IN")}
          </h3>
          <p className="text-[11px] font-semibold mt-1 text-stone-600">
            {summary.profitMargin.toFixed(1)}% Operating Margin
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Cost Per Kg Harvest
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-serif font-bold text-blue-900 mt-2">
            ₹{summary.costPerKgHarvested.toFixed(1)} <span className="text-xs font-normal text-stone-500">/ kg</span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-1">
            Across {summary.totalHarvestYield.toFixed(0)} kg total harvest yield
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#1C1917] flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-800" />
          <span>Operational Cost Breakdown by Category</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {summary.categoryBreakdown.map((item) => (
            <div key={item.category} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-stone-800">{item.category.replace(/_/g, " ")}</span>
                <span className="font-mono font-semibold text-stone-700">₹{item.total.toLocaleString("en-IN")}</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1E3A2B] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, item.percentage))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-medium">
                <span>{item.count} entries</span>
                <span>{item.percentage.toFixed(1)}% of total cost</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Search expenses by title, location, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-80 text-xs px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
          >
            <option value="ALL">All Expense Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF7F2] text-[#78716C] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Expense Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Farm Location / Batch</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-stone-400">
                    <Receipt className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold">No expenses recorded matching the filter.</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 text-stone-600 font-medium whitespace-nowrap">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#1C1917]">{exp.title}</p>
                      {exp.notes && <p className="text-[10px] text-stone-500 mt-0.5">{exp.notes}</p>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                          exp.category
                        )}`}
                      >
                        {exp.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      <p>{exp.farmLocation}</p>
                      {exp.farmBatch && (
                        <span className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                          Batch: {typeof exp.farmBatch === "object" ? exp.farmBatch.batchCode : exp.farmBatch}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-medium">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] uppercase font-bold">
                        {exp.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-700 text-sm">
                      ₹{exp.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp._id, exp.title)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF7F2]">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Record Farm Expense</h3>
                <p className="text-xs text-stone-500">Log operational costs, labor, seeds, or compost purchases.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expense Description <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500kg Organic Sheep Manure from Domkhar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-semibold"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Amount Spent (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-bold text-rose-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                  >
                    <option value="UPI">UPI / GooglePay / PhonePe</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                  placeholder="e.g. Stakna Greenhouse #1, Indus Valley"
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Assign to Farm Batch (Optional)
                </label>
                <select
                  value={formData.farmBatch}
                  onChange={(e) => setFormData({ ...formData, farmBatch: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#1E3A2B] focus:outline-none font-mono text-[11px]"
                >
                  <option value="">-- General Farm Overhead (No batch) --</option>
                  {farmBatches.map((b) => (
                    <option key={b._id} value={b._id}>
                      [{b.batchCode}] {b.cropName} - {b.farmLocation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Notes / Vendor</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Vendor name, bill number, or notes..."
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
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
