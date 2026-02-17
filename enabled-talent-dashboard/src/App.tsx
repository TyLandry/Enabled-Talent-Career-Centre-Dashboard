import Layout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">KPI 1</div>
        <div className="rounded-xl bg-white p-5 shadow-sm">KPI 2</div>
        <div className="rounded-xl bg-white p-5 shadow-sm">KPI 3</div>
        <div className="rounded-xl bg-white p-5 shadow-sm">KPI 4</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm">
          Chart area
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">Breakdown</div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">Table</div>
    </Layout>
  );
}
