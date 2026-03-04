import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

/**
 * GET /api/students
 * Returns list of students (basic)
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        "StudentID",
        "FirstName",
        "LastName",
        "Email",
        "StudentStatus"
      FROM "Students"
      ORDER BY "LastName" ASC NULLS LAST, "FirstName" ASC NULLS LAST
    `);

    res.json({
      ok: true,
      count: result.rowCount ?? 0,
      students: result.rows,
    });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch students" });
  }
});

/**
 * GET /api/students/demographics
 * Returns totals + gender split + top skills
 */
router.get("/demographics", async (req, res) => {
  try {
    // 1) Total students (you can filter Active if you want)
    const totalResult = await pool.query(`
      SELECT COUNT(*)::int AS "total"
      FROM "Students"
    `);

    // 2) Gender split (normalize messy values)
    // This groups everything into: male / female / other
    const genderResult = await pool.query(`
      SELECT
        CASE
          WHEN "Gender" IS NULL OR BTRIM("Gender") = '' THEN 'other'
          WHEN LOWER(BTRIM("Gender")) IN ('male','m','man','masc','masculine') THEN 'male'
          WHEN LOWER(BTRIM("Gender")) IN ('female','f','woman','fem','feminine') THEN 'female'
          ELSE 'other'
        END AS "gender_group",
        COUNT(*)::int AS "count"
      FROM "Students"
      GROUP BY 1
    `);

    const byGender = { male: 0, female: 0, other: 0 };
    for (const row of genderResult.rows) {
      const key = row.gender_group as "male" | "female" | "other";
      byGender[key] = Number(row.count) || 0;
    }

    // 3) Top skills (students per skill)
    // If DB is empty, returns []
    const topSkillsResult = await pool.query(`
      SELECT
        s."SkillName" AS "skill",
        COUNT(DISTINCT ss."StudentID")::int AS "students"
      FROM "StudentSkills" ss
      JOIN "Skills" s ON s."SkillID" = ss."SkillID"
      GROUP BY s."SkillName"
      ORDER BY "students" DESC, s."SkillName" ASC
      LIMIT 5
    `);

    res.json({
      ok: true,
      totalStudents: Number(totalResult.rows[0]?.total ?? 0),
      byGender,
      topSkills: topSkillsResult.rows, // [{ skill: "JavaScript", students: 12 }, ...]
    });
  } catch (err) {
    console.error("Error fetching student demographics:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch demographics" });
  }
});

export default router;