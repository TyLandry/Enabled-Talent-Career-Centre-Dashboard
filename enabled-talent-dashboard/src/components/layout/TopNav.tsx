//Component for the top navigation

//This will be used in the Layout component to display
import { Bell, LogOut, User } from "lucide-react";

export default function TopNav() {
  return (
    <div className="w-full border:none bg-white">
      {/* Top Row */}
      <div className="flex items-center justify-between border-b border-gray-200 px-10 py-3 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.15)]">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-500">
            <User size={16} className="text-orange-500" />
          </div>
          <span className="text-lg text-gray-800">Enabled Talent</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-900 transition-opacity duration-300 ease-in-out hover:opacity-70"
          >
            <User size={16} />
            Profile
          </button>

          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-900 transition-opacity duration-300 ease-in-out hover:opacity-70"
          >
            <LogOut size={16} />
            Log Out
          </button>

          <button type="button" className="hover:text-gray-900 transition-opacity duration-300 ease-in-out hover:opacity-70" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <button
            type="button"
            className="rounded-full border border-orange-600 bg-orange-600 px-6 py-2 font-medium text-white transition-colors duration-300 hover:border-slate-900 hover:text-slate-900 hover:bg-white"
          >
            Post a Job
          </button>
        </div>
      </div>

      {/* Secondary Nav */}
      <nav className="flex justify-between bg-gray-100 px-10">
        <nav className="flex order-first gap-8 px-10 py-2 text-sm text-gray-600">
        <a className="border-b-2 border-orange-600 pb-2 font-medium text-gray-900 hover:text-orange-600 transition-opacity duration-300 ease-in-out hover:opacity-70" href="#">
          Dashboard
        </a>
        <a className="hover:text-orange-600 hover:opacity-70 transition-opacity duration-300 ease-in-out" href="#">
          Candidates
        </a>
        <a className="hover:text-orange-600 hover:opacity-70 transition-opacity duration-300 ease-in-out" href="#">
          Listed Jobs
        </a>
        <a className="hover:text-orange-600 hover:opacity-70 transition-opacity duration-300 ease-in-out" href="#">
          Company Profile
        </a>
        </nav>

        <a>
          <input
            placeholder="Search candidates by name, email..."
            className="order-last ml-2 w-72 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none border-2 border-gray-200 focus:border-orange-400 transition-colors duration-300"
          />
        </a>
      </nav>
    </div>
  );
}
