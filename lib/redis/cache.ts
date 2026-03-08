import { redis } from "./client";
import { cacheHits, cacheMisses } from "@/lib/metrics/registry";

export const TTL = {
  FILES_LIST: 60,
  STORAGE_ANALYTICS: 300,
  DUPLICATES: 600,
  IMAGEKIT_AUTH: 55,
  STARRED_FILES: 120,
} as const;

export const CacheKey = {
  filesList: (userId: string, folderId?: string) =>
    `files:${userId}:folder:${folderId ?? "root"}`,
  storageAnalytics: (userId: string) => `analytics:storage:${userId}`,
  duplicates: (userId: string) => `duplicates:${userId}`,
  imagekitAuth: (userId: string) => `imagekit:auth:${userId}`,
  starredFiles: (userId: string) => `files:${userId}:starred`,
};

function keyPrefix(key: string): string {
  return key.split(":")[0];
}

export async function getOrSet<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) {
    console.log("✅ CACHE HIT:", key);
    cacheHits.inc({ key_prefix: keyPrefix(key) });
    return cached;
  }
  console.log("🔄 CACHE MISS:", key);
  cacheMisses.inc({ key_prefix: keyPrefix(key) });
  const fresh = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(fresh));
  return fresh;
}

export async function invalidateUserCache(userId: string, folderId?: string) {
  const keys = [
    CacheKey.filesList(userId, folderId),
    CacheKey.filesList(userId),
    CacheKey.storageAnalytics(userId),
    CacheKey.duplicates(userId),
    CacheKey.starredFiles(userId),
  ];
  await Promise.all(keys.map((k) => redis.del(k)));
}

export async function invalidateKey(key: string) {
  await redis.del(key);
}
