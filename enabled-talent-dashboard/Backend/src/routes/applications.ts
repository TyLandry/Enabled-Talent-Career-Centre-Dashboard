import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

const ALLOWED_APP_STATUSES = ["Pending", "Matched", "Accepted", "Rejected", "Hired", "Placed", "Withdrawn"];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidUUID(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

// GET /api/applications/matched-summary
router.get("/matched-summary", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS "totalApplications",
        SUM(CASE WHEN "ApplicationStatus" = 'Matched' THEN 1 ELSE 0 END)::int AS "matchedApplicants",
        SUM(CASE WHEN "ApplicationStatus" IN ('Accepted','Hired','Placed') THEN 1 ELSE 0 END)::int AS "acceptedApplicants"
      FROM "Applications"
    `);
    res.json({ ok: true, ...result.rows[0] });
  } catch (err) {
    console.error("matched-summary error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch matched applicants summary" });
  }
});

// GET /api/applications/matched?limit=5
router.get("/matched", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 50));
    const result = await pool.query(
      `SELECT "ApplicationID","StudentID","JobID","DateApplied","ApplicationStatus","MatchScore"
       FROM "Applications"
       WHERE "ApplicationStatus" = 'Matched'
       ORDER BY "DateApplied" DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );
    res.json({ ok: true, count: result.rows.length, applications: result.rows });
  } catch (err) {
    console.error("matched list error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch matched applications" });
  }
});

// GET /api/applications
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT "ApplicationID","StudentID","JobID","DateApplied","ApplicationStatus","MatchScore"
       FROM "Applications"
       ORDER BY "DateApplied" DESC NULLS LAST`
    );
    res.json({ ok: true, count: result.rowCount ?? 0, applications: result.rows });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch applications" });
  }
});

// GET /api/applications/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid application ID" });
    }

    const result = await pool.query(
      `SELECT "ApplicationID","StudentID","JobID","DateApplied","ApplicationStatus","MatchScore"
       FROM "Applications"
       WHERE "ApplicationID"=$1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Application not found" });
    }

    res.json({ ok: true, application: result.rows[0] });
  } catch (err) {
    console.error("Error fetching application details:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch application details" });
  }
});

// POST /api/applications
router.post("/", async (req, res) => {
  const { StudentID, JobID, DateApplied, ApplicationStatus, MatchScore } = req.body;

  if (!isValidUUID(StudentID)) {
    return res.status(400).json({ ok: false, error: "StudentID must be a valid UUID" });
  }

  const jobID = Number(JobID);
  if (!Number.isInteger(jobID) || jobID <= 0) {
    return res.status(400).json({ ok: false, error: "JobID must be a positive integer" });
  }

  if (ApplicationStatus != null && !ALLOWED_APP_STATUSES.includes(String(ApplicationStatus))) {
    return res.status(400).json({ ok: false, error: `ApplicationStatus must be one of: ${ALLOWED_APP_STATUSES.join(", ")}` });
  }

  const matchScore = MatchScore != null ? Number(MatchScore) : null;
  if (matchScore != null && (!Number.isFinite(matchScore) || matchScore < 0 || matchScore > 100)) {
    return res.status(400).json({ ok: false, error: "MatchScore must be between 0 and 100" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Applications" ("StudentID","JobID","DateApplied","ApplicationStatus","MatchScore")
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [StudentID, jobID, DateApplied ?? null, ApplicationStatus ?? null, matchScore]
    );
    res.status(201).json({ ok: true, application: result.rows[0] });
  } catch (err: any) {
    console.error("Error creating application:", err);
    res.status(500).json({ ok: false, error: "Failed to create application" });
  }
});

// PUT /api/applications/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: "Invalid application ID" });
  }

  const { StudentID, JobID, DateApplied, ApplicationStatus, MatchScore } = req.body;

  if (StudentID != null && !isValidUUID(StudentID)) {
    return res.status(400).json({ ok: false, error: "StudentID must be a valid UUID" });
  }

  const jobID = JobID != null ? Number(JobID) : null;
  if (jobID != null && (!Number.isInteger(jobID) || jobID <= 0)) {
    return res.status(400).json({ ok: false, error: "JobID must be a positive integer" });
  }

  if (ApplicationStatus != null && !ALLOWED_APP_STATUSES.includes(String(ApplicationStatus))) {
    return res.status(400).json({ ok: false, error: `ApplicationStatus must be one of: ${ALLOWED_APP_STATUSES.join(", ")}` });
  }

  const matchScore = MatchScore != null ? Number(MatchScore) : null;
  if (matchScore != null && (!Number.isFinite(matchScore) || matchScore < 0 || matchScore > 100)) {
    return res.status(400).json({ ok: false, error: "MatchScore must be between 0 and 100" });
  }

  try {
    const result = await pool.query(
      `UPDATE "Applications"
       SET "StudentID"=$1,"JobID"=$2,"DateApplied"=$3,"ApplicationStatus"=$4,"MatchScore"=$5
       WHERE "ApplicationID"=$6
       RETURNING *`,
      [StudentID ?? null, jobID, DateApplied ?? null, ApplicationStatus ?? null, matchScore, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Application not found" });
    }

    res.json({ ok: true, application: result.rows[0] });
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(500).json({ ok: false, error: "Failed to update application" });
  }
});

// DELETE /api/applications/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, error: "Invalid application ID" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM "Applications" WHERE "ApplicationID"=$1 RETURNING "ApplicationID"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Application not found" });
    }

    res.json({ ok: true, deletedApplicationID: result.rows[0].ApplicationID });
  } catch (err: any) {
    if (err.code === "23503") {
      return res.status(409).json({
        ok: false,
        error: "Cannot delete application because it is referenced by other records",
      });
    }
    console.error("Error deleting application:", err);
    res.status(500).json({ ok: false, error: "Failed to delete application" });
  }
});

export default router;
