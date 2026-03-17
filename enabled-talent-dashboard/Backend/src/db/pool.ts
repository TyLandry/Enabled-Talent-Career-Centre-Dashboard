import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Check your .env file."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
