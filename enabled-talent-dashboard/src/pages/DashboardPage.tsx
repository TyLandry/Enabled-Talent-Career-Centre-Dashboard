import DashboardLayout from '../components/layout/DashboardLayout';
import { KpiRow } from '../components/layout/KpiRow';
import { PlacementPerformanceCard } from '../components/layout/PlacementPerformanceCard';
import { MatchedApplicantsCard } from '../components/layout/MatchedApplicantsCard';
import { SkillGapAnalysisCard } from '../components/layout/SkillGapAnalysisCard';
import { StudentDemographicsCard } from '../components/layout/StudentDemographicsCard';
import { RecentOpportunitiesCard } from '../components/layout/RecentOpportunitiesCard';
import { RecentPlacementsCard } from '../components/layout/RecentPlacementsCard';
import { AttentionNeededCard } from '../components/layout/AttentionNeededCard';
import { useDashboardMetrics } from '../components/layout/useDashboardMetrics';

export default function DashboardPage() {
  const metrics = useDashboardMetrics();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <KpiRow
          activeStudents={metrics.activeStudents}
          placementsThisMonth={metrics.placementsThisMonth}
          openOpportunities={metrics.openOpportunities}
          avgTimeDays={metrics.avgTimeDays}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PlacementPerformanceCard
              placementRate={metrics.placementRate}
              placed={metrics.placed}
              goal={metrics.goal}
              avgTimeDays={metrics.avgTimeDays}
              conversion={metrics.conversion}
              yoyChange={metrics.yoyChange}
            />
            <SkillGapAnalysisCard deficitCount={metrics.deficitCount} />
            <RecentOpportunitiesCard opportunities={metrics.opportunities} />
          </div>

          <div className="space-y-6">
            <MatchedApplicantsCard
              matchedCount={metrics.matchedCount}
              activeJobs={metrics.activeJobs}
              avgPerJob={metrics.avgPerJob}
              matchedPlacedCount={metrics.matchedPlacedCount}
            />
            <StudentDemographicsCard
              totalStudents={metrics.totalStudents}
              pctMale={metrics.pctMale}
              pctFemale={metrics.pctFemale}
              pctOther={metrics.pctOther}
              topSkills={metrics.topSkills}
            />
            <AttentionNeededCard />
            <RecentPlacementsCard recentPlacements={metrics.recentPlacements} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}