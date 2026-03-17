import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// UUID v4 validation regex
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ALLOWED_STATUSES = ["Active", "Inactive", "Graduated", "Withdrawn"];
const ALLOWED_GENDERS  = ["Male", "Female", "Other"];

function isValidUUID(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

function safeStr(v: unknown, max: number): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s.slice(0, max) : null;
}

// GET /api/students
router.get("/", async (_req, res) => {
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

    res.json({ ok: true, count: result.rowCount ?? 0, students: result.rows });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch students" });
  }
});

// GET /api/students/demographics
router.get("/demographics", async (_req, res) => {
  try {
    const totalResult = await pool.query(`
      SELECT COUNT(*)::int AS "total" FROM "Students"
    `);

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
      topSkills: topSkillsResult.rows,
    });
  } catch (err) {
    console.error("Error fetching student demographics:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch demographics" });
  }
});

// POST /api/students
router.post("/", async (req, res) => {
  const {
    FirstName,
    LastName,
    Phone,
    DateOfBirth,
    Gender,
    Email,
    StudentStatus,
    EnrollmentDate,
  } = req.body;

  const firstName = safeStr(FirstName, 100);
  const lastName  = safeStr(LastName, 100);
  const email     = safeStr(Email, 255);

  if (!firstName) {
    return res.status(400).json({ ok: false, error: "FirstName is required" });
  }
  if (!lastName) {
    return res.status(400).json({ ok: false, error: "LastName is required" });
  }
  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email format" });
  }
  if (Gender != null && !ALLOWED_GENDERS.includes(String(Gender))) {
    return res.status(400).json({ ok: false, error: `Gender must be one of: ${ALLOWED_GENDERS.join(", ")}` });
  }
  if (StudentStatus != null && !ALLOWED_STATUSES.includes(String(StudentStatus))) {
    return res.status(400).json({ ok: false, error: `StudentStatus must be one of: ${ALLOWED_STATUSES.join(", ")}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Students" ("FirstName","LastName","Phone","DateOfBirth","Gender","Email","StudentStatus","EnrollmentDate")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        firstName,
        lastName,
        safeStr(Phone, 20),
        DateOfBirth ?? null,
        Gender ?? null,
        email,
        StudentStatus ?? null,
        EnrollmentDate ?? null,
      ]
    );
    res.status(201).json({ ok: true, student: result.rows[0] });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ ok: false, error: "Failed to create student" });
  }
});

// PUT /api/students
router.put("/", async (req, res) => {
  const {
    StudentID,
    FirstName,
    LastName,
    Phone,
    DateOfBirth,
    Gender,
    Email,
    StudentStatus,
    EnrollmentDate,
  } = req.body;

  if (!isValidUUID(StudentID)) {
    return res.status(400).json({ ok: false, error: "Valid StudentID (UUID) is required" });
  }

  const firstName = safeStr(FirstName, 100);
  const lastName  = safeStr(LastName, 100);
  const email     = safeStr(Email, 255);

  if (!firstName) {
    return res.status(400).json({ ok: false, error: "FirstName is required" });
  }
  if (!lastName) {
    return res.status(400).json({ ok: false, error: "LastName is required" });
  }
  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email format" });
  }
  if (Gender != null && !ALLOWED_GENDERS.includes(String(Gender))) {
    return res.status(400).json({ ok: false, error: `Gender must be one of: ${ALLOWED_GENDERS.join(", ")}` });
  }
  if (StudentStatus != null && !ALLOWED_STATUSES.includes(String(StudentStatus))) {
    return res.status(400).json({ ok: false, error: `StudentStatus must be one of: ${ALLOWED_STATUSES.join(", ")}` });
  }

  try {
    const result = await pool.query(
      `UPDATE "Students"
       SET "FirstName"=$1,"LastName"=$2,"Phone"=$3,"DateOfBirth"=$4,"Gender"=$5,"Email"=$6,"StudentStatus"=$7,"EnrollmentDate"=$8
       WHERE "StudentID"=$9
       RETURNING *`,
      [
        firstName,
        lastName,
        safeStr(Phone, 20),
        DateOfBirth ?? null,
        Gender ?? null,
        email,
        StudentStatus ?? null,
        EnrollmentDate ?? null,
        StudentID,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Student not found" });
    }

    res.json({ ok: true, student: result.rows[0] });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ ok: false, error: "Failed to update student" });
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({ ok: false, error: "Invalid student ID" });
  }

  try {
    const result = await pool.query(
      `DELETE FROM "Students" WHERE "StudentID"=$1 RETURNING "StudentID"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Student not found" });
    }

    res.json({ ok: true, deletedStudentID: result.rows[0].StudentID });
  } catch (err: any) {
    if (err.code === "23503") {
      return res.status(409).json({
        ok: false,
        error: "Cannot delete student because it is referenced by other records",
      });
    }
    console.error("Error deleting student:", err);
    res.status(500).json({ ok: false, error: "Failed to delete student" });
  }
});

export default router;
