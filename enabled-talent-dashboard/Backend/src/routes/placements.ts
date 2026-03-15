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
        p."PlacementID",
        p."ApplicationID",
        p."PlacementDate",
        p."PlacementType",
        p."PlacementStatus",
        p."Salary",
        p."TimeToPlacement",
        s."FirstName",
        s."LastName",
        j."JobTitle"
      FROM "Placements" p
      LEFT JOIN "Applications" a ON p."ApplicationID" = a."ApplicationID"
      LEFT JOIN "Students" s ON a."StudentID" = s."StudentID"
      LEFT JOIN "Jobs" j ON a."JobID" = j."JobID"
      ORDER BY p."PlacementDate" DESC NULLS LAST
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

// GET /api/placements/performance?year=2026&timeRange=1M&comparisonYear=2025
// Returns KPI summary for Placement Performance card with date filtering
router.get("/performance", async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const timeRange = String(req.query.timeRange || '1Y');
    const comparisonYear = req.query.comparisonYear ? Number(req.query.comparisonYear) : null;

    // Calculate date range based on timeRange
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const isCurrentYear = year === currentYear;

    let startDate: string;
    let endDate: string;

    if (timeRange === '1Y') {
      // Entire year: Jan 1 - Dec 31
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
    } else if (timeRange === '3M') {
      if (isCurrentYear) {
        // Most recent 3 complete months
        // If today is March 13, show Dec, Jan, Feb (3 most recent complete months)
        const currentMonth = currentDate.getMonth(); // 0-11
        const endMonth = currentMonth === 0 ? 12 : currentMonth; // If Jan, use Dec of previous year
        const endYear = currentMonth === 0 ? year - 1 : year;
        
        const endMonthDate = new Date(endYear, endMonth, 0); // Last day of previous month
        const startMonthDate = new Date(endYear, endMonth - 3, 1); // First day 3 months back
        
        startDate = startMonthDate.toISOString().split('T')[0]!;
        endDate = endMonthDate.toISOString().split('T')[0]!;
      } else {
        // Last 3 months of that year (Oct-Dec)
        startDate = `${year}-10-01`;
        endDate = `${year}-12-31`;
      }
    } else if (timeRange === '1M') {
      if (isCurrentYear) {
        // Most recent complete month
        // If today is March 13, show February
        const currentMonth = currentDate.getMonth(); // 0-11
        const prevMonth = currentMonth === 0 ? 12 : currentMonth;
        const prevYear = currentMonth === 0 ? year - 1 : year;
        
        const firstDay = new Date(prevYear, prevMonth - 1, 1);
        const lastDay = new Date(prevYear, prevMonth, 0);
        
        startDate = firstDay.toISOString().split('T')[0]!;
        endDate = lastDay.toISOString().split('T')[0]!;
      } else {
        // Last month of that year (December)
        startDate = `${year}-12-01`;
        endDate = `${year}-12-31`;
      }
    } else { // 1W
      if (isCurrentYear) {
        // Most recent complete week (Monday to Sunday)
        // If today is Thursday March 13, show previous Monday-Sunday (March 2-8)
        const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const daysToMonday = dayOfWeek === 0 ? 6 : (dayOfWeek - 1); // Days to go back to this week's Monday
        const daysToLastSunday = daysToMonday + 1; // One more day to get to last Sunday
        
        const lastSunday = new Date(currentDate);
        lastSunday.setDate(currentDate.getDate() - daysToLastSunday);
        
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);
        
        startDate = lastMonday.toISOString().split('T')[0]!;
        endDate = lastSunday.toISOString().split('T')[0]!;
      } else {
        // Last complete week of that year (likely Dec 25-31 or similar)
        const dec31 = new Date(year, 11, 31);
        const dayOfWeek = dec31.getDay();
        const daysToSunday = dayOfWeek === 0 ? 0 : (7 - dayOfWeek);
        
        const lastSunday = new Date(dec31);
        lastSunday.setDate(31 - daysToSunday);
        
        const lastMonday = new Date(lastSunday);
        lastMonday.setDate(lastSunday.getDate() - 6);
        
        startDate = lastMonday.toISOString().split('T')[0]!;
        endDate = lastSunday.toISOString().split('T')[0]!;
      }
    }

    // placed = total placements in date range
    const placedQ = await pool.query(`
      SELECT COUNT(*)::int AS "placed"
      FROM "Placements"
      WHERE "PlacementDate" >= $1::date AND "PlacementDate" <= $2::date
    `, [startDate, endDate]);

    // goal = active students (not date filtered)
    const goalQ = await pool.query(`
      SELECT COUNT(*)::int AS "goal"
      FROM "Students"
      WHERE "StudentStatus" = 'Active'
    `);

    // avg time to placement (days) in date range
    const avgTimeQ = await pool.query(`
      SELECT COALESCE(AVG("TimeToPlacement"), 0)::float AS "avgTimeDays"
      FROM "Placements"
      WHERE "PlacementDate" >= $1::date AND "PlacementDate" <= $2::date
    `, [startDate, endDate]);

    // conversion = placements / applications in date range
    const appsQ = await pool.query(`
      SELECT COUNT(*)::int AS "applications"
      FROM "Applications"
      WHERE "DateApplied" >= $1::date AND "DateApplied" <= $2::date
    `, [startDate, endDate]);

    const placed = placedQ.rows[0]?.placed ?? 0;
    const goal = goalQ.rows[0]?.goal ?? 0;
    const avgTimeDays = Math.round(Number(avgTimeQ.rows[0]?.avgTimeDays ?? 0));
    const applications = appsQ.rows[0]?.applications ?? 0;

    const placementRate = goal > 0 ? Math.round((placed / goal) * 100) : 0;
    const conversion = applications > 0 ? Math.round((placed / applications) * 100) : 0;

    // Calculate period-over-period change (always calculated for single period view)
    let periodStartDate: string;
    let periodEndDate: string;

    if (timeRange === '1Y') {
      // Compare to previous year
      periodStartDate = `${year - 1}-01-01`;
      periodEndDate = `${year - 1}-12-31`;
    } else if (timeRange === '3M') {
      // Compare to previous 3 months
      const start = new Date(startDate);
      const end = new Date(endDate);
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      
      const compEnd = new Date(start);
      compEnd.setDate(start.getDate() - 1);
      
      const compStart = new Date(compEnd);
      compStart.setDate(compEnd.getDate() - duration);
      
      periodStartDate = compStart.toISOString().split('T')[0]!;
      periodEndDate = compEnd.toISOString().split('T')[0]!;
    } else if (timeRange === '1M') {
      // Compare to previous month
      const start = new Date(startDate);
      const prevMonthEnd = new Date(start);
      prevMonthEnd.setDate(start.getDate() - 1);
      
      const prevMonthStart = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1);
      
      periodStartDate = prevMonthStart.toISOString().split('T')[0]!;
      periodEndDate = prevMonthEnd.toISOString().split('T')[0]!;
    } else { // 1W
      // Compare to previous week
      const start = new Date(startDate);
      const prevWeekEnd = new Date(start);
      prevWeekEnd.setDate(start.getDate() - 1);
      
      const prevWeekStart = new Date(prevWeekEnd);
      prevWeekStart.setDate(prevWeekEnd.getDate() - 6);
      
      periodStartDate = prevWeekStart.toISOString().split('T')[0]!;
      periodEndDate = prevWeekEnd.toISOString().split('T')[0]!;
    }

    // Query placements for previous period
    const periodPlacedQ = await pool.query(`
      SELECT COUNT(*)::int AS "placed"
      FROM "Placements"
      WHERE "PlacementDate" >= $1::date AND "PlacementDate" <= $2::date
    `, [periodStartDate, periodEndDate]);

    const periodPlaced = periodPlacedQ.rows[0]?.placed ?? 0;
    
    const periodChange = periodPlaced > 0 
      ? Math.round(((placed - periodPlaced) / periodPlaced) * 100)
      : (placed > 0 ? 100 : 0);

    // Query avg time for previous period
    const periodAvgTimeQ = await pool.query(`
      SELECT COALESCE(AVG("TimeToPlacement"), 0)::float AS "avgTimeDays"
      FROM "Placements"
      WHERE "PlacementDate" >= $1::date AND "PlacementDate" <= $2::date
    `, [periodStartDate, periodEndDate]);

    const periodAvgTimeDays = Math.round(Number(periodAvgTimeQ.rows[0]?.avgTimeDays ?? 0));
    const avgTimeDiff = periodAvgTimeDays - avgTimeDays; // Positive means current is faster

    // Calculate year-over-year change only when comparing two specific years
    let yoyChange = 0;
    
    if (comparisonYear !== null) {
      // Calculate the same time range for the comparison year
      let compStartDate: string;
      let compEndDate: string;

      if (timeRange === '1Y') {
        // Entire year for comparison year
        compStartDate = `${comparisonYear}-01-01`;
        compEndDate = `${comparisonYear}-12-31`;
      } else if (timeRange === '3M') {
        const isCompCurrentYear = comparisonYear === currentYear;
        if (isCompCurrentYear) {
          const currentMonth = currentDate.getMonth();
          const endMonth = currentMonth === 0 ? 12 : currentMonth;
          const endYear = currentMonth === 0 ? comparisonYear - 1 : comparisonYear;
          
          const endMonthDate = new Date(endYear, endMonth, 0);
          const startMonthDate = new Date(endYear, endMonth - 3, 1);
          
          compStartDate = startMonthDate.toISOString().split('T')[0]!;
          compEndDate = endMonthDate.toISOString().split('T')[0]!;
        } else {
          compStartDate = `${comparisonYear}-10-01`;
          compEndDate = `${comparisonYear}-12-31`;
        }
      } else if (timeRange === '1M') {
        const isCompCurrentYear = comparisonYear === currentYear;
        if (isCompCurrentYear) {
          const currentMonth = currentDate.getMonth();
          const prevMonth = currentMonth === 0 ? 12 : currentMonth;
          const prevYear = currentMonth === 0 ? comparisonYear - 1 : comparisonYear;
          
          const firstDay = new Date(prevYear, prevMonth - 1, 1);
          const lastDay = new Date(prevYear, prevMonth, 0);
          
          compStartDate = firstDay.toISOString().split('T')[0]!;
          compEndDate = lastDay.toISOString().split('T')[0]!;
        } else {
          compStartDate = `${comparisonYear}-12-01`;
          compEndDate = `${comparisonYear}-12-31`;
        }
      } else { // 1W
        const isCompCurrentYear = comparisonYear === currentYear;
        if (isCompCurrentYear) {
          const dayOfWeek = currentDate.getDay();
          const daysToMonday = dayOfWeek === 0 ? 6 : (dayOfWeek - 1);
          const daysToLastSunday = daysToMonday + 1;
          
          const lastSunday = new Date(currentDate);
          lastSunday.setDate(currentDate.getDate() - daysToLastSunday);
          
          const lastMonday = new Date(lastSunday);
          lastMonday.setDate(lastSunday.getDate() - 6);
          
          compStartDate = lastMonday.toISOString().split('T')[0]!;
          compEndDate = lastSunday.toISOString().split('T')[0]!;
        } else {
          const dec31 = new Date(comparisonYear, 11, 31);
          const dayOfWeek = dec31.getDay();
          const daysToSunday = dayOfWeek === 0 ? 0 : (7 - dayOfWeek);
          
          const lastSunday = new Date(dec31);
          lastSunday.setDate(31 - daysToSunday);
          
          const lastMonday = new Date(lastSunday);
          lastMonday.setDate(lastSunday.getDate() - 6);
          
          compStartDate = lastMonday.toISOString().split('T')[0]!;
          compEndDate = lastSunday.toISOString().split('T')[0]!;
        }
      }

      // Query placements for comparison year
      const compPlacedQ = await pool.query(`
        SELECT COUNT(*)::int AS "placed"
        FROM "Placements"
        WHERE "PlacementDate" >= $1::date AND "PlacementDate" <= $2::date
      `, [compStartDate, compEndDate]);

      const compPlaced = compPlacedQ.rows[0]?.placed ?? 0;
      
      // Calculate percentage change: ((current - previous) / previous) * 100
      yoyChange = compPlaced > 0 
        ? Math.round(((placed - compPlaced) / compPlaced) * 100)
        : (placed > 0 ? 100 : 0);
    }

    const milestones = [0.25, 0.5, 0.75, 1].map((x) => Math.round(goal * x));

    res.json({
      ok: true,
      placed,
      goal,
      placementRate,
      avgTimeDays,
      avgTimeDiff,
      conversion,
      yoyChange,
      periodChange,
      milestones,
      applications,
    });
  } catch (err) {
    console.error("placements performance error:", err);
    res.status(500).json({ ok: false, error: "Failed to fetch placements performance" });
  }
});

// POST /api/placements
router.post("/", async (req, res) => {
  try {
    const {
      ApplicationID,
      StaffID,
      PlacementDate,
      TimeToPlacement,
      Salary,
      PlacementType,
      PlacementStatus,
    } = req.body;

    if (!ApplicationID) {
      return res.status(400).json({
        ok: false,
        error: "ApplicationID is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO "Placements"
      (
        "ApplicationID",
        "StaffID",
        "PlacementDate",
        "TimeToPlacement",
        "Salary",
        "PlacementType",
        "PlacementStatus"
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        ApplicationID,
        StaffID ?? null,
        PlacementDate ?? null,
        TimeToPlacement ?? null,
        Salary ?? null,
        PlacementType ?? null,
        PlacementStatus ?? null,
      ]
    );

    res.status(201).json({ ok: true, placement: result.rows[0] });
  } catch (err) {
    console.error("Error creating placement:", err);
    res.status(500).json({ ok: false, error: "Failed to create placement" });
  }
});

// PUT /api/placements/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid placement ID" });
    }

    const {
      ApplicationID,
      StaffID,
      PlacementDate,
      TimeToPlacement,
      Salary,
      PlacementType,
      PlacementStatus,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE "Placements"
      SET
        "ApplicationID" = $1,
        "StaffID" = $2,
        "PlacementDate" = $3,
        "TimeToPlacement" = $4,
        "Salary" = $5,
        "PlacementType" = $6,
        "PlacementStatus" = $7
      WHERE "PlacementID" = $8
      RETURNING *
      `,
      [
        ApplicationID ?? null,
        StaffID ?? null,
        PlacementDate ?? null,
        TimeToPlacement ?? null,
        Salary ?? null,
        PlacementType ?? null,
        PlacementStatus ?? null,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Placement not found" });
    }

    res.json({ ok: true, placement: result.rows[0] });
  } catch (err) {
    console.error("Error updating placement:", err);
    res.status(500).json({ ok: false, error: "Failed to update placement" });
  }
});

// DELETE /api/placements/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: "Invalid placement ID" });
    }

    const result = await pool.query(
      `
      DELETE FROM "Placements"
      WHERE "PlacementID" = $1
      RETURNING "PlacementID"
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Placement not found" });
    }

    res.json({ ok: true, deletedPlacementID: result.rows[0].PlacementID });
  } catch (err: any) {
    console.error("Error deleting placement:", err);
    res.status(500).json({ ok: false, error: "Failed to delete placement" });
  }
});

export default router;