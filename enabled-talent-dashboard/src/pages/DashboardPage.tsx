import { kpis, matchedApplicants, opportunities } from '../data/sampleData';

export default function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">{k.title}</div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">Placement Performance</div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="text-lg font-medium">Matched Applicants</div>
            <ul className="mt-3 space-y-2">
              {matchedApplicants.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-sm text-gray-500">{a.matchedRole ?? '—'}</div>
                  </div>
                  <div className="text-sm text-gray-600">{a.status}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">Student Demographics</div>

          <div className="rounded-xl bg-white p-6 shadow-sm">Attention Needed</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">Skill Gap Analysis</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          <div className="text-lg font-medium">Recent Opportunities</div>
          <ul className="mt-3 space-y-2">
            {opportunities.map((o) => (
              <li key={o.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{o.title}</div>
                  <div className="text-sm text-gray-500">{o.company} • {o.location}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}