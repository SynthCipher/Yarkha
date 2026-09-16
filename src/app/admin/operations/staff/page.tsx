"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Phone,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  BadgePercent,
  Calendar,
} from "lucide-react";
import { STAFF_ROLES, WAGE_TYPES } from "@/config/constants";

export default function StaffOperationsPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "FARM_HAND",
    phone: "",
    wageType: "DAILY_WAGE",
    baseWage: 800,
    emergencyContact: "",
    notes: "",
  });

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/operations/staff");
      const json = await res.json();
      if (json.success) {
        setStaff(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/operations/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        loadStaff();
        setFormData({
          name: "",
          role: "FARM_HAND",
          phone: "",
          wageType: "DAILY_WAGE",
          baseWage: 800,
          emergencyContact: "",
          notes: "",
        });
      } else {
        alert(json.error || "Failed to register staff member");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/v1/operations/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        loadStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
            Physical Farm Operations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Farm Hands & Artisan Roster
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage field workers, Pashmina spinners and weavers, logistics drivers, and wage structures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
          <button
            onClick={loadStaff}
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold p-2.5 rounded-xl transition-colors"
            title="Refresh Roster"
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
              Active Workers & Artisans
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {staff.filter((s) => s.active).length} Active
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Artisan Spinning Collective
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {staff.filter((s) => s.role === "ARTISAN_SPINNER" || s.role === "ARTISAN_WEAVER").length} Artisans
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <BadgePercent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Field & Greenhouses
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {staff.filter((s) => s.role === "FARM_HAND" || s.role === "SUPERVISOR").length} Hands
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading staff roster...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No staff members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Phone / Contact</th>
                  <th className="p-4">Wage Structure</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStaff.map((s) => (
                  <tr key={s._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-stone-900">{s.name}</div>
                      {s.notes && <span className="text-[11px] text-stone-400">{s.notes}</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {s.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{s.phone}</span>
                      </div>
                      {s.emergencyContact && (
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          Alt: {s.emergencyContact}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-stone-900">₹{s.baseWage}</span>{" "}
                      <span className="text-[10px] text-stone-500 uppercase">
                        / {s.wageType.replace("_", " ").toLowerCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      {s.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleStatus(s._id, s.active)}
                        className="text-[11px] text-stone-600 hover:text-stone-900 underline font-medium"
                      >
                        {s.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Register New Farm Staff / Artisan
            </h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diskit Lhamo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(STAFF_ROLES).map((role) => (
                      <option key={role} value={role}>
                        {role.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94191 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brother: 94191 11111"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Wage Structure *
                  </label>
                  <select
                    value={formData.wageType}
                    onChange={(e) => setFormData({ ...formData, wageType: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {Object.values(WAGE_TYPES).map((w) => (
                      <option key={w} value={w}>
                        {w.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base Wage (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.baseWage}
                    onChange={(e) => setFormData({ ...formData, baseWage: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Artisan Notes / Specialties
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master charkha spinner, 15 yrs experience in Kharnak fleece"
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
                  {isSubmitting ? "Saving..." : "Add to Roster"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
