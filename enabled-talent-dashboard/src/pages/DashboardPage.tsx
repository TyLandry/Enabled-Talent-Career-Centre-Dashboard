//Creating the dashboard page here. This will be the main page of the application

export default function DashboardPage() {
    return (
         <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">KPI 1</div>
        <div className="rounded-xl bg-white p-6 shadow-sm">KPI 2</div>
        <div className="rounded-xl bg-white p-6 shadow-sm">KPI 3</div>
        <div className="rounded-xl bg-white p-6 shadow-sm">KPI 4</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm">
          Placement Performance
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            Matched Applicants
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            Student Demographics
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            Attention Needed
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        Skill Gap Analysis
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        Recent Opportunities
      </div>
    </>
  );
}