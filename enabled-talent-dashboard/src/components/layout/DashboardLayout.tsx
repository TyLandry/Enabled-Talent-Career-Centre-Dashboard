import TopNav from "./TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
