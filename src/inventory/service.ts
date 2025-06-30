import { InventoryItem } from '../shared/types';
import { DatabaseClient } from '../shared/database.interface';

export class InventoryService {
  constructor(private db: DatabaseClient<InventoryItem>) {}

  async getInventoryForProduct(productId: string): Promise<InventoryItem | undefined> {
    const items = await this.db.getAll();
    return items.find(i => i.productId === productId);
  }

  async updateInventory(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const existing = await this.getInventoryForProduct(item.productId);
    
    if (existing) {
      return this.db.update(existing.productId, {
        ...item
      });
    } else {
      return this.db.create(item);
    }
  }
}
