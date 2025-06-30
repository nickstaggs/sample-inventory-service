import { Product } from '../shared/types';

const products: Product[] = [];

export default {
  getAllProducts(): Product[] {
    return products;
  },

  getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
  },

  createProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    products.push(newProduct);
    return newProduct;
  }
};
