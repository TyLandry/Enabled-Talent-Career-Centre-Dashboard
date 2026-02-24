import { useMemo } from 'react';
import {
  kpis,
  matchedApplicants,
  opportunities,
  demographics,
  placementsOverTime,
  skillGapData,
  type Applicant,
  type KPI,
} from '../../data/sampleData';

function toInt(value: string): number {
  const match = value.replace(/,/g, '').match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getKpiValue(title: KPI['title']): string {
  return kpis.find((k) => k.title === title)?.value ?? '0';
}

export function useDashboardMetrics() {
  return useMemo(() => {
    const totalPlacements = placementsOverTime.reduce((sum, m) => sum + m.placements, 0);
    const goal = demographics.totalStudents;
    const placed = totalPlacements;

    const placementRate = goal > 0 ? Math.round((placed / goal) * 100) : 0;
    const avgTimeDays = toInt(getKpiValue('Avg. Time-to-Placement'));

    const matchedCount = matchedApplicants.length;
    const activeJobs = opportunities.length;

    const matchedPlacedCount = matchedApplicants.filter((a: Applicant) => a.status === 'matched').length;
    const conversion = matchedCount > 0 ? Math.round((matchedPlacedCount / matchedCount) * 100) : 0;

    const last = placementsOverTime.at(-1)?.placements ?? 0;
    const prev = placementsOverTime.at(-2)?.placements ?? 0;
    const yoyChange = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;

    const progressPct = Math.min(100, Math.round((placed / goal) * 100));
    const milestones = [0.25, 0.5, 0.75, 1].map((x) => Math.round(goal * x));

    const deficitCount = skillGapData.filter((s) => s.gap < 0).length;
    const avgPerJob = activeJobs > 0 ? (matchedCount / activeJobs).toFixed(1) : '0.0';

    const genderTotal =
      demographics.byGender.male + demographics.byGender.female + demographics.byGender.other;

    const pctMale = genderTotal > 0 ? Math.round((demographics.byGender.male / genderTotal) * 100) : 0;
    const pctFemale = genderTotal > 0 ? Math.round((demographics.byGender.female / genderTotal) * 100) : 0;
    const pctOther = genderTotal > 0 ? Math.round((demographics.byGender.other / genderTotal) * 100) : 0;

    const recentPlacements = matchedApplicants.filter((a) => a.status === 'matched').slice(0, 2);

    return {
      goal,
      placed,
      placementRate,
      avgTimeDays,
      matchedCount,
      activeJobs,
      matchedPlacedCount,
      conversion,
      yoyChange,
      progressPct,
      milestones,
      deficitCount,
      avgPerJob,
      pctMale,
      pctFemale,
      pctOther,
      recentPlacements,
    };
  }, []);
}