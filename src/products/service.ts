import { Product } from '../shared/types';
import { DatabaseClient } from '../shared/database.interface';
import {InventoryService} from "../inventory/service";

export class ProductService {

  constructor(private db: DatabaseClient<Product>, private inventoryService: InventoryService) {}

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, initialQuantity: number = 0): Promise<Product> {
    const product = await this.db.create(productData);

    await this.inventoryService.updateInventory({
      productId: product.id,
      quantity: initialQuantity,
    });

    
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.db.getAll();
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.db.get(id);
  }
}
