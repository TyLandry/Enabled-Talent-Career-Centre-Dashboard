import { KpiRow } from '../components/layout/KpiRow';
import { useDashboardMetrics } from '../components/layout/useDashboardMetrics';
import { PlacementPerformanceCard } from '../components/layout/PlacementPerformanceCard';
import { MatchedApplicantsCard } from '../components/layout/MatchedApplicantsCard';
import { SkillGapAnalysisCard } from '../components/layout/SkillGapAnalysisCard';
import { StudentDemographicsCard } from '../components/layout/StudentDemographicsCard';
import { AttentionNeededCard } from '../components/layout/AttentionNeededCard';
import { RecentPlacementsCard } from '../components/layout/RecentPlacementsCard';
import { RecentOpportunitiesCard } from '../components/layout/RecentOpportunitiesCard';

export default function DashboardPage() {
  const m = useDashboardMetrics();

  return (
    <div className="space-y-6">
      <KpiRow />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <PlacementPerformanceCard
            placementRate={m.placementRate}
            placed={m.placed}
            goal={m.goal}
            avgTimeDays={m.avgTimeDays}
            conversion={m.conversion}
            yoyChange={m.yoyChange}
          />
          <SkillGapAnalysisCard deficitCount={m.deficitCount} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <MatchedApplicantsCard
            matchedCount={m.matchedCount}
            activeJobs={m.activeJobs}
            avgPerJob={m.avgPerJob}
            matchedPlacedCount={m.matchedPlacedCount}
          />
          <StudentDemographicsCard pctMale={m.pctMale} pctFemale={m.pctFemale} pctOther={m.pctOther} />
          <AttentionNeededCard />
          <RecentPlacementsCard recentPlacements={m.recentPlacements} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RecentOpportunitiesCard />
        </div>
      </div>
    </div>
  );
}