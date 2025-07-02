import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DynamoDBAdapter } from "./shared/database/dynamodb";
import { Product } from "./shared/types";
import { Inventory } from "./shared/types";
import { ProductService } from "./products/service";
import { InventoryService } from "./inventory/service";
import productRoutes from "./products/routes";
import inventoryRoutes from "./inventory/routes";
import { logger } from "./shared/logger";
import { collectDefaultMetrics, Registry } from 'prom-client';

// Configure AWS SDK for LocalStack
const dynamoDBConfig = {
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
};

const app = express();
const PORT = 3000;

const register = new Registry();
collectDefaultMetrics({ register });

// Initialize database adapters with LocalStack config
const productDB = new DynamoDBAdapter<Product>("Products", dynamoDBConfig);
const inventoryDB = new DynamoDBAdapter<Inventory>(
  "Inventory",
  dynamoDBConfig,
);

// Initialize services
const inventoryService = new InventoryService(inventoryDB);
const productService = new ProductService(productDB, inventoryService);

app.use(helmet());
app.use(cors());
app.use(express.json());

// Inject services into routes
app.use("/api/products", productRoutes(productService));
app.use("/api/inventory", inventoryRoutes(inventoryService));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
