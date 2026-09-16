import React from "react";
import { farmBatchRepository } from "@/repositories/farmBatchRepository";
import { FarmBatchesClient } from "@/components/admin/FarmBatchesClient";

export const dynamic = "force-dynamic";

export default async function FarmBatchesAdminPage() {
  const batchesData = await farmBatchRepository.listAll();
  const batches = JSON.parse(JSON.stringify(batchesData));

  return <FarmBatchesClient initialBatches={batches} />;
}
