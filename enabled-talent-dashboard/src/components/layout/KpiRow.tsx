import { kpis, type KPI } from '../../data/sampleData';

export function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {kpis.map((k: KPI) => (
        <div key={k.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-sm text-gray-500">{k.title}</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{k.value}</div>
        </div>
      ))}
    </div>
  );
}