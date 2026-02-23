import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

type Props = {
  placementRate: number;
  placed: number;
  goal: number;
  avgTimeDays: number;
  conversion: number;
  yoyChange: number;
  progressPct: number;
  milestones: number[];
};

export function PlacementPerformanceCard({
  placementRate,
  placed,
  goal,
  avgTimeDays,
  conversion,
  yoyChange,
  progressPct,
  milestones,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div>
        <div className="text-base font-semibold text-gray-900">Placement Performance</div>
        <div className="mt-1 text-sm text-gray-500">Progress and key metrics (from sample data)</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Donut */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-center">
            <div className="relative" style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'placed', value: placementRate },
                      { name: 'remaining', value: Math.max(0, 100 - placementRate) },
                    ]}
                    innerRadius={62}
                    outerRadius={82}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="#f97316" />
                    <Cell fill="#f3f4f6" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold text-gray-900">{placementRate}%</div>
                <div className="mt-1 text-xs text-gray-500">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Placed */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-orange-500" />
              <div className="text-xs text-gray-500">Placed</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-lg font-semibold text-gray-900">{placed}</div>
                <div className="text-xs text-gray-400">/ {goal}</div>
              </div>
              <div className="mt-2 text-xs text-emerald-700">↗ {yoyChange}% vs last month</div>
            </div>

            {/* Avg Time */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-blue-500" />
              <div className="text-xs text-gray-500">Avg. Time</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-lg font-semibold text-gray-900">{avgTimeDays}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>
              <div className="mt-2 text-xs text-gray-500">from KPI data</div>
            </div>

            {/* Conversion */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-emerald-500" />
              <div className="text-xs text-gray-500">Conversion</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{conversion}%</div>
              <div className="mt-2 text-xs text-gray-500">matched → matched status</div>
            </div>

            {/* Change */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-emerald-500" />
              <div className="text-xs text-gray-500">Change</div>
              <div
                className={classNames(
                  'mt-1 text-lg font-semibold',
                  yoyChange >= 0 ? 'text-emerald-700' : 'text-red-600'
                )}
              >
                {yoyChange >= 0 ? `+${yoyChange}%` : `${yoyChange}%`}
              </div>
              <div className="mt-2 text-xs text-gray-500">month-over-month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Goal Progress</div>
          <div className="text-xs text-gray-500">
            {placed} / {goal} placements
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div className="h-2.5 rounded-full bg-orange-500" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            {milestones.map((m) => {
              const done = placed >= m;
              return (
                <div key={m} className="flex flex-col items-center gap-1">
                  <span
                    className={classNames(
                      'inline-flex h-4 w-4 items-center justify-center rounded-full ring-1',
                      done
                        ? 'bg-emerald-500 text-white ring-emerald-500'
                        : 'bg-white text-gray-400 ring-gray-200'
                    )}
                    aria-hidden="true"
                  >
                    <span className="text-[10px] leading-none">✓</span>
                  </span>
                  <span>{m}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}