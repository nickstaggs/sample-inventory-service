import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
  }
});

async function createTable(tableName: string, key: string) {
  const command = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [{ AttributeName: key, KeyType: 'HASH' }],
    AttributeDefinitions: [{ AttributeName: key, AttributeType: 'S' }],
    BillingMode: 'PAY_PER_REQUEST'
  });

  try {
    await client.send(command);
    console.log(`Created table ${tableName}`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Table ${tableName} already exists`);
    } else {
      console.error(`Error creating table ${tableName}:`, err);
    }
  }
}

async function initDB() {
  await createTable('Products', 'id');
  await createTable('Inventory', 'productId');
}

initDB();
