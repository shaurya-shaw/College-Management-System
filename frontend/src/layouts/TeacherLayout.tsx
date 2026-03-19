import { NavLink, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  BookOpen,
  Calendar1Icon,
  ClipboardIcon,
  HomeIcon,
  GraduationCap,
} from "lucide-react";

const TeacherLayout = () => {
  // Shared styling logic for a "Cool" professional look
  const navLinkStyles = ({ isActive }: { isActive: boolean }) => `
    group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300
    ${
      isActive
        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-0.5"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1"
    }
  `;

  const iconStyles = (isActive: boolean) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"}
  `;

  const teacherLinks = [
    { to: "/teacher/dashboard", label: "Home", icon: HomeIcon },
    { to: "/teacher/myClasses", label: "Mark Attendance", icon: ClipboardIcon },
    { to: "/teacher/subjects", label: "My Subjects", icon: BookOpen },
    { to: "/teacher/calendarDate", label: "Calendar", icon: Calendar1Icon },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Premium Sidebar - Fixed Width as requested */}
      <aside className="hidden md:flex w-72 bg-white/90 backdrop-blur-xl p-8 flex-col rounded-r-[40px] shadow-[20px_0_40px_rgba(0,0,0,0.02)] border-r border-slate-100 z-20">
        {/* Faculty Brand Header */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black tracking-tighter leading-none">
              FACULTY
            </h2>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em]">
              PORTAL
            </span>
          </div>
        </div>

        {/* Navigation - Dynamic & Animated */}
        <nav className="flex flex-col gap-2.5">
          {teacherLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkStyles}>
              {({ isActive }) => (
                <>
                  <item.icon size={22} className={iconStyles(isActive)} />
                  <span className="font-bold text-sm tracking-wide">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Professional Footer Card (replaces your sidebar bottom space) */}
        <div className="mt-auto relative group">
          <div className="absolute inset-0 bg-slate-900 rounded-3xl blur-xl opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="relative bg-white border border-slate-100 p-5 rounded-3xl shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Session Info
            </p>
            <p className="text-sm font-bold text-slate-700">Spring Term 2026</p>
          </div>
        </div>
      </aside>

      {/* Main Content Hub */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Your Existing NavBar Component */}
        <NavBar />

        {/* Viewport Content with smooth Entrance */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
