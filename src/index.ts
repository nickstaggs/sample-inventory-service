import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DynamoDBAdapter } from "./shared/database/dynamodb";

// Configure AWS SDK for LocalStack
const dynamoDBConfig = {
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
};
import { Product } from "./shared/types";
import { InventoryItem } from "./shared/types";
import { ProductService } from "./products/service";
import { InventoryService } from "./inventory/service";
import productRoutes from "./products/routes";
import inventoryRoutes from "./inventory/routes";

const app = express();
const PORT = 3000;

// Initialize database adapters with LocalStack config
const productDB = new DynamoDBAdapter<Product>("Products", dynamoDBConfig);
const inventoryDB = new DynamoDBAdapter<InventoryItem>(
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
