import { Product } from '../shared/types';
import { DatabaseClient } from '../shared/database.interface';

export class ProductService {
  constructor(private db: DatabaseClient<Product>) {}

  async getAllProducts(): Promise<Product[]> {
    return this.db.getAll();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.db.get(id);
  }

  constructor(private db: DatabaseClient<Product>, private inventoryService?: InventoryService) {}

  async createProduct(productData: Omit<Product, 'id'>, initialQuantity: number = 0): Promise<Product> {
    const product = await this.db.create(productData);
    
    if (this.inventoryService && initialQuantity > 0) {
      await this.inventoryService.updateInventory({
        productId: product.id,
        quantity: initialQuantity,
        location: 'Default Warehouse'
      });
    }
    
    return product;
  }
}
