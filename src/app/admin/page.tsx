import React from "react";
import Link from "next/link";
import { operationsService } from "@/services/operationsService";
import { orderRepository } from "@/repositories/orderRepository";
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sprout,
  CheckCircle2,
  Users,
  CheckSquare,
  Wrench,
  Layers,
  Flower,
  DollarSign,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [summary, recentOrdersData] = await Promise.all([
    operationsService.getDashboardOperationsSummary(),
    orderRepository.listAll({ limit: 6 }),
  ]);

  const recentOrders = JSON.parse(JSON.stringify(recentOrdersData.orders));

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
            Unified Operations & Commerce
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
            Stakna Farmhouse Dashboard
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            2-Acre Field Management, Inventory, Staffing, and Storefront Commercial Orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/operations/tasks"
            className="bg-[#B45309] hover:bg-[#92400E] text-white text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Manage Tasks</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders Pipeline</span>
          </Link>
        </div>
      </div>

      {/* COMMERCIAL & REVENUE METRICS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
          Commercial Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Storefront Revenue
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                ₹{summary.commercial.totalRevenue.toLocaleString()}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold">
                Online & Verified
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          {/* Today's Orders */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Today&apos;s Orders
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.commercial.todayOrders}
              </h3>
              <span className="text-[10px] text-[#B45309] font-semibold">Harvest Queue</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Active Deliveries */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Pending Orders
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.commercial.pendingOrders}
              </h3>
              <span className="text-[10px] text-blue-600 font-semibold">Awaiting Dispatch</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Garden Visits Inquiries */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Garden Inquiries
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.physicalOperations.pendingGardenVisits}
              </h3>
              <Link
                href="/admin/garden-visits"
                className="text-[10px] text-amber-700 font-semibold hover:underline"
              >
                Review Requests &rarr;
              </Link>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Flower className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* PHYSICAL FARM OPERATIONS METRICS */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
          Physical 2-Acre Farm Operations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Staff on Duty */}
          <Link
            href="/admin/operations/attendance"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-emerald-500 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Staff On Duty Today
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.physicalOperations.todayStaffOnDuty} / {summary.physicalOperations.activeStaffCount}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Checked In</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </Link>

          {/* Open Farm Tasks */}
          <Link
            href="/admin/operations/tasks"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-[#B45309] transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Open Field Tasks
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.physicalOperations.openTasksCount}
              </h3>
              <span className="text-[10px] text-stone-500">In Progress / Pending</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
          </Link>

          {/* Equipment Maintenance Due */}
          <Link
            href="/admin/operations/equipment"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-amber-500 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Equipment Due Care
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.physicalOperations.equipmentDueCount}
              </h3>
              <span className="text-[10px] text-amber-700 font-semibold">
                {summary.physicalOperations.equipmentDueCount > 0 ? "Maintenance Due" : "All Operational"}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
          </Link>

          {/* Raw Materials Low Stock */}
          <Link
            href="/admin/operations/stock"
            className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-red-400 transition-colors flex items-center justify-between group"
          >
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Raw Stock Alerts
              </p>
              <h3 className="font-serif font-bold text-2xl text-[#1C1917] mt-1">
                {summary.physicalOperations.lowStockMaterialsCount}
              </h3>
              <span className="text-[10px] text-red-600 font-semibold">
                {summary.physicalOperations.lowStockMaterialsCount > 0 ? "Reorder Needed" : "Sufficient Stock"}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>

      {/* OPERATIONS WORK QUEUES & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High-Priority Tasks */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#B45309]" />
              <span>Upcoming Field & Artisan Tasks</span>
            </h3>
            <Link
              href="/admin/operations/tasks"
              className="text-[11px] text-[#B45309] font-bold hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          {summary.physicalOperations.dueTasks.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">No pending tasks on the schedule.</p>
          ) : (
            <div className="space-y-3">
              {summary.physicalOperations.dueTasks.map((t: any) => (
                <div
                  key={t._id}
                  className="p-3 bg-[#FAF7F2] rounded-2xl border border-stone-200/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{t.title}</span>
                    <span className="text-[11px] text-stone-500">
                      Section: {t.section} · Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      t.priority === "HIGH" || t.priority === "URGENT"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Raw Supplies Alert */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <h3 className="font-serif font-bold text-base text-[#1C1917] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Raw Materials Stock Reorder Alerts</span>
            </h3>
            <Link
              href="/admin/operations/stock"
              className="text-[11px] text-[#B45309] font-bold hover:underline"
            >
              Manage Stock &rarr;
            </Link>
          </div>

          {summary.physicalOperations.lowStockMaterials.length === 0 ? (
            <p className="text-xs text-emerald-700 py-6 text-center flex items-center justify-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>All seeds, packaging, compost, and fleece above threshold.</span>
            </p>
          ) : (
            <div className="space-y-3">
              {summary.physicalOperations.lowStockMaterials.map((s: any) => (
                <div
                  key={s._id}
                  className="p-3 bg-red-50/60 rounded-2xl border border-red-200/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-red-950 block">{s.name}</span>
                    <span className="text-[11px] text-red-700">
                      Category: {s.category} · Store: {s.location}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-900 text-sm">
                      {s.quantity} {s.unit}
                    </span>
                    <span className="block text-[10px] text-red-600">
                      Min: {s.minThreshold} {s.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION-LINKED EXPENSE BREAKDOWN */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1C1917]">
              Section-by-Section Cost Accounting
            </h3>
            <p className="text-xs text-stone-500">
              Total Recorded Operating Expenses: ₹{summary.finances.totalExpenses.toLocaleString()}
            </p>
          </div>
          <Link
            href="/admin/operations/expenses"
            className="text-xs font-bold text-[#B45309] hover:underline"
          >
            Record Expense &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.entries(summary.finances.expensesBySection).map(([sec, amt]) => (
            <div key={sec} className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/60 text-center">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                {sec}
              </span>
              <span className="text-base font-serif font-bold text-stone-900 mt-1 block">
                ₹{(amt as number).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT STOREFRONT ORDERS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg text-[#1C1917]">
            Recent Customer Orders
          </h3>
          <Link href="/admin/orders" className="text-xs font-bold text-[#B45309] hover:underline">
            View All Orders &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-stone-500 py-6 text-center">No orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-[#FAF7F2] text-[10px] uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-3 rounded-l-xl">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.map((o: any) => (
                  <tr key={o._id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-bold text-stone-900">{o.orderNumber}</td>
                    <td className="p-3">{o.deliveryAddress?.fullName || "Guest"}</td>
                    <td className="p-3">
                      {o.deliveryAddress?.locality || o.deliveryAddress?.city},{" "}
                      {o.deliveryAddress?.state || "Ladakh"}
                    </td>
                    <td className="p-3">{o.items?.length || 0} item(s)</td>
                    <td className="p-3 font-bold text-stone-900">
                      ₹{o.pricing?.total?.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
