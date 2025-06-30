import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { DynamoDBAdapter } from './shared/database/dynamodb';
import { Product } from './shared/types';
import { InventoryItem } from './shared/types';
import { ProductService } from './products/service';
import { InventoryService } from './inventory/service';
import productRoutes from './products/routes';
import inventoryRoutes from './inventory/routes';

const app = express();
const PORT = 3000;

// Initialize database adapters
const productDB = new DynamoDBAdapter<Product>('Products');
const inventoryDB = new DynamoDBAdapter<InventoryItem>('Inventory');

// Initialize services
const productService = new ProductService(productDB);
const inventoryService = new InventoryService(inventoryDB);

app.use(helmet());
app.use(cors());
app.use(express.json());

// Inject services into routes
app.use('/api/products', productRoutes(productService));
app.use('/api/inventory', inventoryRoutes(inventoryService));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
