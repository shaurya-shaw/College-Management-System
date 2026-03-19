import { NavLink, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  BookAIcon,
  Calendar1Icon,
  GitBranchIcon,
  GraduationCapIcon,
  HomeIcon,
  SchoolIcon,
  Users,
  ShieldCheck,
} from "lucide-react";

const AdminLayout = () => {
  // SaaS-style dynamic link logic
  const navLinkStyles = ({ isActive }: { isActive: boolean }) => `
    group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
    ${
      isActive
        ? "bg-violet-600 text-white shadow-lg shadow-violet-200 -translate-y-0.5"
        : "text-slate-500 hover:bg-violet-50 hover:text-violet-600 hover:translate-x-1"
    }
  `;

  const iconStyles = (isActive: boolean) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive ? "text-white" : "text-slate-400 group-hover:text-violet-500"}
  `;

  const adminLinks = [
    { to: "/admin/dashboard", label: "Home", icon: HomeIcon },
    { to: "/admin/students", label: "Students", icon: Users },
    { to: "/admin/teachers", label: "Teachers", icon: GraduationCapIcon },
    { to: "/admin/classSession", label: "Classes", icon: SchoolIcon },
    { to: "/admin/subject", label: "Subjects", icon: BookAIcon },
    { to: "/admin/calendarDate", label: "Calendar", icon: Calendar1Icon },
    { to: "/admin/branch", label: "Branch", icon: GitBranchIcon },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar - Command Center Style */}
      <aside className="hidden md:flex w-64 bg-white/90 backdrop-blur-xl p-6 flex-col rounded-r-4xl shadow-[20px_0_40px_rgba(0,0,0,0.02)] border-r border-slate-100 z-20">
        {/* Admin Branding */}
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-default">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 group-hover:rotate-12 transition-transform duration-500">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter leading-none text-slate-800">
              SYSTEM
            </h2>
            <span className="text-[10px] font-bold text-violet-500 tracking-[0.3em] uppercase">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Hub */}
        <nav className="flex flex-col gap-1.5">
          {adminLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkStyles}>
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={iconStyles(isActive)} />
                  <span className="font-bold text-sm tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Health Card (Bottom Anchor) */}
        <div className="mt-auto bg-slate-50 border border-slate-100 p-4 rounded-2xl relative overflow-hidden group hover:border-violet-200 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Network Live
            </span>
          </div>
          <p className="text-xs font-bold text-slate-600">Database v2.4.0</p>
          <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <GitBranchIcon size={64} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Your Existing NavBar */}
        <NavBar />

        {/* Content Viewport with Entrance Animation */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
