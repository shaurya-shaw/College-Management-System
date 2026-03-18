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

  return (
    <div className="flex min-h-screen bg-[#f2f2f2] text-black">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white p-6 flex-col rounded-tr-3xl rounded-br-3xl shadow-md">
        <h2 className="text-2xl font-bold mb-8">Student Menu</h2>

        <nav className="flex flex-col gap-4 text-lg">
          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/dashboard"
          >
            <HomeIcon className="inline-block mr-2 opacity-60" size={20} />
            Home
          </NavLink>

          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/myAttendance"
          >
            <ClipboardIcon className="inline-block mr-2 opacity-60" size={20} />
            My Attendance
          </NavLink>

          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/courses"
          >
            <BookOpen className="inline-block mr-2 opacity-60" size={20} />
            My Courses
          </NavLink>
          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/classes"
          >
            <LayoutDashboard
              className="inline-block mr-2 opacity-60"
              size={20}
            />
            My Timetable
          </NavLink>
          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/scan-QR"
          >
            <QrCodeIcon className="inline-block mr-2 opacity-60" size={20} />
            Scan QR
          </NavLink>

          <NavLink
            className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
            to="/student/calendar"
          >
            <Calendar1Icon className="inline-block mr-2 opacity-60" size={20} />
            Calendar
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <aside className="relative w-64 bg-white p-6 shadow-lg">
            <button
              className="absolute top-4 right-4"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-8">Student Menu</h2>

            <nav className="flex flex-col gap-4 text-lg">
              <NavLink to="/student/dashboard">Home</NavLink>
              <NavLink to="/student/myAttendance">My Attendance</NavLink>
              <NavLink to="/student/courses">My Courses</NavLink>
              <NavLink to="/student/classes">My Timetable</NavLink>
              <NavLink to="/student/scan-QR">Scan QR</NavLink>
              <NavLink to="/student/calendar">Calendar</NavLink>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Menu Button */}
        {!open && (
          <button
            className="md:hidden fixed top-5 left-5 z-50 bg-white p-2 rounded-lg shadow"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        )}

        <NavBar />

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
