import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
};

// Mock data generator for different years and time ranges
const generateMockData = (year: number, timeRange: string) => {
  const baseYear = 2025;
  const yearDiff = year - baseYear;
  
  const timeMultipliers: Record<string, number> = {
    '1W': 0.02,  // Weekly data
    '1M': 0.08,  // Monthly data
    '3M': 0.25,  // Quarterly data
    '1Y': 1.0,   // Yearly data
  };
  
  const multiplier = timeMultipliers[timeRange] || 1.0;
  
  return {
    placementRate: Math.min(100, 82 + yearDiff * 3 + (Math.random() * 5 - 2.5)),
    placed: Math.round((342 + yearDiff * 45) * multiplier),
    goal: Math.round((400 + yearDiff * 50) * multiplier),
    avgTimeDays: Math.max(15, 32 - yearDiff * 2 + Math.floor(Math.random() * 5)),
    conversion: Math.min(100, 49 + yearDiff * 4 + (Math.random() * 3 - 1.5)),
    yoyChange: 5 + yearDiff * 2 + (Math.random() * 4 - 2),
  };
};

export function PlacementPerformanceCard({
  placementRate: _placementRate,
  placed: _placed,
  goal: _goal,
  avgTimeDays: _avgTimeDays,
  conversion: _conversion,
  yoyChange: _yoyChange,
}: Props) {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [showComparison, setShowComparison] = useState(true);
  const [comparisonYear, setComparisonYear] = useState(2024);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '1Y'>('1M');

  const years = [2026, 2025, 2024, 2023];
  const timeRanges: Array<'1W' | '1M' | '3M' | '1Y'> = ['1W', '1M', '3M', '1Y'];
  
  // Available years for comparison (exclude selected year)
  const comparisonYears = years.filter(y => y !== selectedYear);

  // Auto-adjust comparison year if it conflicts with selected year
  useEffect(() => {
    if (selectedYear === comparisonYear) {
      // Pick the first available comparison year
      const newComparisonYear = comparisonYears[0] || selectedYear - 1;
      setComparisonYear(newComparisonYear);
    }
  }, [selectedYear, comparisonYear, comparisonYears]);

  // Generate data based on selected filters
  const displayData = useMemo(() => {
    const data = generateMockData(selectedYear, timeRange);
    return {
      placementRate: Math.round(data.placementRate * 10) / 10,
      placed: data.placed,
      goal: data.goal,
      avgTimeDays: data.avgTimeDays,
      conversion: Math.round(data.conversion * 10) / 10,
      yoyChange: Math.round(data.yoyChange * 10) / 10,
    };
  }, [selectedYear, timeRange]);

  // Generate comparison data for previous year
  const comparisonData = useMemo(() => {
    const data = generateMockData(comparisonYear, timeRange);
    return {
      placementRate: Math.round(data.placementRate * 10) / 10,
      placed: data.placed,
      goal: data.goal,
      avgTimeDays: data.avgTimeDays,
      conversion: Math.round(data.conversion * 10) / 10,
      yoyChange: Math.round(data.yoyChange * 10) / 10,
    };
  }, [comparisonYear, timeRange]);

  // Calculate differences for comparison
  const differences = useMemo(() => {
    return {
      placementRate: Math.round((displayData.placementRate - comparisonData.placementRate) * 10) / 10,
      placed: displayData.placed - comparisonData.placed,
      avgTimeDays: displayData.avgTimeDays - comparisonData.avgTimeDays,
      conversion: Math.round((displayData.conversion - comparisonData.conversion) * 10) / 10,
    };
  }, [displayData, comparisonData]);

  // Calculate progress percentage based on current data
  const currentProgressPct = Math.min(100, (displayData.placed / displayData.goal) * 100);

  // Calculate dynamic milestones based on current goal
  const dynamicMilestones = useMemo(() => {
    return [0.25, 0.5, 0.75, 1].map((x) => Math.round(displayData.goal * x));
  }, [displayData.goal]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-900">Placement Performance</div>
          <div className="mt-1 text-sm text-gray-500">Progress and key metrics (from sample data)</div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Comparison Toggle */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={classNames(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              showComparison
                ? 'border-orange-300 bg-orange-50 text-orange-700'
                : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            vs
          </button>

          {/* Comparison Year Dropdown (shown when comparison is active) */}
          {showComparison && (
            <div className="relative">
              <select
                value={comparisonYear}
                onChange={(e) => setComparisonYear(Number(e.target.value))}
                className="appearance-none rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 pr-8 text-sm font-medium text-orange-700 hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
              >
                {comparisonYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-700" />
            </div>
          )}

          {/* Time Range Buttons */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={classNames(
                  'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
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
                      { name: 'placed', value: displayData.placementRate },
                      { name: 'remaining', value: Math.max(0, 100 - displayData.placementRate) },
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
                <div className="text-3xl font-semibold text-gray-900">{displayData.placementRate}%</div>
                <div className="mt-1 text-xs text-gray-500">Placement Rate</div>
                {showComparison && (
                  <div className={classNames(
                    'mt-1 text-xs font-medium',
                    differences.placementRate >= 0 ? 'text-emerald-700' : 'text-red-600'
                  )}>
                    {differences.placementRate >= 0 ? '+' : ''}{differences.placementRate}% vs {comparisonYear}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Placed */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-orange-600" />
              <div className="text-xs text-gray-500">Placed</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-lg font-semibold text-gray-900">{displayData.placed}</div>
                <div className="text-xs text-gray-400">/ {displayData.goal}</div>
              </div>
              {showComparison ? (
                <div className={classNames(
                  'mt-2 text-xs font-medium',
                  differences.placed >= 0 ? 'text-emerald-700' : 'text-red-600'
                )}>
                  {differences.placed >= 0 ? '+' : ''}{differences.placed} vs {comparisonYear}
                </div>
              ) : (
                <div className="mt-2 text-xs text-emerald-700">↗ {displayData.yoyChange}% vs last month</div>
              )}
            </div>

            {/* Avg Time */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-blue-500" />
              <div className="text-xs text-gray-500">Avg. Time</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-lg font-semibold text-gray-900">{displayData.avgTimeDays}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>
              {showComparison ? (
                <div className={classNames(
                  'mt-2 text-xs font-medium',
                  differences.avgTimeDays <= 0 ? 'text-emerald-700' : 'text-red-600'
                )}>
                  {differences.avgTimeDays > 0 ? '+' : ''}{differences.avgTimeDays} vs {comparisonYear}
                </div>
              ) : (
                <div className="mt-2 text-xs text-gray-500">from KPI data</div>
              )}
            </div>

            {/* Conversion */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-emerald-500" />
              <div className="text-xs text-gray-500">Conversion</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{displayData.conversion}%</div>
              {showComparison ? (
                <div className={classNames(
                  'mt-2 text-xs font-medium',
                  differences.conversion >= 0 ? 'text-emerald-700' : 'text-red-600'
                )}>
                  {differences.conversion >= 0 ? '+' : ''}{differences.conversion}% vs {comparisonYear}
                </div>
              ) : (
                <div className="mt-2 text-xs text-gray-500">matched → matched status</div>
              )}
            </div>

            {/* Change */}
            <div className="relative pl-4">
              <span className="absolute left-0 top-0 h-full w-0.5 rounded bg-emerald-500" />
              <div className="text-xs text-gray-500">Change</div>
              <div
                className={classNames(
                  'mt-1 text-lg font-semibold',
                  displayData.yoyChange >= 0 ? 'text-emerald-700' : 'text-red-600'
                )}
              >
                {displayData.yoyChange >= 0 ? `+${displayData.yoyChange}%` : `${displayData.yoyChange}%`}
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
            {displayData.placed} / {displayData.goal} placements
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2.5 w-full rounded-full bg-gray-100">
            <div className="h-2.5 rounded-full bg-orange-600" style={{ width: `${currentProgressPct}%` }} />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            {dynamicMilestones.map((m) => {
              const done = displayData.placed >= m;
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