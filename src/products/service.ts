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

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    return this.db.create(productData);
  }
}
