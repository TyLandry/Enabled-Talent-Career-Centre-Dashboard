//Create a simple server using Express

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from './db/pool';
import skillsRouter from './routes/skills';
import dashboardRouter from "./routes/dashboard";
import studentsRouter from "./routes/students";
import jobsRouter from "./routes/jobs";
import placementsRouter from "./routes/placements";
import applicationsRouter from "./routes/applications";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/skills", skillsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/students", studentsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/placements", placementsRouter);
app.use("/api/applications", applicationsRouter);

// // Mount the dashboard router at /api/dashboard
// app.use('/api/dashboard', dashboardRouter);

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

const port = Number(process.env.PORT) || 5050;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));