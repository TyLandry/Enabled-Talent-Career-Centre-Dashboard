//Creating DashboardLayout component

//This will be used in the App component to wrap the entire application
//import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      <div className="mx-auto flex max-w-7xl">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
