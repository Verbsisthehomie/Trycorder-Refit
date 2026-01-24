import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Sensor data logs
export const sensorLogs = mysqlTable("sensor_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  temperature: decimal("temperature", { precision: 8, scale: 2 }),
  pressure: decimal("pressure", { precision: 8, scale: 2 }),
  light: decimal("light", { precision: 10, scale: 2 }),
  magnetic: decimal("magnetic", { precision: 8, scale: 2 }),
  gravity: decimal("gravity", { precision: 8, scale: 2 }),
  orientationAlpha: decimal("orientationAlpha", { precision: 8, scale: 2 }),
  orientationBeta: decimal("orientationBeta", { precision: 8, scale: 2 }),
  orientationGamma: decimal("orientationGamma", { precision: 8, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SensorLog = typeof sensorLogs.$inferSelect;
export type InsertSensorLog = typeof sensorLogs.$inferInsert;

// Voice commands log
export const voiceCommands = mysqlTable("voice_commands", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transcript: text("transcript"),
  command: varchar("command", { length: 64 }),
  confidence: decimal("confidence", { precision: 5, scale: 4 }),
  result: varchar("result", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VoiceCommand = typeof voiceCommands.$inferSelect;
export type InsertVoiceCommand = typeof voiceCommands.$inferInsert;

// Gallery/Media storage
export const mediaFiles = mysqlTable("media_files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileType: varchar("fileType", { length: 64 }),
  fileUrl: text("fileUrl"),
  fileKey: text("fileKey"),
  fileSize: int("fileSize"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;

// Crew information
export const crewMembers = mysqlTable("crew_members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  rank: varchar("rank", { length: 64 }),
  position: varchar("position", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  evaluation: text("evaluation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrewMember = typeof crewMembers.$inferSelect;
export type InsertCrewMember = typeof crewMembers.$inferInsert;

// Server connections
export const serverConnections = mysqlTable("server_connections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  host: varchar("host", { length: 255 }).notNull(),
  port: int("port"),
  username: varchar("username", { length: 255 }),
  connectionType: mysqlEnum("connectionType", ["ssh", "ftp", "http"]),
  lastConnected: timestamp("lastConnected"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServerConnection = typeof serverConnections.$inferSelect;
export type InsertServerConnection = typeof serverConnections.$inferInsert;

// Terminal sessions
export const terminalSessions = mysqlTable("terminal_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serverId: int("serverId"),
  sessionData: json("sessionData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TerminalSession = typeof terminalSessions.$inferSelect;
export type InsertTerminalSession = typeof terminalSessions.$inferInsert;

// AI conversation history
export const conversationHistory = mysqlTable("conversation_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConversationHistory = typeof conversationHistory.$inferSelect;
export type InsertConversationHistory = typeof conversationHistory.$inferInsert;
