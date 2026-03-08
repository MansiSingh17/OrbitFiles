import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  jsonb,
  // vector, // Comment this out for now
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Basic file/folder information
  name: text("name").notNull(),
  path: text("path").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),

  // Storage information
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),

  // Ownership
  userId: text("user_id").notNull(),
  parentId: uuid("parent_id"),

  // File/folder flags
  isFolder: boolean("is_folder").default(false).notNull(),
  isStarred: boolean("is_starred").default(false).notNull(),
  isTrash: boolean("is_trash").default(false).notNull(),

  // AI-powered features
  tags: jsonb("tags").$type<string[]>().default([]),
  aiDescription: text("ai_description"),
  aiSuggestedFolder: text("ai_suggested_folder"),
  // embedding: vector("embedding", { dimensions: 1536 }), // Comment out for now - requires pgvector extension

  // Duplicate detection
  contentHash: text("content_hash"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  fileId: uuid("file_id"),
  fileName: text("file_name"),
  action: text("action").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  theme: text("theme").default("light"),
  aiEnabled: boolean("ai_enabled").default(true),
  autoTagging: boolean("auto_tagging").default(true),
  preferences: jsonb("preferences").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  parent: one(files, {
    fields: [files.parentId],
    references: [files.id],
  }),
  children: many(files),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  file: one(files, {
    fields: [activityLogs.fileId],
    references: [files.id],
  }),
}));

export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileId: uuid("file_id").notNull(),
  userId: text("user_id").notNull(),
  chunkText: text("chunk_text").notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  embedding: jsonb("embedding").$type<number[]>(), // Store as JSON instead of vector
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Add relation
export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  file: one(files, {
    fields: [documentChunks.fileId],
    references: [files.id],
  }),
}));

// Type definitions
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;