import { opportunities, type Opportunity } from '../../data/sampleData';
import { Briefcase } from 'lucide-react';

export function RecentOpportunitiesCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Recent Opportunities</div>

      <div className="mt-4 space-y-3">
        {opportunities.map((o: Opportunity) => (
          <div 
            key={o.id} 
            className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 
                       transition-all duration-300 ease-in-out
                       hover:shadow-md hover:-translate-y-1 hover:border-gray-300 hover:bg-white
                       cursor-pointer"
          >
            <div className="mt-1 p-2 rounded-lg bg-white border border-gray-200 flex-shrink-0">
              <Briefcase className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{o.title}</div>
              <div className="text-sm text-gray-500">
                {o.company}
                {o.location ? ` • ${o.location}` : ''}
              </div>
            </div>
            {o.postedDaysAgo && (
              <div className="text-xs text-gray-400 whitespace-nowrap">
                Posted {o.postedDaysAgo} days ago
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}