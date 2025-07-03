import {
  DynamoDBClient,
  CreateTableCommand,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import { logger } from "../src/shared/logger";

const client = new DynamoDBClient({
  endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  },
});

async function createTable(tableName: string, key: string) {
  try {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: [{ AttributeName: key, KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: key, AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    });

    await client.send(command);
    logger.info(`Created table ${tableName}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error creating table ${tableName}: ${error.message}`);
    } else {
      logger.error(`Unknown error creating table ${tableName}`);
    }
    throw error;
  }
}

async function waitForDynamoDB(client: DynamoDBClient, maxRetries = 5, delay = 1000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.send(new ListTablesCommand({}));
      logger.info("DynamoDB is ready");
      return;
    } catch (error) {
      logger.info(`Waiting for DynamoDB... (attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to connect to DynamoDB after multiple attempts");
}

async function initDB() {
  try {
    logger.info("Starting database initialization");
    await waitForDynamoDB(client);
    
    await Promise.all([
      createTable("Products", "id"),
      createTable("Inventory", "productId")
    ]);
    
    logger.info("Database initialization completed successfully");
  } catch (error) {
    logger.error(`Database initialization failed: ${error}`);
  }
}

initDB();
