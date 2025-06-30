import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DatabaseClient } from '../database.interface';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from "../types";

export class DynamoDBAdapter<T extends WithId> implements DatabaseClient<T> {
  private client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string, config?: any) {
    this.tableName = tableName;
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config || {}));
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

  async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const newItem = {
      ...item,
      id: uuidv4(),
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString()
    } as unknown as T;
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
