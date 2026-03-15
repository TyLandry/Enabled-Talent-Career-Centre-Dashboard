import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// GET /api/jobs/recent?limit=5
router.get("/recent", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 50));

    const result = await pool.query(
      `
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
      LIMIT $1
      `,
      [limit]
    );

    res.json({ ok: true, count: result.rows.length, jobs: result.rows });
  } catch (err) {
    console.error("recent opportunities error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch recent opportunities" });
  }
});

// GET /api/jobs
router.get("/", async (_req, res) => {
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

    res.json({ ok: true, count: result.rowCount, jobs: result.rows });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid job ID" });
    }

    const result = await pool.query(
      `
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
      WHERE "JobID" = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    res.json({ ok: true, job: result.rows[0] });
  } catch (err) {
    console.error("Error fetching job details:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch job details" });
  }
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const {
      CompanyID,
      JobTitle,
      Location,
      JobType,
      SalaryMin,
      SalaryMax,
      ExperienceLevel,
      DatePosted,
      ClosedDate,
      JobStatus,
    } = req.body;

    if (!JobTitle || !String(JobTitle).trim()) {
      return res.status(400).json({ ok: false, error: "JobTitle is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO "Jobs"
      (
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
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        CompanyID ?? null,
        String(JobTitle).trim(),
        Location ?? null,
        JobType ?? null,
        SalaryMin ?? null,
        SalaryMax ?? null,
        ExperienceLevel ?? null,
        DatePosted ?? null,
        ClosedDate ?? null,
        JobStatus ?? null,
      ]
    );

    res.status(201).json({ ok: true, job: result.rows[0] });
  } catch (err: any) {
    console.error("Error creating job:", err);
    res.status(500).json({ ok: false, error: "Failed to create job" });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid job ID" });
    }

    const {
      CompanyID,
      JobTitle,
      Location,
      JobType,
      SalaryMin,
      SalaryMax,
      ExperienceLevel,
      DatePosted,
      ClosedDate,
      JobStatus,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE "Jobs"
      SET
        "CompanyID" = $1,
        "JobTitle" = $2,
        "Location" = $3,
        "JobType" = $4,
        "SalaryMin" = $5,
        "SalaryMax" = $6,
        "ExperienceLevel" = $7,
        "DatePosted" = $8,
        "ClosedDate" = $9,
        "JobStatus" = $10
      WHERE "JobID" = $11
      RETURNING *
      `,
      [
        CompanyID ?? null,
        JobTitle ?? null,
        Location ?? null,
        JobType ?? null,
        SalaryMin ?? null,
        SalaryMax ?? null,
        ExperienceLevel ?? null,
        DatePosted ?? null,
        ClosedDate ?? null,
        JobStatus ?? null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    res.json({ ok: true, job: result.rows[0] });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ ok: false, error: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid job ID" });
    }

    const result = await pool.query(
      `
      DELETE FROM "Jobs"
      WHERE "JobID" = $1
      RETURNING "JobID"
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Job not found" });
    }

    res.json({ ok: true, deletedJobID: result.rows[0].JobID });
  } catch (err: any) {
    if (err.code === "23503") {
      return res.status(409).json({
        ok: false,
        error: "Cannot delete job because it is referenced by other records",
      });
    }

    console.error("Error deleting job:", err);
    res.status(500).json({ ok: false, error: "Failed to delete job" });
  }
});

export default router;