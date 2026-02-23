import { opportunities, type Opportunity } from '../../data/sampleData';

export function RecentOpportunitiesCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Recent Opportunities</div>

      <ul className="mt-3 space-y-2">
        {opportunities.map((o: Opportunity) => (
          <li key={o.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{o.title}</div>
              <div className="text-sm text-gray-500">
                {o.company}
                {o.location ? ` • ${o.location}` : ''}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}