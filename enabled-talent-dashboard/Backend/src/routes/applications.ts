import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

/**
 * GET /api/applications/matched-summary
 * Returns counts used in Matched Applicants card.
 */
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

/**
 * GET /api/applications/matched?limit=5
 * Returns recent matched applications (basic info).
 */
router.get("/matched", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 50));

    const result = await pool.query(
      `
      SELECT
        "ApplicationID",
        "StudentID",
        "JobID",
        "DateApplied",
        "ApplicationStatus",
        "MatchScore"
      FROM "Applications"
      WHERE "ApplicationStatus" = 'Matched'
      ORDER BY "DateApplied" DESC NULLS LAST
      LIMIT $1
      `,
      [limit]
    );

    res.json({ ok: true, count: result.rows.length, applications: result.rows });
  } catch (err) {
    console.error("matched list error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch matched applications" });
  }
});

export default router;