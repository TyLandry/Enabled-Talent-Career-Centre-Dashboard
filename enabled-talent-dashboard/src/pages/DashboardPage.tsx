//Creating the dashboard page here. This will be the main page of the application
import PlacementPerformance from "../components/layout/PlacementPerformance";
import { placementPerformanceData } from "../data/placementData";
import { kpis, matchedApplicants, demographics, attentionNeeded, opportunities } from "../data/sampleData";

export default function DashboardPage() {
    return (
         <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <PlacementPerformance data={placementPerformanceData} />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Applicants</h3>
            <div className="space-y-3">
              {matchedApplicants.map((applicant) => (
                <div key={applicant.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{applicant.name}</p>
                    {applicant.matchedRole && <p className="text-sm text-gray-500">{applicant.matchedRole}</p>}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    applicant.status === 'matched' ? 'bg-green-100 text-green-800' :
                    applicant.status === 'in-review' ? 'bg-blue-100 text-blue-800' :
                    applicant.status === 'needs-action' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {applicant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Demographics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{demographics.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Top Skills</p>
                <div className="flex flex-wrap gap-2">
                  {demographics.topSkills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attention Needed</h3>
            <div className="space-y-3">
              {attentionNeeded.map((item) => (
                <div key={item.id} className="flex items-start py-2">
                  <span className="mr-2 text-orange-500">⚠️</span>
                  <p className="text-sm text-gray-700">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Gap Analysis</h3>
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Opportunities</h3>
          <div className="space-y-3">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{opportunity.title}</p>
                  <p className="text-sm text-gray-500">{opportunity.company}</p>
                </div>
                {opportunity.location && (
                  <span className="text-sm text-gray-600">{opportunity.location}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}