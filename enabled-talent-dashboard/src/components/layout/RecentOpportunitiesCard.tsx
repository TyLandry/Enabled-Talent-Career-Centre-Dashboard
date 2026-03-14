import { Briefcase } from 'lucide-react';

type Opportunity = {
  JobID: number;
  JobTitle: string;
  CompanyID: number;
  Location?: string;
  DatePosted?: string;
};

type Props = {
  opportunities: Opportunity[];
};

export function RecentOpportunitiesCard({ opportunities }: Props) {
  const calculateDaysAgo = (datePosted?: string) => {
    if (!datePosted) return null;
    const posted = new Date(datePosted);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-medium text-gray-900">Recent Opportunities</div>

      <div className="mt-4 space-y-3">
        {opportunities.length === 0 ? (
          <div className="text-sm text-gray-500">No recent opportunities.</div>
        ) : (
          opportunities.map((o) => {
            const daysAgo = calculateDaysAgo(o.DatePosted);
            return (
              <div
                key={o.JobID}
                className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 
                         transition-all duration-300 ease-in-out
                         hover:shadow-md hover:-translate-y-1 hover:border-gray-300 hover:bg-white
                         cursor-pointer"
              >
                <div className="mt-1 p-2 rounded-lg bg-white border border-gray-200 flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{o.JobTitle}</div>
                  <div className="text-sm text-gray-500">
                    Company ID: {o.CompanyID}
                    {o.Location ? ` • ${o.Location}` : ''}
                  </div>
                </div>
                {daysAgo && (
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    Posted {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}