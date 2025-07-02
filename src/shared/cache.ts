import Redis from "ioredis";
import { logger } from "./logger";

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

const DEFAULT_TTL = 3600; // 1 hour cache time

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}: ${error}`);
      return null;
    }
  }

  static async set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await redisClient.set(key, serialized, "EX", ttl);
    } catch (error) {
      logger.error(`Cache set error for key ${key}: ${error}`);
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      const result = await redisClient.del(key);
      if (result === 0) {
        logger.warn(`Cache key ${key} not found during invalidation`);
      }
    } catch (error) {
      logger.error(`Cache invalidation error for key ${key}: ${error}`);
    }
  }
}
