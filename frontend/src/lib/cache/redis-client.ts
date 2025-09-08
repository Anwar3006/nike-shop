import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

export const redisClient = async (): Promise<Redis> => {
  if (redisInstance) {
    return redisInstance;
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error("Redis environment variables are not configured");
    }

    redisInstance = new Redis({
      url,
      token,
    });

    // Test the connection
    await redisInstance.ping();

    return redisInstance;
    //
  } catch (error: unknown) {
    console.error("Redis initialization error:", error);
    redisInstance = null; // Reset on error
    if (error instanceof Error) {
      throw new Error(`Failed to initialize Redis client: ${error.message}`);
    } else {
      throw new Error("Failed to initialize Redis client: Unknown error");
    }
  }
};

// Optional: Reset connection for testing
export const resetRedisClient = () => {
  redisInstance = null;
};
