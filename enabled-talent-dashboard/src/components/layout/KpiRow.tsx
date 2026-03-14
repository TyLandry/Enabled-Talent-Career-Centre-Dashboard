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

type Props = {
  activeStudents: number;
  placementsThisMonth: number;
  openOpportunities: number;
  avgTimeDays: number;
};

const KPI_DEFINITIONS = [
  { id: 'k1', title: 'Active Students', key: 'activeStudents' as const },
  { id: 'k2', title: 'Placements This Month', key: 'placementsThisMonth' as const },
  { id: 'k3', title: 'Avg. Time-to-Placement', key: 'avgTimeDays' as const },
  { id: 'k4', title: 'Open Opportunities', key: 'openOpportunities' as const },
];

export function KpiRow({
  activeStudents,
  placementsThisMonth,
  openOpportunities,
  avgTimeDays,
}: Props) {
  const formatValue = (key: string, value: number) => {
    switch (key) {
      case 'activeStudents':
        return value.toLocaleString();
      case 'placementsThisMonth':
        return String(value);
      case 'openOpportunities':
        return String(value);
      case 'avgTimeDays':
        return `${value} days`;
      default:
        return String(value);
    }
  };

  const getValue = (key: typeof KPI_DEFINITIONS[number]['key']) => {
    const values = { activeStudents, placementsThisMonth, openOpportunities, avgTimeDays };
    return values[key];
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {KPI_DEFINITIONS.map((kpi) => (
        <div key={kpi.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-sm text-gray-500">{kpi.title}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {formatValue(kpi.key, getValue(kpi.key))}
          </div>
        </div>
      ))}
    </div>
  );
}