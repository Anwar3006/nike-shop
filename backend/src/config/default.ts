import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
export const { PORT, VERSION, NODE_ENV, DATABASE_URL, FRONTEND_URL } =
  process.env;
