//Creating a connection pool for PostgreSQL database using pg library
import {Pool} from 'pg';
import dotenv from 'dotenv';

// dotenv.config();

dotenv.config({ override: true });
console.log("DATABASE_URL REAL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL cannot be found in environment variables. Please check your environment configuration.");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})