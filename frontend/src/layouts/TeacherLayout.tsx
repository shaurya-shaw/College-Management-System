import { NavLink, Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { BookOpen, Calendar1Icon, ClipboardIcon, HomeIcon } from "lucide-react";

const TeacherLayout = () => {
  return (
    <>
      <div className="flex min-h-screen overflow-hidden  bg-[#f2f2f2] text-black">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 text-xl text-white rounded-tr-3xl rounded-br-3xl border-black border-0">
          <h2 className="text-3xl font-bold mb-6 text-black">Admin Menu</h2>
          <nav className="flex flex-col gap-4 text-black">
            <NavLink
              className="border-gray-500  hover:bg-green-100 hover:rounded-2xl p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
              to="/teacher/dashboard"
            >
              <HomeIcon className="inline-block mr-2 opacity-60" />
              Home
            </NavLink>
            <NavLink
              className="border-gray-500 hover:bg-green-100 hover:rounded-2xl  p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
              to="/teacher/myClasses"
            >
              <ClipboardIcon className="inline-block mr-2 opacity-60" />
              Mark Attendance
            </NavLink>
            <NavLink
              className="border-gray-500 hover:bg-green-100 hover:rounded-2xl  p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
              to="/teacher/subjects"
            >
              <BookOpen className="inline-block mr-2 opacity-60" />
              My Subjects
            </NavLink>
            <NavLink
              className="border-gray-500 hover:bg-green-100 hover:rounded-2xl  p-2 rounded-3xl border-0 border-b-2 transition-colors duration-300"
              to="/teacher/calendarDate"
            >
              <Calendar1Icon className="inline-block mr-2 opacity-60" />
              Calendar
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1  bg-[#f2f2f2] ">
          <NavBar />
          <Outlet /> {/* renders child pages like Dashboard, Students, etc. */}
        </main>
      </div>
    </>
  );
};

export default TeacherLayout;
