import { Product } from "../shared/types";
import { DatabaseClient } from "../shared/database.interface";
import { InventoryService } from "../inventory/service";
import { CacheService } from "../shared/cache";

const PRODUCT_CACHE_TTL = 1800; // 30 minutes

export class ProductService {
  constructor(
    private db: DatabaseClient<Product>,
    private inventoryService: InventoryService,
  ) {}

  private getCacheKey(id: string): string {
    return `product:${id}`;
  }

  async createProduct(
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
    initialQuantity: number = 0,
  ): Promise<Product> {
    try {
      const product = await this.db.create(productData);
      
      await this.inventoryService.updateInventory({
        productId: product.id,
        quantity: initialQuantity,
      });

      return product;
    } catch (error) {
      logger.error(`Failed to create product: ${error}`);
      throw error;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.db.getAll();
    } catch (error) {
      logger.error(`Failed to get all products: ${error}`);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const cacheKey = this.getCacheKey(id);
      const cached = await CacheService.get<Product>(cacheKey);
      if (cached) return cached;

      const product = await this.db.get(id);
      if (product) {
        await CacheService.set(cacheKey, product, PRODUCT_CACHE_TTL);
      }
      return product;
    } catch (error) {
      logger.error(`Failed to get product by id ${id}: ${error}`);
      throw error;
    }
  }
}
