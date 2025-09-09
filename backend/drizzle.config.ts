import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/default.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
