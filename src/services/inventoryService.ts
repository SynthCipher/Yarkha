import { productRepository } from "@/repositories/productRepository";

export interface InventoryItemRequest {
  productId: string;
  quantity: number;
}

export const inventoryService = {
  /**
   * Attempts atomic reservation for an array of items.
   * If any single item fails reservation, safely rolls back all previously reserved items in the batch.
   */
  async reserveItems(
    items: InventoryItemRequest[]
  ): Promise<{ success: boolean; failedProductId?: string; reason?: string }> {
    const reservedSoFar: InventoryItemRequest[] = [];

    for (const item of items) {
      const reserved = await productRepository.reserveInventory(
        item.productId,
        item.quantity
      );

      if (!reserved) {
        // Rollback already reserved items
        for (const prev of reservedSoFar) {
          await productRepository.releaseInventory(prev.productId, prev.quantity);
        }
        return {
          success: false,
          failedProductId: item.productId,
          reason: `Insufficient available quantity for product ${item.productId}`,
        };
      }

      reservedSoFar.push(item);
    }

    return { success: true };
  },

  /**
   * Releases inventory back to available stock if payment fails or order is cancelled.
   */
  async releaseItems(items: InventoryItemRequest[]): Promise<void> {
    for (const item of items) {
      await productRepository.releaseInventory(item.productId, item.quantity);
    }
  },

  /**
   * Permanently commits inventory deduction upon confirmed payment.
   */
  async commitItems(items: InventoryItemRequest[]): Promise<void> {
    for (const item of items) {
      await productRepository.commitDeduction(item.productId, item.quantity);
    }
  },
};
