import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { pool } from "./db/pool";
import skillsRouter from "./routes/skills";
import dashboardRouter from "./routes/dashboard";
import studentsRouter from "./routes/students";
import jobsRouter from "./routes/jobs";
import placementsRouter from "./routes/placements";
import applicationsRouter from "./routes/applications";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS — restrict to allowed origins from environment
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, mobile apps in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Enforce body size limit to prevent payload flooding
app.use(express.json({ limit: "10kb" }));

// Rate limiting — 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Mount routers
app.use("/api/skills", skillsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/students", studentsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/placements", placementsRouter);
app.use("/api/applications", applicationsRouter);

// Health check
app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as "now"');
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ ok: false, error: "DB connection failed" });
  }
});

// 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

// Global error handler — catches oversized payloads and other Express errors
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ ok: false, error: "Request payload too large" });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ ok: false, error: "Internal server error" });
});

const port = Number(process.env.PORT) || 5050;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
