import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from "prom-client";

export const register = new Registry();

collectDefaultMetrics({ register });

export const graphqlRequestDuration = new Histogram({
  name: "graphql_request_duration_seconds",
  help: "GraphQL resolver execution time in seconds",
  labelNames: ["operation", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2],
  registers: [register],
});

export const graphqlRequestTotal = new Counter({
  name: "graphql_requests_total",
  help: "Total number of GraphQL requests",
  labelNames: ["operation", "status"],
  registers: [register],
});

export const cacheHits = new Counter({
  name: "redis_cache_hits_total",
  help: "Total Redis cache hits",
  labelNames: ["key_prefix"],
  registers: [register],
});

export const cacheMisses = new Counter({
  name: "redis_cache_misses_total",
  help: "Total Redis cache misses",
  labelNames: ["key_prefix"],
  registers: [register],
});

export const fileUploadsTotal = new Counter({
  name: "file_uploads_total",
  help: "Total number of file uploads",
  labelNames: ["file_type", "status"],
  registers: [register],
});

export const fileDeletesTotal = new Counter({
  name: "file_deletes_total",
  help: "Total number of file deletions",
  registers: [register],
});

export const uploadSizeBytes = new Histogram({
  name: "file_upload_size_bytes",
  help: "Size of uploaded files in bytes",
  buckets: [1024, 10240, 102400, 1048576, 10485760, 104857600],
  registers: [register],
});

export const rateLimitHits = new Counter({
  name: "rate_limit_hits_total",
  help: "Total number of rate limit rejections",
  labelNames: ["route"],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const totalStorageUsed = new Gauge({
  name: "storage_used_bytes",
  help: "Total storage used across all users in bytes",
  registers: [register],
});
