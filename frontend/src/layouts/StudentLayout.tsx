import { NavLink, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
  BookOpen,
  Calendar1Icon,
  ClipboardIcon,
  HomeIcon,
  LayoutDashboard,
  Menu,
  QrCodeIcon,
  X,
} from "lucide-react";
import { useState } from "react";

const StudentLayout = () => {
  const [open, setOpen] = useState(false);

  // Helper to keep NavLink logic clean and "Cool"
  const navLinkStyles = ({ isActive }: { isActive: boolean }) => `
    group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
    ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 -translate-y-0.5"
        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
    }
  `;

  const iconStyles = (isActive: boolean) => `
    transition-transform duration-300 group-hover:scale-110
    ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}
  `;

  const navItems = [
    { to: "/student/dashboard", label: "Home", icon: HomeIcon },
    {
      to: "/student/myAttendance",
      label: "My Attendance",
      icon: ClipboardIcon,
    },
    { to: "/student/courses", label: "My Courses", icon: BookOpen },
    { to: "/student/classes", label: "My Timetable", icon: LayoutDashboard },
    { to: "/student/scan-QR", label: "Scan QR", icon: QrCodeIcon },
    { to: "/student/calendar", label: "Calendar", icon: Calendar1Icon },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Desktop Sidebar - Premium Glass Look */}
      <aside className="hidden md:flex w-72 bg-white/80 backdrop-blur-md p-8 flex-col rounded-r-[40px] shadow-[20px_0_40px_rgba(0,0,0,0.02)] border-r border-slate-100 z-20">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase">
            Student Menu
          </h2>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
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
      </aside>

      {/* Mobile Sidebar - Slide-in Animation */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="relative w-72 bg-white h-full p-8 shadow-2xl animate-in slide-in-from-left duration-500">
            <button
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:rotate-90 transition-transform duration-300"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-black mb-12 text-indigo-600">MENU</h2>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={navLinkStyles}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={22} className={iconStyles(isActive)} />
                      <span className="font-bold">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Mobile Toggle - Styled like a floating action button */}
        {!open && (
          <button
            className="md:hidden fixed bottom-8 right-8 z-50 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl shadow-indigo-300 active:scale-90 transition-transform"
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
        )}

        <NavBar />

        {/* Content Wrapper with Fade-in Animation */}
        <div className="p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
