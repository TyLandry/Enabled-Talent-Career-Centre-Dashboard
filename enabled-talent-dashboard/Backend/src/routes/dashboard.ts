import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const students = await pool.query(
      'SELECT COUNT(*) FROM "Students"'
    );

    res.json({
      activeStudents: Number(students.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;