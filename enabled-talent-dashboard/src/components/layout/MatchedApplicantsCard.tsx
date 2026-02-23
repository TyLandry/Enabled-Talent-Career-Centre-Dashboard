type Props = {
  matchedCount: number;
  activeJobs: number;
  avgPerJob: string;
  matchedPlacedCount: number;
};

export function MatchedApplicantsCard({
  matchedCount,
  activeJobs,
  avgPerJob,
  matchedPlacedCount,
}: Props) {
  return (
    <div className="rounded-2xl bg-[#fff7e6] p-6 shadow-sm ring-1 ring-black/5 lg:self-start">
      <div className="text-center">
        <div className="text-[11px] font-semibold tracking-wide text-gray-500">MATCHED APPLICANTS</div>
        <div className="mt-3 text-4xl font-semibold text-gray-900">{matchedCount}</div>
        <div className="mt-2 text-sm text-gray-600">
          Across {activeJobs} opportunities (avg. {avgPerJob} / job)
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/70 p-4 ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Active Jobs</div>
          <div className="mt-2 text-xl font-semibold text-gray-900">{activeJobs}</div>
        </div>

        <div className="rounded-xl bg-white/70 p-4 ring-1 ring-black/5">
          <div className="text-xs text-gray-500">Candidates accepted</div>
          <div className="mt-2 text-xl font-semibold text-gray-900">{matchedPlacedCount}</div>
        </div>
      </div>
    </div>
  );
}