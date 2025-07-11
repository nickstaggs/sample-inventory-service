import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DatabaseClient } from "../database.interface";
import { v4 as uuidv4 } from "uuid";
import { WithId } from "../types";
import { logger } from "../logger";

export class DynamoDBAdapter<T extends WithId> implements DatabaseClient<T> {
  private client: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(tableName: string, config?: any) {
    this.tableName = tableName;
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config || {}));
  }

  async get(id: string): Promise<T | undefined> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });
      const { Item } = await this.client.send(command);
      return Item as T | undefined;
    } catch (error) {
      logger.error(`Failed to get item ${id}: ${error}`);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });
      const { Items } = await this.client.send(command);
      return (Items as T[]) || [];
    } catch (error) {
      logger.error(`Failed to get all items: ${error}`);
      throw error;
    }
  }

  async create(item: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    try {
      const newItem = {
        ...item,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as T;

      const command = new PutCommand({
        TableName: this.tableName,
        Item: newItem,
      });
      await this.client.send(command);
      return newItem;
    } catch (error) {
      logger.error(`Failed to create item: ${error}`);
      throw error;
    }
  }

  async update(id: Record<string, string>, item: Partial<T>): Promise<T> {
    const updates = [];
    const expressionValues: Record<string, any> = {};
    const now = new Date().toISOString();

    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined) {
        updates.push(`${key} = :${key}`);
        expressionValues[`:${key}`] = value;
      }
    }

    // Always update the updatedAt field
    updates.push("updatedAt = :updatedAt");
    expressionValues[":updatedAt"] = now;

    logger.info(`Updating item ${id} with: ${JSON.stringify(item)}`);

    const { Attributes } = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: id,
        UpdateExpression: `set ${updates}`,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    return Attributes as T;
  }

  async delete(id: string): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    );
  }
}
