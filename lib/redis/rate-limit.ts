import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./client";

export const uploadRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  prefix: "ratelimit:upload",
  analytics: true,
});

export const aiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:ai",
  analytics: true,
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  prefix: "ratelimit:api",
  analytics: true,
});
