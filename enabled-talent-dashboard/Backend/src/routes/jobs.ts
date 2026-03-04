import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// GET /api/jobs
// Returns a list of jobs
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        "JobID",
        "CompanyID",
        "JobTitle",
        "Location",
        "JobType",
        "SalaryMin",
        "SalaryMax",
        "ExperienceLevel",
        "DatePosted",
        "ClosedDate",
        "JobStatus"
      FROM "Jobs"
      ORDER BY "DatePosted" DESC NULLS LAST
    `);

    res.json({
      ok: true,
      count: result.rowCount,
      jobs: result.rows
    });

  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to fetch jobs"
    });
  }
});

export default router;