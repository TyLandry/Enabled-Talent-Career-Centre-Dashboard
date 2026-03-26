import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

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
  topSkills: Array<{ skill: string; students: number }>;
};

type ApiSkillGapResponse = {
  ok: boolean;
  count: number;
  data: Array<{
    SkillID?: number;
    SkillName?: string;
    skill?: string;
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

type ApiMatchedSummary = {
  ok: boolean;
  totalApplications: number;
  matchedApplicants: number;
  acceptedApplicants: number;
};

type ApiRecentJobs = {
  ok: boolean;
  count: number;
  jobs: Array<{
    JobID: number;
    JobTitle: string;
    CompanyID: number;
    Location?: string;
    DatePosted?: string;
  }>;
};

type ApiRecentPlacements = {
  ok: boolean;
  count: number;
  placements: Array<{
    PlacementID: number;
    FirstName?: string;
    LastName?: string;
    JobTitle?: string;
    PlacementDate?: string;
  }>;
};

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
  const [matched, setMatched] = useState<ApiMatchedSummary | null>(null);
  const [recentJobs, setRecentJobs] = useState<ApiRecentJobs | null>(null);
  const [recentPlacements, setRecentPlacements] = useState<ApiRecentPlacements | null>(null);

  useEffect(() => {
    Promise.all([
      safeJson<ApiDashboard>(`${API_URL}/api/dashboard`),
      safeJson<ApiStudentDemographics>(`${API_URL}/api/students/demographics`),
      safeJson<ApiSkillGapResponse>(`${API_URL}/api/skills/gap?limit=10`),
      safeJson<ApiPlacementPerformance>(`${API_URL}/api/placements/performance`),
      safeJson<ApiMatchedSummary>(`${API_URL}/api/applications/matched-summary`),
      safeJson<ApiRecentJobs>(`${API_URL}/api/jobs/recent?limit=3`),
      safeJson<ApiRecentPlacements>(`${API_URL}/api/placements/recent?limit=5`),
    ])
      .then(([d, dem, gap, performance, matchedData, jobs, placements]) => {
        if (d) setDashboard(d);
        if (dem) setDemo(dem);
        if (gap) setSkillGap(gap);
        if (performance) setPerf(performance);
        if (matchedData) setMatched(matchedData);
        if (jobs) setRecentJobs(jobs);
        if (placements) setRecentPlacements(placements);
      })
      .catch((err) => console.error("dashboard metrics fetch error:", err));
  }, []);

  return useMemo(() => {
    // KPI Row
    const activeStudents = dashboard?.activeStudents ?? 0;
    const openOpportunities = dashboard?.openOpportunities ?? 0;
    const placementsThisMonth = dashboard?.placementsThisMonth ?? 0;
    const avgTimeDays = perf?.avgTimeDays ?? 0;

    // Placement Performance
    const goal = perf?.goal ?? 0;
    const placed = perf?.placed ?? 0;
    const placementRate = perf?.placementRate ?? 0;
    const conversion = perf?.conversion ?? 0;
    const yoyChange = perf?.yoyChange ?? 0;
    const milestones = perf?.milestones ?? [];

    // Matched Applicants
    const matchedCount = matched?.matchedApplicants ?? 0;
    const matchedPlacedCount = matched?.acceptedApplicants ?? 0;
    const activeJobs = openOpportunities;
    const avgPerJob = activeJobs > 0 ? (matchedCount / activeJobs).toFixed(1) : "0.0";

    // Skill Gap
    const gapRows = skillGap?.data ?? [];
    const deficitCount = gapRows.filter((s: any) => Number(s.gap) < 0).length;

    // Student Demographics
    const totalStudents = demo?.totalStudents ?? 0;
    const g = demo?.byGender ?? { male: 0, female: 0, other: 0 };
    const genderTotal = g.male + g.female + g.other;

    const pctMale = genderTotal > 0 ? Math.round((g.male / genderTotal) * 100) : 0;
    const pctFemale = genderTotal > 0 ? Math.round((g.female / genderTotal) * 100) : 0;
    const pctOther = genderTotal > 0 ? Math.round((g.other / genderTotal) * 100) : 0;
    const topSkills = (demo?.topSkills ?? []).map(s => s.skill);

    // Recent Data
    const opportunities = recentJobs?.jobs ?? [];
    const recentPlacementsList = (recentPlacements?.placements ?? []).map((p) => ({
      id: String(p.PlacementID),
      name: `${p.FirstName || ''} ${p.LastName || ''}`.trim() || 'Unknown',
      matchedRole: p.JobTitle || 'Unknown Role',
      status: 'matched' as const,
    }));

    return {
      // KPI row
      activeStudents,
      openOpportunities,
      placementsThisMonth,
      avgTimeDays,

      // performance
      goal,
      placed,
      placementRate,
      conversion,
      yoyChange,
      milestones,

      // matched card
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

      // recent data
      opportunities,
      recentPlacements: recentPlacementsList,

      // flags
      apiLoaded: Boolean(dashboard),
      demographicsLoaded: Boolean(demo),
      skillGapLoaded: Boolean(skillGap?.ok),
      perfLoaded: Boolean(perf?.ok),
      matchedLoaded: Boolean(matched?.ok),
      jobsLoaded: Boolean(recentJobs?.ok),
      placementsLoaded: Boolean(recentPlacements?.ok),
    };
  }, [dashboard, demo, skillGap, perf, matched, recentJobs, recentPlacements]);
}
