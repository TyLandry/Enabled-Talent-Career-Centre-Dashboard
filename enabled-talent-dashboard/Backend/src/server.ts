//Create a simple server using Express

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from './db/pool';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Simple health check to make sure server is running and can connect to the database
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as "now"');
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});


const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));