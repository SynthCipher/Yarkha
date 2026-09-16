import React from "react";
import { productRepository } from "@/repositories/productRepository";
import { categoryRepository } from "@/repositories/categoryRepository";
import { farmBatchRepository } from "@/repositories/farmBatchRepository";
import { ProductManagementClient } from "@/components/admin/ProductManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [productsData, categoriesData, farmBatchesData] = await Promise.all([
    productRepository.list({ limit: 200, status: "ALL" }),
    categoryRepository.listActive(),
    farmBatchRepository.listAll(),
  ]);

  const initialProducts = JSON.parse(JSON.stringify(productsData.products));
  const categories = JSON.parse(JSON.stringify(categoriesData));
  const farmBatches = JSON.parse(JSON.stringify(farmBatchesData));

  return (
    <ProductManagementClient
      initialProducts={initialProducts}
      categories={categories}
      farmBatches={farmBatches}
    />
  );
}
