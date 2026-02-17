//Component for the top navigation


//This will be used in the Layout component to display
import { Bell, LogOut, User } from "lucide-react";

export default function TopNav() {
  return (
    <div className="w-full border-b bg-white">
      {/* Top Row */}
      <div className="flex items-center justify-between px-10 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-orange-500">
            <User size={16} className="text-orange-500" />
          </div>
          <span className="text-lg font-semibold text-gray-800">Enabled Talent</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-900"
          >
            <User size={16} />
            Profile
          </button>

          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-900"
          >
            <LogOut size={16} />
            Log Out
          </button>

          <button type="button" className="hover:text-gray-900" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <input    
            placeholder="Search candidates by name, email..."
            className="ml-4 w-72 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="button"
            className="rounded-full bg-orange-500 px-6 py-2 font-medium text-white transition hover:bg-orange-600"
          >
            Post a Job
          </button>
        </div>
      </div>

      {/* Secondary Nav */}
      <nav className="flex gap-8 px-10 py-2 text-sm text-gray-600">
        <a className="border-b-2 border-orange-500 pb-2 font-medium text-gray-900" href="#">
          Dashboard
        </a>
        <a className="hover:text-gray-900" href="#">
          Candidates
        </a>
        <a className="hover:text-gray-900" href="#">
          Listed Jobs
        </a>
        <a className="hover:text-gray-900" href="#">
          Company Profile
        </a>
      </nav>
    </div>
  );
}
