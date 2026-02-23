import type { Applicant } from '../../data/sampleData';

export function RecentPlacementsCard({ recentPlacements }: { recentPlacements: Applicant[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Recent Placements</div>

      <div className="mt-3 space-y-3">
        {recentPlacements.length === 0 ? (
          <div className="text-sm text-gray-500">No placements yet.</div>
        ) : (
          recentPlacements.map((a) => (
            <div key={a.id} className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200">
              <div className="text-sm font-medium text-gray-900">{a.name}</div>
              <div className="text-xs text-gray-500">{a.matchedRole ?? 'Placed'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}