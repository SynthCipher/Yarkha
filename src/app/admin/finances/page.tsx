import React from "react";
import { expenseRepository } from "@/repositories/expenseRepository";
import { farmBatchRepository } from "@/repositories/farmBatchRepository";
import { FarmFinancesClient } from "@/components/admin/FarmFinancesClient";

export const dynamic = "force-dynamic";

export default async function AdminFinancesPage() {
  const [expensesData, summaryData, batchesData] = await Promise.all([
    expenseRepository.listAll({ limit: 150 }),
    expenseRepository.getFinancialSummary(),
    farmBatchRepository.listAll(),
  ]);

  const initialExpenses = JSON.parse(JSON.stringify(expensesData));
  const summary = JSON.parse(JSON.stringify(summaryData));
  const farmBatches = JSON.parse(JSON.stringify(batchesData));

  return (
    <FarmFinancesClient
      initialExpenses={initialExpenses}
      summary={summary}
      farmBatches={farmBatches}
    />
  );
}
