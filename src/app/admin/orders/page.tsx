import React from "react";
import Link from "next/link";
import { orderRepository } from "@/repositories/orderRepository";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const ordersData = await orderRepository.listAll({ limit: 50 });
  const orders = JSON.parse(JSON.stringify(ordersData.orders));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#1C1917]">
          Orders Pipeline & Dispatch
        </h1>
        <p className="text-xs text-[#78716C] mt-1">
          Monitor harvest fulfillment, dispatch drivers, and update customer order milestones.
        </p>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
