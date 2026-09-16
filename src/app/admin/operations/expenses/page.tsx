"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  IndianRupee,
  RefreshCw,
  Calendar,
  Layers,
  Search,
} from "lucide-react";
import { EXPENSE_SECTIONS } from "@/config/constants";

export default function ExpensesOperationsPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [bySection, setBySection] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: 1500,
    category: "MATERIALS",
    linkedSection: "VEGETABLES",
    date: new Date().toISOString().split("T")[0],
    paidTo: "",
    notes: "",
  });

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const url =
        sectionFilter === "ALL"
          ? "/api/v1/operations/expenses"
          : `/api/v1/operations/expenses?section=${sectionFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setExpenses(json.data.expenses);
        setBySection(json.data.bySection);
        setTotal(json.data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [sectionFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        loadExpenses();
        setFormData({
          title: "",
          amount: 1500,
          category: "MATERIALS",
          linkedSection: "VEGETABLES",
          date: new Date().toISOString().split("T")[0],
          paidTo: "",
          notes: "",
        });
      } else {
        alert(json.error || "Failed to record expense");
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
            Section Cost Accounting
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Section-by-section cost ledger across Vegetables, Flowers, Saplings, Value-Added, Pashmina, and Farmstay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
          <button
            onClick={loadExpenses}
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
            Cumulative Physical Farm Expenditure
          </p>
          <h3 className="font-serif font-bold text-3xl text-stone-900 mt-1">
            ₹{total.toLocaleString()}
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            Across {expenses.length} ledger entries
          </span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
          <IndianRupee className="w-7 h-7" />
        </div>
      </div>

      {/* Section-by-Section Cost Breakdown Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
          Breakdown by Business Section
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(bySection).map(([sec, amt]) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec === sectionFilter ? "ALL" : sec)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                sectionFilter === sec
                  ? "border-emerald-800 bg-emerald-50/70 ring-2 ring-emerald-800/20"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                {sec}
              </span>
              <span className="text-base font-serif font-bold text-stone-900 mt-1 block">
                ₹{amt.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setSectionFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            sectionFilter === "ALL"
              ? "bg-emerald-800 text-white shadow-xs"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          All Sections
        </button>
        {Object.values(EXPENSE_SECTIONS).map((sec) => (
          <button
            key={sec}
            onClick={() => setSectionFilter(sec)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              sectionFilter === sec
                ? "bg-emerald-800 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Expenses Ledger Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading expenses...</div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No expenses recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Expense Title</th>
                  <th className="p-4">Linked Section</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Paid To</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">{exp.title}</span>
                      {exp.notes && <span className="text-[11px] text-stone-400">{exp.notes}</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {exp.linkedSection}
                      </span>
                    </td>
                    <td className="p-4 text-stone-600">{exp.category}</td>
                    <td className="p-4 text-stone-600">{exp.paidTo || "—"}</td>
                    <td className="p-4 text-stone-500">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right font-bold text-stone-900 text-sm">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Record Operational Expense
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apricot sapling rootstocks batch"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Linked Business Section *
                  </label>
                  <select
                    value={formData.linkedSection}
                    onChange={(e) => setFormData({ ...formData, linkedSection: e.target.value })}
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
                  <label className="block font-semibold text-stone-700 mb-1">Cost Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    <option value="MATERIALS">MATERIALS</option>
                    <option value="LABOR">LABOR</option>
                    <option value="EQUIPMENT">EQUIPMENT</option>
                    <option value="UTILITIES">UTILITIES</option>
                    <option value="TRANSPORT">TRANSPORT</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Paid To / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. Leh Agricultural Nursery"
                    value={formData.paidTo}
                    onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="Receipt number, batch details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                />
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
                  {isSubmitting ? "Saving..." : "Record Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
