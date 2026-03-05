// import { useEffect, useMemo, useState } from "react";
// import {
//   kpis,
//   matchedApplicants,
//   opportunities,
//   demographics,
//   placementsOverTime,
//   skillGapData,
//   type Applicant,
//   type KPI,
// } from "../../data/sampleData";

// type ApiDashboard = {
//   activeStudents: number;
//   openOpportunities: number;
//   placementsThisMonth: number;
// };

// function toInt(value: string): number {
//   const match = value.replace(/,/g, "").match(/\d+/);
//   return match ? Number(match[0]) : 0;
// }

// function getKpiValue(title: KPI["title"]): string {
//   return kpis.find((k) => k.title === title)?.value ?? "0";
// }

// export function useDashboardMetrics() {
//   const [api, setApi] = useState<ApiDashboard | null>(null);

//   useEffect(() => {
//     fetch("http://localhost:5050/api/dashboard")
//       .then((r) => r.json())
//       .then((data) => setApi(data))
//       .catch((err) => console.error("dashboard api error:", err));
//   }, []);

//   return useMemo(() => {
//     const totalPlacements = placementsOverTime.reduce((sum, m) => sum + m.placements, 0);

//     const goal = api?.activeStudents ?? demographics.totalStudents;

//     const placed = totalPlacements;
//     const placementRate = goal > 0 ? Math.round((placed / goal) * 100) : 0;
//     const avgTimeDays = toInt(getKpiValue("Avg. Time-to-Placement"));

//     const matchedCount = matchedApplicants.length;
//     const activeJobs = opportunities.length;

//     const matchedPlacedCount = matchedApplicants.filter((a: Applicant) => a.status === "matched").length;
//     const conversion = matchedCount > 0 ? Math.round((matchedPlacedCount / matchedCount) * 100) : 0;

//     const last = placementsOverTime.at(-1)?.placements ?? 0;
//     const prev = placementsOverTime.at(-2)?.placements ?? 0;
//     const yoyChange = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;

//     const milestones = [0.25, 0.5, 0.75, 1].map((x) => Math.round(goal * x));

//     const deficitCount = skillGapData.filter((s) => s.gap < 0).length;
//     const avgPerJob = activeJobs > 0 ? (matchedCount / activeJobs).toFixed(1) : "0.0";

//     const genderTotal =
//       demographics.byGender.male + demographics.byGender.female + demographics.byGender.other;

//     const pctMale = genderTotal > 0 ? Math.round((demographics.byGender.male / genderTotal) * 100) : 0;
//     const pctFemale = genderTotal > 0 ? Math.round((demographics.byGender.female / genderTotal) * 100) : 0;
//     const pctOther = genderTotal > 0 ? Math.round((demographics.byGender.other / genderTotal) * 100) : 0;

//     const recentPlacements = matchedApplicants.filter((a) => a.status === "matched").slice(0, 2);

//     return {

//         activeStudents: api?.activeStudents ?? demographics.totalStudents,
//         openOpportunities: api?.openOpportunities ?? opportunities.length,
//         placementsThisMonth: api?.placementsThisMonth ?? toInt(getKpiValue("Placements This Month")),
//       goal,
//       placed,
//       placementRate,
//       avgTimeDays,
//       matchedCount,
//       activeJobs,
//       matchedPlacedCount,
//       conversion,
//       yoyChange,
//       milestones,
//       deficitCount,
//       avgPerJob,
//       pctMale,
//       pctFemale,
//       pctOther,
//       recentPlacements,
//       apiLoaded: Boolean(api),
//     };
//   }, [api]);
// }

import { useEffect, useMemo, useState } from "react";
import {
  kpis,
  matchedApplicants,
  opportunities,
  demographics as sampleDemographics,
  placementsOverTime,
  skillGapData as sampleSkillGapData,
  type Applicant,
  type KPI,
} from "../../data/sampleData";

type ApiDashboard = {
  activeStudents: number;
  openOpportunities: number;
  placementsThisMonth: number;
};

type ApiStudentDemographics = {
  ok: boolean;
  totalStudents: number;
  byGender: {
    male: number;
    female: number;
    other: number;
  };
  topSkills: string[];
};

type ApiSkillGapResponse = {
  ok: boolean;
  count: number;
  data: Array<{
    SkillID: number;
    SkillName: string;
    students: number;
    jobs: number;
    gap: number;
  }>;
};

type ApiPlacementPerformance = {
  ok: boolean;
  placed: number;
  goal: number;
  placementRate: number;
  avgTimeDays: number;
  conversion: number;
  yoyChange: number;
  milestones: number[];
};

function toInt(value: string): number {
  const match = value.replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getKpiValue(title: KPI["title"]): string {
  return kpis.find((k) => k.title === title)?.value ?? "0";
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export function useDashboardMetrics() {
  const [dashboard, setDashboard] = useState<ApiDashboard | null>(null);
  const [demo, setDemo] = useState<ApiStudentDemographics | null>(null);
  const [skillGap, setSkillGap] = useState<ApiSkillGapResponse | null>(null);
  const [perf, setPerf] = useState<ApiPlacementPerformance | null>(null);

  useEffect(() => {
    // Fetch what already exists (and won't break if an endpoint is missing)
    Promise.all([
      safeJson<ApiDashboard>("http://localhost:5050/api/dashboard"),
      safeJson<ApiStudentDemographics>("http://localhost:5050/api/students/demographics"),
      safeJson<ApiSkillGapResponse>("http://localhost:5050/api/skills/gap?limit=10"),
      safeJson<ApiPlacementPerformance>("http://localhost:5050/api/placements/performance"),

      // Later:
      // safeJson("http://localhost:5050/api/jobs/recent?limit=5"),
      // safeJson("http://localhost:5050/api/placements/recent?limit=5"),
      // safeJson("http://localhost:5050/api/applications/matched?limit=5"),
    ])
      .then(([d, dem, gap]) => {
        if (d) setDashboard(d);
        if (dem) setDemo(dem);
        if (gap) setSkillGap(gap);
        if (perf) setPerf(perf);
      })
      .catch((err) => console.error("dashboard metrics fetch error:", err));
  }, []);

  return useMemo(() => {
  // ----------------------------
  // KPI Row (API first)
  // ----------------------------
  const activeStudents = dashboard?.activeStudents ?? sampleDemographics.totalStudents;
  const openOpportunities = dashboard?.openOpportunities ?? opportunities.length;

  // Placements This Month já está no /api/dashboard
  const placementsThisMonth = dashboard?.placementsThisMonth ?? 0;

  // ----------------------------
  // Placement Performance (API first)
  // ----------------------------
  const totalPlacementsSample = placementsOverTime.reduce((sum, m) => sum + m.placements, 0);

  const goal = perf?.goal ?? activeStudents;
  const placed = perf?.placed ?? totalPlacementsSample;

  const placementRate =
    perf?.placementRate ?? (goal > 0 ? Math.round((placed / goal) * 100) : 0);

  const avgTimeDays =
    perf?.avgTimeDays ?? toInt(getKpiValue("Avg. Time-to-Placement"));

  // ✅ A conversão agora vem do endpoint /api/placements/performance
  // (placements / applications)
  const conversion = perf?.conversion ?? 0;

  const yoyChange = perf?.yoyChange ?? 0;

  const milestones =
    perf?.milestones ?? [0.25, 0.5, 0.75, 1].map((x) => Math.round(goal * x));

  // ----------------------------
  // Matched Applicants (ainda sample)
  // ----------------------------
  const matchedCount = matchedApplicants.length;
  const matchedPlacedCount = matchedApplicants.filter(
    (a: Applicant) => a.status === "matched"
  ).length;

  // ----------------------------
  // Skill Gap (API first)
  // ----------------------------
  // gapRows pode vir da API ou fallback sample
  const gapRows = skillGap?.ok ? skillGap.data : sampleSkillGapData;

  // ✅ Deficit = demanda > oferta => jobs - students > 0
  const deficitCount = gapRows.filter((s: any) => Number(s.gap) > 0).length;

  // ----------------------------
  // Cards laterais
  // ----------------------------
  const activeJobs = openOpportunities;
  const avgPerJob = activeJobs > 0 ? (matchedCount / activeJobs).toFixed(1) : "0.0";

  // ----------------------------
  // Student Demographics (API first)
  // ----------------------------
  const totalStudents = demo?.totalStudents ?? sampleDemographics.totalStudents;
  const g = demo?.byGender ?? sampleDemographics.byGender;

  const genderTotal = (g.male ?? 0) + (g.female ?? 0) + (g.other ?? 0);

  const pctMale = genderTotal > 0 ? Math.round(((g.male ?? 0) / genderTotal) * 100) : 0;
  const pctFemale = genderTotal > 0 ? Math.round(((g.female ?? 0) / genderTotal) * 100) : 0;
  const pctOther = genderTotal > 0 ? Math.round(((g.other ?? 0) / genderTotal) * 100) : 0;

  const topSkills = demo?.topSkills ?? [];

  // ----------------------------
  // Recent placements (ainda sample)
  // ----------------------------
  const recentPlacements = matchedApplicants
    .filter((a) => a.status === "matched")
    .slice(0, 2);

  return {
    // KPI row
    activeStudents,
    openOpportunities,
    placementsThisMonth,

    // performance
    goal,
    placed,
    placementRate,
    avgTimeDays,
    conversion,
    yoyChange,
    milestones,

    // matched card (still sample)
    matchedCount,
    matchedPlacedCount,
    activeJobs,
    avgPerJob,

    // skill gap
    deficitCount,

    // demographics
    totalStudents,
    pctMale,
    pctFemale,
    pctOther,
    topSkills,

    // other
    recentPlacements,

    // flags
    apiLoaded: Boolean(dashboard),
    demographicsLoaded: Boolean(demo),
    skillGapLoaded: Boolean(skillGap?.ok),
    perfLoaded: Boolean(perf?.ok),
  };
}, [dashboard, demo, skillGap, perf]);
}