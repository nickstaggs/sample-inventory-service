import { InventoryItem } from "../shared/types";
import { DatabaseClient } from "../shared/database.interface";
import { logger } from "../shared/logger";

export class InventoryService {
  constructor(private db: DatabaseClient<InventoryItem>) {}

  async getInventoryForProduct(
    productId: string,
  ): Promise<InventoryItem | undefined> {
    const items = await this.db.getAll();
    return items.find((i) => i.productId === productId);
  }

  async updateInventory(
    item: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">,
  ): Promise<InventoryItem> {
    const existing = await this.getInventoryForProduct(item.productId);

    logger.info(
      `Updated inventory for ${item.productId} with id ${existing?.id} ${existing?.productId} ${existing?.quantity}`,
    );

    if (existing) {
      logger.info(
        `Updating existing inventory for product id ${existing?.productId}`,
      );
      return this.db.update(existing.id, {
        ...item,
        updatedAt: new Date().toISOString()
      });
    } else {
      return this.db.create(item);
    }
  }
}
