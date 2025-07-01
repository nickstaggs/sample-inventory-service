import { InventoryItem } from "../shared/types";
import { DatabaseClient } from "../shared/database.interface";
import { logger } from "../shared/logger";
import { CacheService } from "../shared/cache";

const INVENTORY_CACHE_TTL = 900; // 15 minutes

export class InventoryService {
  constructor(private db: DatabaseClient<InventoryItem>) {}

  private getCacheKey(productId: string): string {
    return `inventory:${productId}`;
  }

  async getInventoryForProduct(
    productId: string,
  ): Promise<InventoryItem | undefined> {
    const cacheKey = this.getCacheKey(productId);
    const cached = await CacheService.get<InventoryItem>(cacheKey);
    if (cached) return cached;

    const items = await this.db.getAll();
    const inventory = items.find((i) => i.productId === productId);
    if (inventory) {
      await CacheService.set(cacheKey, inventory, INVENTORY_CACHE_TTL);
    }
    return inventory;
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
      return this.db.update(
        { productId: existing.productId },
        {
          quantity: item.quantity,
        },
      );
    } else {
      return this.db.create(item);
    }
  }
}
