// //Creating Sidebar component

// //This will be used in the Layout component to display the navigation
// import { LayoutDashboard, Users, Briefcase, Building2 } from "lucide-react";

// const nav = [
//   { label: "Dashboard", icon: LayoutDashboard, active: true },
//   { label: "Candidates", icon: Users },
//   { label: "Listed Jobs", icon: Briefcase },
//   { label: "Company Profile", icon: Building2 },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="hidden w-64 flex-col border-r bg-white p-6 md:flex">
//       <div className="text-sm font-semibold text-gray-900">Menu</div>

//       <nav className="mt-6 space-y-1">
//         {nav.map(({ label, icon: Icon, active }) => (
//           <a
//             key={label}
//             href="#"
//             className={[
//               "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
//               active
//                 ? "bg-orange-50 text-orange-700"
//                 : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
//             ].join(" ")}
//           >
//             <Icon size={18} />
//             {label}
//           </a>
//         ))}
//       </nav>
//     </aside>
//   );
// }
