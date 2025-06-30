import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DatabaseClient } from '../database.interface';

export class DynamoDBAdapter<T extends { id: string }> implements DatabaseClient<T> {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async get(id: string): Promise<T | undefined> {
    const { Item } = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: { id }
    }));
    return Item as T | undefined;
  }

  async getAll(): Promise<T[]> {
    const { Items } = await this.client.send(new ScanCommand({
      TableName: this.tableName
    }));
    return Items as T[] || [];
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const newItem = { ...item, id: Date.now().toString() } as T;
    await this.client.send(new PutCommand({
      TableName: this.tableName,
      Item: newItem
    }));
    return newItem;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const updates = Object.entries(item)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = :${key}`)
      .join(', ');

    const expressionValues = Object.entries(item)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [`:${key}`]: value }), {});

    const { Attributes } = await this.client.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `set ${updates}`,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: 'ALL_NEW'
    }));

    return Attributes as T;
  }

  async delete(id: string): Promise<void> {
    await this.client.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { id }
    }));
  }
}
