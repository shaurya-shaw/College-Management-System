import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";
import AllBranchList from "../pages/branch/AllBranchList";
import AllSubjectsList from "../pages/subjects/AllSubjectsList";
import TeacherPage from "../pages/teachers/TeacherPage";
import StudentPage from "../pages/students/StudentPage";
import ClassSessionPage from "../pages/classSessions/ClassSessionPage";

import CalendarPage from "../pages/calendarDate/CalendarPage";
import TeacherDashboard from "../pages/Dashboard/TeacherDashboard";
import MyClasses from "../pages/teacherContent/MyClasses";
import MySubjects from "../pages/teacherContent/MySubjects";
import MyCalendar from "../pages/teacherContent/MyCalendar";
import MarkAttendance from "../pages/teacherContent/MarkAttendance";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "branch", element: <AllBranchList /> },
      { path: "subject", element: <AllSubjectsList /> },
      { path: "teachers", element: <TeacherPage /> },
      { path: "students", element: <StudentPage /> },
      { path: "classSession", element: <ClassSessionPage /> },
      { path: "calendarDate", element: <CalendarPage /> },
    ],
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={["TEACHER"]}>
        <TeacherLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <TeacherDashboard /> },
      { path: "myClasses", element: <MyClasses /> },
      { path: "subjects", element: <MySubjects /> },
      { path: "calendarDate", element: <MyCalendar /> },
      { path: "attendance/:classId", element: <MarkAttendance /> },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
  },
]);
