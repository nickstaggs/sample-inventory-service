import { Inventory } from "../shared/types";
import { DatabaseClient } from "../shared/database.interface";
import { logger } from "../shared/logger";
import { CacheService } from "../shared/cache";

const INVENTORY_CACHE_TTL = 900; // 15 minutes

export class InventoryService {
  constructor(private db: DatabaseClient<Inventory>) {}

  private getCacheKey(productId: string): string {
    return `inventory:${productId}`;
  }

  async getInventoryForProduct(
    productId: string,
  ): Promise<Inventory | undefined> {
    const cacheKey = this.getCacheKey(productId);
    const cached = await CacheService.get<Inventory>(cacheKey);
    if (cached) return cached;

    const items = await this.db.getAll();
    const inventory = items.find((i) => i.productId === productId);
    if (inventory) {
      await CacheService.set(cacheKey, inventory, INVENTORY_CACHE_TTL);
    }
    return inventory;
  }

  async updateInventory(
    item: Omit<Inventory, "id" | "createdAt" | "updatedAt">,
  ): Promise<Inventory> {
    const existing = await this.getInventoryForProduct(item.productId);

    if (existing) {
      logger.info(
        `Updating existing inventory for product id ${existing?.productId}`,
      );
      const inventory = await this.db.update(
        { productId: existing.productId },
        {
          quantity: item.quantity,
        },
      );
      const cacheKey = this.getCacheKey(existing.productId);
      await CacheService.set(cacheKey, inventory, INVENTORY_CACHE_TTL);

      return inventory;
    } else {
      const inventory = await this.db.create(item);

      const cacheKey = this.getCacheKey(inventory.productId);
      await CacheService.set(cacheKey, inventory, INVENTORY_CACHE_TTL);

      return inventory;
    }
  }
}
