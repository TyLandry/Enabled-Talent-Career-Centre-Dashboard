import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Active Students
    const studentsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM "Students"
       WHERE "StudentStatus" = 'Active'`
    );

    // Open Opportunities
    const jobsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM "Jobs"
       WHERE "JobStatus" = 'Open'`
    );

    // Placements This Month
    const placementsResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM "Placements"
       WHERE DATE_TRUNC('month', "PlacementDate") =
             DATE_TRUNC('month', CURRENT_DATE)`
    );

    res.json({
      activeStudents: studentsResult.rows[0].count,
      openOpportunities: jobsResult.rows[0].count,
      placementsThisMonth: placementsResult.rows[0].count,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;