import { drizzle as localDrizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import ws from "ws";

import { logger } from "../utils/logger.js";
import { sql } from "drizzle-orm";
import { DATABASE_URL, NODE_ENV } from "../config/default.js";
import * as schema from "../models/index.js";

if (!DATABASE_URL) {
  logger.error("Missing DATABASE_URL environment variable");
  throw new Error("Missing DATABASE_URL environment variable");
}

// Configure neon to use WebSocket in non-browser environments
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

let db: ReturnType<typeof drizzle> | ReturnType<typeof localDrizzle>;

try {
  if (NODE_ENV === "development") {
    // Use regular PostgreSQL driver for local development
    const pool = new PgPool({ connectionString: DATABASE_URL });
    db = localDrizzle(pool, { schema });
    logger.info("Using local PostgreSQL driver for development");
  } else {
    // Use Neon serverless driver for production
    const pool = new NeonPool({ connectionString: DATABASE_URL });
    db = drizzle(pool, { schema });
    logger.info("Using Neon serverless driver for production");
  }
} catch (error) {
  console.error("Failed to initialize the database:", error);
  throw new Error("Database initialization failed: " + error);
}

export { db };

export const testDb = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info("Database connection successful");
  } catch (error: any) {
    logger.error("Error connecting to the database: " + error);
    throw new Error("Database connection failed");
  }
};
