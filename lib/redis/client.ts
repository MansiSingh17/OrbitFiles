import { Redis } from "@upstash/redis";

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local");
}

export const redis = Redis.fromEnv();
