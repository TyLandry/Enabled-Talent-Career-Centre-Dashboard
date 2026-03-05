import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// GET /api/applications/matched-summary
// Adjust "ApplicationStatus" values if your DB uses different labels
router.get("/matched-summary", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS "totalApplications",
        SUM(CASE WHEN "ApplicationStatus" = 'Matched' THEN 1 ELSE 0 END)::int AS "matchedApplicants",
        SUM(CASE WHEN "ApplicationStatus" IN ('Accepted','Hired','Placed') THEN 1 ELSE 0 END)::int AS "acceptedApplicants"
      FROM "Applications"
    `);

    res.json({
      ok: true,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("matched applicants error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch matched applicants" });
  }
});

export default router;