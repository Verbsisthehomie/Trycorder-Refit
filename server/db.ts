import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  sensorLogs,
  voiceCommands,
  mediaFiles,
  crewMembers,
  serverConnections,
  conversationHistory,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Sensor data functions
export async function logSensorData(
  userId: number,
  data: {
    temperature?: number;
    pressure?: number;
    light?: number;
    magnetic?: number;
    gravity?: number;
    orientationAlpha?: number;
    orientationBeta?: number;
    orientationGamma?: number;
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(sensorLogs).values({
    userId,
    temperature: data.temperature ? data.temperature.toString() : undefined,
    pressure: data.pressure ? data.pressure.toString() : undefined,
    light: data.light ? data.light.toString() : undefined,
    magnetic: data.magnetic ? data.magnetic.toString() : undefined,
    gravity: data.gravity ? data.gravity.toString() : undefined,
    orientationAlpha: data.orientationAlpha ? data.orientationAlpha.toString() : undefined,
    orientationBeta: data.orientationBeta ? data.orientationBeta.toString() : undefined,
    orientationGamma: data.orientationGamma ? data.orientationGamma.toString() : undefined,
  });
}

export async function getSensorLogs(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(sensorLogs)
    .where(eq(sensorLogs.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(limit);
}

// Voice commands functions
export async function logVoiceCommand(
  userId: number,
  data: {
    transcript: string;
    command: string;
    confidence: number;
    result: string;
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(voiceCommands).values({
    userId,
    transcript: data.transcript,
    command: data.command,
    confidence: data.confidence.toString(),
    result: data.result,
  });
}

// Media files functions
export async function addMediaFile(
  userId: number,
  data: {
    filename: string;
    fileType: string;
    fileUrl: string;
    fileKey: string;
    fileSize: number;
    description?: string;
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(mediaFiles).values({
    userId,
    ...data,
  });
}

export async function getMediaFiles(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(mediaFiles)
    .where(eq(mediaFiles.userId, userId))
    .orderBy((t) => t.createdAt);
}

// Crew members functions
export async function addCrewMember(
  userId: number,
  data: {
    name: string;
    rank?: string;
    position?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(crewMembers).values({
    userId,
    ...data,
  });
}

export async function getCrewMembers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(crewMembers)
    .where(eq(crewMembers.userId, userId))
    .orderBy((t) => t.name);
}

// Server connections functions
export async function addServerConnection(
  userId: number,
  data: {
    name: string;
    host: string;
    port?: number;
    username?: string;
    connectionType: "ssh" | "ftp" | "http";
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(serverConnections).values({
    userId,
    ...data,
  });
}

export async function getServerConnections(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(serverConnections)
    .where(eq(serverConnections.userId, userId))
    .orderBy((t) => t.name);
}

// Conversation history functions
export async function addConversationMessage(
  userId: number,
  role: "user" | "assistant",
  content: string
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(conversationHistory).values({
    userId,
    role,
    content,
  });
}

export async function getConversationHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(conversationHistory)
    .where(eq(conversationHistory.userId, userId))
    .orderBy((t) => t.createdAt)
    .limit(limit);
}
