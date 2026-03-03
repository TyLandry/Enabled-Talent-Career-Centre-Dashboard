// import { kpis, type KPI } from '../../data/sampleData';

// export function KpiRow() {
//   return (
//     <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
//       {kpis.map((k: KPI) => (
//         <div key={k.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
//           <div className="text-sm text-gray-500">{k.title}</div>
//           <div className="mt-2 text-2xl font-semibold text-gray-900">{k.value}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { kpis, type KPI } from "../../data/sampleData";

type Props = {
  activeStudents: number;
  placementsThisMonth: number;
  openOpportunities: number;
  avgTimeDays: number;
};

export function KpiRow({
  activeStudents,
  placementsThisMonth,
  openOpportunities,
  avgTimeDays,
}: Props) {
  const overrideValue = (title: KPI["title"], original: string) => {
    switch (title) {
      case "Active Students":
        return activeStudents.toLocaleString();
      case "Placements This Month":
        return String(placementsThisMonth);
      case "Open Opportunities":
        return String(openOpportunities);
      case "Avg. Time-to-Placement":
        return `${avgTimeDays} days`;
      default:
        return original;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {kpis.map((k: KPI) => (
        <div key={k.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-sm text-gray-500">{k.title}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {overrideValue(k.title, k.value)}
          </div>
        </div>
      ))}
    </div>
  );
}