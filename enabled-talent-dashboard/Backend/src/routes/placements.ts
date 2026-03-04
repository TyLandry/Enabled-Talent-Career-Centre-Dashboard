import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

/**
 * GET /api/placements
 * Returns a list of placements
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        "PlacementID",
        "ApplicationID",
        "StaffID",
        "PlacementDate",
        "TimeToPlacement",
        "Salary",
        "PlacementType",
        "PlacementStatus",
        "DateCreated"
      FROM "Placements"
      ORDER BY "PlacementDate" DESC NULLS LAST
    `);

    res.json({
      ok: true,
      count: result.rowCount ?? result.rows.length,
      placements: result.rows,
    });
  } catch (err) {
    console.error("Error fetching placements:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch placements" });
  }
});

/**
 * GET /api/placements/this-month
 * Count placements in the current month
 */
router.get("/this-month", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*)::int AS count
      FROM "Placements"
      WHERE "PlacementDate" IS NOT NULL
        AND DATE_TRUNC('month', "PlacementDate") = DATE_TRUNC('month', CURRENT_DATE)
    `);

    res.json({ ok: true, placementsThisMonth: result.rows[0]?.count ?? 0 });
  } catch (err) {
    console.error("Error fetching placements this month:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch placements this month" });
  }
});

/**
 * GET /api/placements/avg-time
 * Average time-to-placement (days)
 */
router.get("/avg-time", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COALESCE(ROUND(AVG("TimeToPlacement"))::int, 0) AS avgTimeDays
      FROM "Placements"
      WHERE "TimeToPlacement" IS NOT NULL
        AND "TimeToPlacement" > 0
    `);

    res.json({ ok: true, avgTimeDays: result.rows[0]?.avgTimeDays ?? 0 });
  } catch (err) {
    console.error("Error fetching avg time-to-placement:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch avg time-to-placement" });
  }
});

/**
 * GET /api/placements/over-time
 * Monthly placements series for charts
 * Default: last 12 months
 */
router.get("/over-time", async (req, res) => {
  try {
    const months = Math.max(1, Math.min(Number(req.query.months) || 12, 60));

    const result = await pool.query(
      `
      SELECT
        DATE_TRUNC('month', "PlacementDate") AS month,
        COUNT(*)::int AS placements
      FROM "Placements"
      WHERE "PlacementDate" IS NOT NULL
        AND "PlacementDate" >= (CURRENT_DATE - ($1::int || ' months')::interval)
      GROUP BY 1
      ORDER BY 1 ASC
      `,
      [months]
    );

    // return month as ISO string for easy frontend parsing
    const data = result.rows.map((r: any) => ({
      month: r.month, // postgres timestamp
      placements: r.placements,
    }));

    res.json({ ok: true, months, data });
  } catch (err) {
    console.error("Error fetching placements over time:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch placements over time" });
  }
});

/**
 * GET /api/placements/recent?limit=5
 * Recent placements for "Recent Placements" card/table
 */
router.get("/recent", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 5, 50));

    const result = await pool.query(
      `
      SELECT
        "PlacementID",
        "ApplicationID",
        "PlacementDate",
        "PlacementType",
        "PlacementStatus",
        "Salary",
        "TimeToPlacement"
      FROM "Placements"
      ORDER BY "PlacementDate" DESC NULLS LAST
      LIMIT $1
      `,
      [limit]
    );

    res.json({ ok: true, count: result.rows.length, placements: result.rows });
  } catch (err) {
    console.error("Error fetching recent placements:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch recent placements" });
  }
});

export default router;