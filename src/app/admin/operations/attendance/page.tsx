"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  RefreshCw,
  Users,
} from "lucide-react";

export default function AttendanceOperationsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [records, setRecords] = useState<any[]>([]);
  const [activeStaff, setActiveStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadAttendance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/operations/attendance?date=${selectedDate}`);
      const json = await res.json();
      if (json.success) {
        setRecords(json.data.records);
        setActiveStaff(json.data.activeStaff);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const handleMark = async (staffMember: any, status: "PRESENT" | "ABSENT" | "HALF_DAY") => {
    setIsUpdating(true);
    let wageCalculated = 0;
    if (status === "PRESENT") wageCalculated = staffMember.baseWage;
    else if (status === "HALF_DAY") wageCalculated = Math.round(staffMember.baseWage / 2);

    try {
      const res = await fetch("/api/v1/operations/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffMemberId: staffMember._id,
          date: selectedDate,
          status,
          wageCalculated,
        }),
      });
      const json = await res.json();
      if (json.success) {
        loadAttendance();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const attendanceMap = new Map();
  records.forEach((r) => {
    const id = r.staffMember?._id || r.staffMember;
    attendanceMap.set(id?.toString(), r);
  });

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const halfDayCount = records.filter((r) => r.status === "HALF_DAY").length;
  const totalDailyWage = records.reduce((acc, r) => acc + (r.wageCalculated || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-emerald-800">
            Physical Farm Operations
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Daily Staff Attendance & Wages
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Mark daily check-ins for farm hands and artisan weavers. Automatic daily wage tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs">
            <Calendar className="w-4 h-4 text-[#B45309]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={loadAttendance}
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
              Staff on Duty
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {presentCount} Present {halfDayCount > 0 && `(${halfDayCount} Half-Day)`}
            </h3>
            <span className="text-[10px] text-stone-500">
              Out of {activeStaff.length} active staff
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Today&apos;s Labor Cost
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              ₹{totalDailyWage.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Calculated Wages
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
              Attendance Progress
            </p>
            <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
              {records.length} / {activeStaff.length}
            </h3>
            <span className="text-[10px] text-stone-500">Recorded for this date</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading attendance...</div>
        ) : activeStaff.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No active staff found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Base Rate</th>
                  <th className="p-4">Status Today</th>
                  <th className="p-4">Wage Earned</th>
                  <th className="p-4 text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeStaff.map((s) => {
                  const record = attendanceMap.get(s._id.toString());
                  const currentStatus = record?.status;

                  return (
                    <tr key={s._id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-stone-900 block">{s.name}</span>
                        <span className="text-[10px] text-stone-400">{s.phone}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                          {s.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-stone-800">
                        ₹{s.baseWage} <span className="text-[10px] text-stone-400">/ day</span>
                      </td>
                      <td className="p-4">
                        {currentStatus === "PRESENT" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Present</span>
                          </span>
                        )}
                        {currentStatus === "HALF_DAY" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Half Day</span>
                          </span>
                        )}
                        {currentStatus === "ABSENT" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" />
                            <span>Absent</span>
                          </span>
                        )}
                        {!currentStatus && (
                          <span className="text-stone-400 italic text-[11px]">Unmarked</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-stone-900">
                        {record ? `₹${record.wageCalculated}` : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200">
                          <button
                            onClick={() => handleMark(s, "PRESENT")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === "PRESENT"
                                ? "bg-emerald-800 text-white shadow-xs"
                                : "text-stone-600 hover:bg-stone-200"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMark(s, "HALF_DAY")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === "HALF_DAY"
                                ? "bg-amber-700 text-white shadow-xs"
                                : "text-stone-600 hover:bg-stone-200"
                            }`}
                          >
                            Half Day
                          </button>
                          <button
                            onClick={() => handleMark(s, "ABSENT")}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              currentStatus === "ABSENT"
                                ? "bg-red-700 text-white shadow-xs"
                                : "text-stone-600 hover:bg-stone-200"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
