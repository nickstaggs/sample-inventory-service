import { InventoryItem } from '../shared/types';

const inventory: InventoryItem[] = [];

export default {
  getInventoryForProduct(productId: string): InventoryItem | undefined {
    return inventory.find(i => i.productId === productId);
  },

  updateInventory(item: Omit<InventoryItem, 'lastUpdated'>): InventoryItem {
    const existingIndex = inventory.findIndex(i => i.productId === item.productId);
    const now = new Date();
    
    if (existingIndex >= 0) {
      inventory[existingIndex] = {
        ...item,
        lastUpdated: now
      };
      return inventory[existingIndex];
    } else {
      const newItem: InventoryItem = {
        ...item,
        lastUpdated: now
      };
      inventory.push(newItem);
      return newItem;
    }
  }
};
