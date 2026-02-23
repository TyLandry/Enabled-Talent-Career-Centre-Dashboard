// Placement Performance Component

interface PlacementPerformanceData {
  placementRate: number;
  placed: {
    count: number;
    growth: number;
  };
  avgTime: {
    days: number;
    label: string;
  };
  conversion: number;
  jobChange: number;
  annualGoal: {
    current: number;
    target: number;
    quarter: string;
  };
  milestones: {
    value: number;
    achieved: boolean;
  }[];
}

interface PlacementPerformanceProps {
  data: PlacementPerformanceData;
}

export default function PlacementPerformance({ data }: PlacementPerformanceProps) {
  const progressPercentage = (data.annualGoal.current / data.annualGoal.target) * 100;
  const circumference = 2.51; // Circumference ratio for radius 40

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Placement Performance</h2>
          <p className="text-sm text-gray-500">Year to date progress and key metrics</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Circular Progress - Takes 1 column */}
        <div className="flex items-center justify-center">
          <div className="relative w-36 h-36">
            {/* SVG Circular Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ff6b00"
                strokeWidth="8"
                strokeDasharray={`${data.placementRate * circumference} ${100 * circumference}`}
                strokeLinecap="round"
              />
            </svg>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-gray-900">{data.placementRate}%</span>
              <span className="text-xs text-gray-600 text-center">
                Placement
                <br />
                Rate
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Takes 4 columns */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat Card 1 - Placed */}
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="text-sm text-gray-600 mb-1">Placed</div>
            <div className="text-2xl font-bold text-gray-900">{data.placed.count}</div>
            <div className="text-xs text-green-600 flex items-center mt-1">
              <span className="mr-1">↑</span>
              <span>+{data.placed.growth}% from last year</span>
            </div>
          </div>

          {/* Stat Card 2 - Avg. Time */}
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-sm text-gray-600 mb-1">Avg. Time</div>
            <div className="text-2xl font-bold text-gray-900">{data.avgTime.days}</div>
            <div className="text-xs text-gray-500 mt-1">{data.avgTime.label}</div>
          </div>

          {/* Stat Card 3 - Conversion */}
          <div className="border-l-4 border-teal-500 pl-4">
            <div className="text-sm text-gray-600 mb-1">Conversion</div>
            <div className="text-2xl font-bold text-gray-900">{data.conversion}%</div>
          </div>

          {/* Stat Card 4 - Job Change */}
          <div className="border-l-4 border-cyan-500 pl-4">
            <div className="text-sm text-gray-600 mb-1">Job Change</div>
            <div className="text-2xl font-bold text-gray-900">+{data.jobChange}%</div>
          </div>
        </div>
      </div>

      {/* Annual Goal Progress Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Annual Goal Progress</h3>
          <span className="text-xs text-gray-500">
            {data.annualGoal.quarter} / {data.annualGoal.target} students
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Milestone Markers */}
          <div className="relative mt-2 flex justify-between text-xs text-gray-600">
            {/* Render milestone markers */}
            {data.milestones.map((milestone) => {
              const position = (milestone.value / data.annualGoal.target) * 100;
              return (
                <div
                  key={milestone.value}
                  className="flex flex-col items-center absolute"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  <div
                    className={`w-0.5 h-2 -mt-5 mb-1 ${
                      milestone.achieved ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`flex items-center ${
                      milestone.achieved ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {milestone.achieved && (
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {milestone.value}
                  </span>
                </div>
              );
            })}

            {/* Goal marker */}
            <div className="flex flex-col items-end ml-auto">
              <div className="w-0.5 h-2 bg-gray-400 -mt-5 mb-1"></div>
              <span className="text-gray-500">{data.annualGoal.target}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
