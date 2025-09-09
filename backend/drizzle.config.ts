import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/default.js";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/models/index.js",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
