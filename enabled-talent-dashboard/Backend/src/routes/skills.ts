import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

const ALLOWED_DEMAND_STATUSES = ["High", "Medium", "Low", "Rising", "Declining", "Stable"];

type SkillRow = {
  SkillID: number;
  SkillName: string;
  Category: string | null;
  DemandStatus: string | null;
  DateCreated: string;
};

function safeStr(v: unknown, max: number): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s.slice(0, max) : null;
}

// GET /api/skills?q=...
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q ?? "").trim().slice(0, 100);

    const result = q
      ? await pool.query<SkillRow>(
          `SELECT "SkillID","SkillName","Category","DemandStatus","DateCreated"
           FROM "Skills" WHERE "SkillName" ILIKE $1 ORDER BY "SkillName" ASC`,
          [`%${q}%`]
        )
      : await pool.query<SkillRow>(
          `SELECT "SkillID","SkillName","Category","DemandStatus","DateCreated"
           FROM "Skills" ORDER BY "SkillName" ASC`
        );

    res.json({ ok: true, count: result.rowCount, Skills: result.rows });
  } catch (err) {
    console.error("GET /api/skills error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch skills" });
  }
});

// GET /api/skills/gap?limit=10
router.get("/gap", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(Number(req.query.limit) || 10, 50));

    const result = await pool.query(
      `SELECT
         s."SkillID",
         s."SkillName",
         COALESCE(ss.students, 0)::int AS "students",
         COALESCE(js.jobs, 0)::int AS "jobs",
         (COALESCE(ss.students, 0) - COALESCE(js.jobs, 0))::int AS "gap",
         COALESCE(s."DemandStatus", 'Stable') AS "demand"
       FROM "Skills" s
       LEFT JOIN (
         SELECT "SkillID", COUNT(DISTINCT "StudentID") AS students
         FROM "StudentSkills" GROUP BY "SkillID"
       ) ss ON ss."SkillID" = s."SkillID"
       LEFT JOIN (
         SELECT "SkillID", COUNT(DISTINCT "JobID") AS jobs
         FROM "JobSkills" GROUP BY "SkillID"
       ) js ON js."SkillID" = s."SkillID"
       ORDER BY "gap" DESC, s."SkillName" ASC
       LIMIT $1`,
      [limit]
    );

    const normalizeDemand = (d: any) => {
      const v = String(d ?? "").toLowerCase();
      if (v.includes("rising") || v.includes("high")) return "Rising";
      if (v.includes("declin") || v.includes("low")) return "Declining";
      return "Stable";
    };

    const data = result.rows.map((r: any) => ({
      skill: r.SkillName,
      students: Number(r.students) || 0,
      jobs: Number(r.jobs) || 0,
      gap: Number(r.gap) || 0,
      demand: normalizeDemand(r.demand),
    }));

    res.json({ ok: true, count: data.length, data });
  } catch (err) {
    console.error("skills gap error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch skill gap" });
  }
});

// GET /api/skills/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid skill ID" });
    }

    const result = await pool.query<SkillRow>(
      `SELECT "SkillID","SkillName","Category","DemandStatus","DateCreated"
       FROM "Skills" WHERE "SkillID"=$1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Skill not found" });
    }

    res.json({ ok: true, skill: result.rows[0] });
  } catch (err) {
    console.error("GET /api/skills/:id error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch skill details" });
  }
});

// POST /api/skills
router.post("/", async (req, res) => {
  try {
    const skillName   = safeStr(req.body.skillName, 100);
    const category    = safeStr(req.body.category, 100);
    const demandStatus = safeStr(req.body.demandStatus, 50);

    if (!skillName) {
      return res.status(400).json({ ok: false, error: "Skill name is required" });
    }
    if (demandStatus && !ALLOWED_DEMAND_STATUSES.includes(demandStatus)) {
      return res.status(400).json({ ok: false, error: `demandStatus must be one of: ${ALLOWED_DEMAND_STATUSES.join(", ")}` });
    }

    const result = await pool.query<SkillRow>(
      `INSERT INTO "Skills" ("SkillName","Category","DemandStatus")
       VALUES ($1,$2,$3)
       RETURNING "SkillID","SkillName","Category","DemandStatus","DateCreated"`,
      [skillName, category, demandStatus]
    );

    res.status(201).json({ ok: true, skill: result.rows[0] });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ ok: false, error: "Skill name already exists." });
    }
    console.error("POST /api/skills error:", err);
    res.status(500).json({ ok: false, error: "Failed to create skill" });
  }
});

// PUT /api/skills/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid skill ID" });
    }

    const skillName    = req.body.skillName === undefined ? undefined : safeStr(req.body.skillName, 100);
    const category     = req.body.category === undefined ? undefined : safeStr(req.body.category, 100);
    const demandStatus = req.body.demandStatus === undefined ? undefined : safeStr(req.body.demandStatus, 50);

    if (skillName !== undefined && !skillName) {
      return res.status(400).json({ ok: false, error: "skillName cannot be empty" });
    }
    if (demandStatus && !ALLOWED_DEMAND_STATUSES.includes(demandStatus)) {
      return res.status(400).json({ ok: false, error: `demandStatus must be one of: ${ALLOWED_DEMAND_STATUSES.join(", ")}` });
    }

    const result = await pool.query<SkillRow>(
      `UPDATE "Skills"
       SET
         "SkillName"    = COALESCE($1, "SkillName"),
         "Category"     = COALESCE($2, "Category"),
         "DemandStatus" = COALESCE($3, "DemandStatus")
       WHERE "SkillID"=$4
       RETURNING "SkillID","SkillName","Category","DemandStatus","DateCreated"`,
      [
        skillName === undefined ? null : skillName,
        category === undefined ? null : category,
        demandStatus === undefined ? null : demandStatus,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Skill not found" });
    }

    res.json({ ok: true, skill: result.rows[0] });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ ok: false, error: "Skill name already exists." });
    }
    console.error("PUT /api/skills/:id error:", err);
    res.status(500).json({ ok: false, error: "Failed to update skill" });
  }
});

// DELETE /api/skills/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid skill ID" });
    }

    const result = await pool.query(
      `DELETE FROM "Skills" WHERE "SkillID"=$1 RETURNING "SkillID"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Skill not found" });
    }

    res.json({ ok: true, deletedSkillID: result.rows[0].SkillID });
  } catch (err: any) {
    if (err.code === "23503") {
      return res.status(409).json({ ok: false, error: "Cannot delete skill — remove references first" });
    }
    console.error("DELETE /api/skills/:id error:", err);
    res.status(500).json({ ok: false, error: "Failed to delete skill" });
  }
});

export default router;
