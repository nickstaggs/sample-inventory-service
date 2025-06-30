export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface InventoryItem {
  productId: string;
  quantity: number;
  location: string;
  lastUpdated: Date;
}
