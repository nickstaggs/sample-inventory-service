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
  const command = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [{ AttributeName: key, KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: key, AttributeType: "S" }],
    BillingMode: "PAY_PER_REQUEST",
  });

  try {
    await client.send(command);
    logger.info(`Created table ${tableName}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`${err}`);
    }
  }
}

async function waitForDynamoDB(
  client: DynamoDBClient,
  maxRetries = 5,
  delay = 1000,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.send(new ListTablesCommand({}));
      logger.info("DynamoDB is ready");
      return;
    } catch (err) {
      logger.info(`Waiting for DynamoDB... (attempt ${i + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Failed to connect to DynamoDB");
}

async function initDB() {
  try {
    await waitForDynamoDB(client);
    await createTable("Products", "id");
    await createTable("Inventory", "productId");
    logger.info("Database initialization complete");
  } catch (err) {
    logger.error(`Database initialization failed: ${err}`);
    process.exit(1);
  }
}

initDB();
