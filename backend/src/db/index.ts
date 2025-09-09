import { drizzle as localDrizzle } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

import { logger } from "../utils/logger.js";
import { sql } from "drizzle-orm";
import { DATABASE_URL, NODE_ENV } from "../config/default.js";
import * as schema from "../models/index.js";

if (!DATABASE_URL) {
  logger.error("Missing DATABASE_URL environment variable");
  throw new Error("Missing DATABASE_URL environment variable");
}

let db: ReturnType<typeof drizzle> | ReturnType<typeof localDrizzle>;
try {
  if (NODE_ENV === "development") {
    const pool = new Pool({ connectionString: DATABASE_URL });
    db = localDrizzle(pool, { schema });
  } else {
    const sql = neon(DATABASE_URL);
    db = drizzle(sql, { schema });
  }
} catch (error) {
  console.error("Failed to initialize the database:", error);
  throw new Error("Database initialization failed: " + error); // Or handle more gracefully
}

export { db };

export const testDb = async () => {
  try {
    await db.execute(sql`SELECT 1`);

    logger.info("Database connection successful");
  } catch (error: any) {
    logger.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
};
