import Redis from 'ioredis';
import { logger } from './logger';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const DEFAULT_TTL = 3600; // 1 hour cache time

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}: ${error}`);
      return null;
    }
  }

  static async set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (error) {
      logger.error(`Cache set error for key ${key}: ${error}`);
    }
  }

  static async invalidate(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Cache invalidation error for key ${key}: ${error}`);
    }
  }
}
