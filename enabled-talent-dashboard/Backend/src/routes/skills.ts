//Creating a connection to the skills table in the database

/*
examples of how to use the API endpoints for skills management:
GET /api/skills
GET /api/skills?q=java
GET /api/skills/1
POST /api/skills body: { "skillName": "React", "category": "Frontend", "demandStatus": "High" }
PUT /api/skills/1 body: { "demandStatus": "Medium" }
DELETE /api/skills/1
*/

import { Router } from 'express';
import { pool } from '../db/pool';

const router = Router();

//Defining the SkillRow type to represent the structure of the records in Skills table
type SkillRow = {
    SkillID: number;
    SkillName: string;
    Category: string | null;
    DemandStatus: string | null;
    DateCreated: string;
}

type CreateSkillBody = {
    skillName: string;

    /*Optional fields for category and demand status, 
    thats why they are marked as optional with ?*/
    category?: string | null;
    demandStatus?: string | null;
}

type UpdateSkillBody = {
    skillName?: string;
    category?: string | null;
    demandStatus?: string | null;
}

//Get /api/skills?q=...
router.get('/', async (req, res) => {
    try {
        const q = String(req.query.q ?? '').trim();

        const Result = q ? await pool.query<SkillRow>(
            'SELECT "SkillID", "SkillName", "Category", "DemandStatus", "DateCreated" FROM "Skills" WHERE "SkillName" ILIKE $1 ORDER BY "SkillName" ASC',
            [`%${q}%`]

        ) : await pool.query<SkillRow>(
            'SELECT "SkillID", "SkillName", "Category", "DemandStatus", "DateCreated" FROM "Skills" ORDER BY "SkillName" ASC'
        );

        res.json({ ok: true, count: Result.rowCount, Skills: Result.rows });
    } catch (err) {
        console.error("GET /api/skills failed due to error:", err);
        res.status(500).json({ ok: false, error: "Failed to fetch skills" });
    }
});

// GET /api/skills/gap?limit=10
// Returns top skills where demand (jobs) exceeds supply (students)
router.get("/gap", async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(Number(req.query.limit) || 10, 50));

        const result = await pool.query(
            `
      SELECT
        s."SkillID",
        s."SkillName",
        COALESCE(ss.students, 0)::int AS "students",
        COALESCE(js.jobs, 0)::int AS "jobs",
        (COALESCE(ss.students, 0) - COALESCE(js.jobs, 0))::int AS "gap",
        COALESCE(s."DemandStatus", 'Stable') AS "demand"
      FROM "Skills" s
      LEFT JOIN (
        SELECT "SkillID", COUNT(DISTINCT "StudentID") AS students
        FROM "StudentSkills"
        GROUP BY "SkillID"
      ) ss ON ss."SkillID" = s."SkillID"
      LEFT JOIN (
        SELECT "SkillID", COUNT(DISTINCT "JobID") AS jobs
        FROM "JobSkills"
        GROUP BY "SkillID"
      ) js ON js."SkillID" = s."SkillID"
      ORDER BY "gap" DESC, s."SkillName" ASC
      LIMIT $1
      `,
            [limit]
        );

        // Normalize "demand" for the way the UI expects: Rising | Stable | Declining
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

//GET /api/skills/:id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ ok: false, error: "Invalid skill ID" });
        }

        const Result = await pool.query<SkillRow>(
            'SELECT "SkillID", "SkillName", "Category", "DemandStatus", "DateCreated" FROM "Skills" WHERE "SkillID" = $1',
            [id]
        );

        if (Result.rowCount === 0) {
            return res.status(404).json({ ok: false, error: "Skill not found" });
        }

        res.json({ ok: true, skill: Result.rows[0] });
    } catch (err) {
        console.error("GET /api/skills/:id failed due to error:", err);
        res.status(500).json({ ok: false, error: "Failed to fetch skill details" });
    }
});


//POST /api/skills
router.post('/', async (req, res) => {
    try {
        const skillName = String(req.body.skillName ?? "").trim();
        const category = req.body.category == null ? null : String(req.body.category).trim();
        const demandStatus = req.body.demandStatus == null ? null : String(req.body.demandStatus).trim();

        if (!skillName) {
            return res.status(400).json({ ok: false, error: "Skill name is required" });
        }

        const result = await pool.query<SkillRow>(
            'INSERT INTO "Skills" ("SkillName", "Category", "DemandStatus") VALUES ($1, $2, $3) RETURNING "SkillID", "SkillName", "Category", "DemandStatus", "DateCreated"',
            [skillName, category, demandStatus]
        );

        res.status(201).json({ ok: true, skill: result.rows[0] });
    } catch (err: any) {
        //code 23505 is the unique violation error code in PostgreSQL for everyone's information
        if (err.code === "23505") {
            return res.status(409).json({ ok: false, error: "Skill name exists already. Please choose a different name." });
        }
        console.error("POST /api/skills failed due to error:", err);
        res.status(500).json({ ok: false, error: "Failed to create skill" });
    }
});

//PUT /api/skills/:id
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ ok: false, error: "Invalid skill ID" });
        }

        //Check if the partial update fields are valid and trim them if they are strings
        const skillName = req.body.skillName === undefined ? undefined : String(req.body.skillName).trim();
        const category = req.body.category === undefined ? undefined : (req.body.category === null ? null : String(req.body.category).trim());
        const demandStatus =
            req.body.demandStatus === undefined ? undefined : (req.body.demandStatus === null ? null : String(req.body.demandStatus).trim());

        if (skillName !== undefined && !skillName) {
            return res.status(400).json({ ok: false, error: "skillName cannot be empty" });
        }

        const result = await pool.query<SkillRow>(
            `UPDATE "Skills"
        SET
            "SkillName" = COALESCE($1, "SkillName"),
            "Category" = COALESCE($2, "Category"),
            "DemandStatus" = COALESCE($3, "DemandStatus")
        WHERE "SkillID" = $4
        RETURNING "SkillID", "SkillName", "Category", "DemandStatus", "DateCreated"`,
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
        console.log("PUT /api/skills/:id updated skill with ID", id);
        res.json({ ok: true, skill: result.rows[0] });

    } catch (err: any) {
        if (err.code === "23505") {
            return res.status(409).json({ ok: false, error: "Skill name exists already. Please choose a different name." });
        }
        console.error("PUT /api/skills/:id failed due to error:", err);
        res.status(500).json({ ok: false, error: "Failed to update skill" });
    }
});

//DELETE /api/skills/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ ok: false, error: "Invalid skill ID" });
        }

        const result = await pool.query(
            'DELETE FROM "Skills" WHERE "SkillID" = $1 RETURNING "SkillID"',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, error: "Skill not found" });
        }

        res.json({ ok: true, deleteSKILLID: result.rows[0].SkillID });
    } catch (err: any) {
        if (err.code === "23503") {
            return res.status(409).json({ ok: false, error: "Cannot delete skill because it is referenced by other records, please remove those references first" });
        }
        console.error("DELETE /api/skills/:id failed due to error:", err);
        res.status(500).json({ ok: false, error: "Failed to delete skill" });
    }
});
export default router;