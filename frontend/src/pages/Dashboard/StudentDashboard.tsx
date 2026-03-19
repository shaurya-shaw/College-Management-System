import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  QrCode,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useClassSessionStore } from "../../store/classSessionStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboardStore";

export default function StudentDashboard() {
  const { studentStats, fetchStudentStats } = useDashboardStore();
  const { classSession, fetchStudentDashboard } = useClassSessionStore();

  useEffect(() => {
    fetchStudentDashboard(today);
    fetchStudentStats();
  }, []);

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  // const today = "FRIDAY"; //!testing purposes, change to above line for dynamic date

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate overall attendance from summary
  const totalClassesAttended =
    studentStats?.reduce((sum, item) => sum + item.present, 0) ?? 0;
  const totalClassesHeld =
    studentStats?.reduce((sum, item) => sum + item.totalClasses, 0) ?? 0;

  const overallPercentage =
    totalClassesHeld === 0
      ? "0.0"
      : ((totalClassesAttended / totalClassesHeld) * 100).toFixed(1);

  // Custom Tooltip for the Bar Chart
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 md:p-4 border border-slate-100 shadow-xl rounded-xl w-48 md:w-auto">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2 text-sm md:text-base">
            {data.fullName || data.subject}
          </p>
          <div className="space-y-1 text-xs md:text-sm">
            <p className="flex justify-between gap-4 text-slate-500">
              Classes Attended:{" "}
              <span className="font-semibold text-slate-700">
                {data.present} / {data.totalClasses}
              </span>
            </p>
            <p className="flex justify-between gap-4 font-bold text-indigo-600">
              Percentage: <span>{data.percentage.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900 overflow-x-hidden">
      {/* 🔹 TOP HEADER */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back! 👋
          </h1>
          <div className="flex items-center gap-3 text-slate-500 mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={16} className="text-indigo-500" />
              <span className="text-sm md:text-base">{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 QUICK ACTION BANNER (Scan QR) */}
      <div className="mb-6 md:mb-8 relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg group cursor-pointer hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10 text-center md:text-left">
          <div className="text-white flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shrink-0">
              <QrCode size={28} className="text-white md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-wide">
                Mark Your Attendance
              </h2>
              <p className="text-indigo-100 mt-1 text-xs md:text-base">
                Scan the class QR code to log your presence instantly.
              </p>
            </div>
          </div>
          <Link
            to={"/student/scan-QR"}
            className="w-full md:w-auto mt-2 md:mt-0"
          >
            <button className="w-full px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors text-sm md:text-base">
              Scan QR Now <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>

      {/* 🔹 MAIN GRID CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT COLUMN: Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 md:p-8 border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="text-indigo-500" size={20} />
                Today's Classes
              </h2>
              <span className="text-xs md:text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shrink-0">
                {classSession?.length || 0} Total
              </span>
            </div>

            {/* 🔹 SCROLLABLE TIMELINE CONTAINER 🔹 */}
            <div className="flex-1 max-h-[50vh] lg:max-h-100 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1 md:pr-2">
              <div className="space-y-4 md:space-y-6 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200">
                {classSession?.length > 0 ? (
                  classSession.map((cls) => (
                    <div
                      key={cls._id}
                      className="relative flex items-center gap-4 md:gap-6 group"
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 z-10 ${
                          cls.status === "Completed"
                            ? "bg-emerald-500"
                            : cls.status === "Ongoing"
                              ? "bg-indigo-600 ring-4 ring-indigo-100"
                              : "bg-slate-200"
                        }`}
                      >
                        {cls.status === "Completed" && (
                          <CheckCircle2 size={16} className="text-white" />
                        )}
                        {cls.status === "Ongoing" && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        )}
                      </div>

                      {/* Class Card */}
                      <div
                        className={`flex-1 p-4 md:p-5 rounded-xl border-2 transition-all duration-300 ${
                          cls.status === "Ongoing"
                            ? "bg-white border-indigo-500 shadow-md md:translate-x-1"
                            : cls.status === "Completed"
                              ? "bg-slate-50 border-slate-200 opacity-75"
                              : "bg-white border-dashed border-slate-300 md:group-hover:border-slate-400 md:group-hover:translate-x-1"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${
                              cls.status === "Ongoing"
                                ? "text-indigo-600"
                                : "text-slate-500"
                            }`}
                          >
                            {cls.timeSlot}
                          </span>
                          {cls.status === "Ongoing" && (
                            <span className="text-[9px] md:text-[10px] font-black text-white bg-indigo-600 px-2 md:px-2.5 py-1 rounded-lg animate-pulse shadow-sm shrink-0">
                              LIVE NOW
                            </span>
                          )}
                          {cls.status === "Not started" && (
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                              UPCOMING
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-bold text-base md:text-lg leading-tight ${
                            cls.status === "Completed"
                              ? "text-slate-600"
                              : "text-slate-800"
                          }`}
                        >
                          {typeof cls.subject === "string"
                            ? cls.subject
                            : cls.subject?.name || "Unknown Subject"}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 md:mt-3">
                          <p className="text-slate-500 text-xs md:text-sm flex items-center gap-1">
                            <BookOpen
                              size={14}
                              className="text-slate-400 shrink-0"
                            />
                            <span className="truncate">
                              {cls.teacher && typeof cls.teacher !== "string"
                                ? cls.teacher.fullName
                                : "Unknown Teacher"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="ml-8 text-sm text-slate-500">
                    No classes scheduled for today.
                  </div>
                )}
              </div>
            </div>
            {/* End of Scrollable Container */}
          </div>
        </div>

        {/* RIGHT COLUMN: Stats & Subject-Wise Chart */}
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Overview Stat Card */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <TrendingUp size={24} className="text-indigo-600 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-slate-500">
                Overall Attendance
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">
                {overallPercentage}%
              </h3>
              <p className="text-[10px] md:text-xs text-indigo-600 font-semibold mt-0.5 md:mt-1">
                Based on {totalClassesHeld} total classes
              </p>
            </div>
          </div>

          {/* Subject-Wise Attendance Bar Chart */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm flex-1 flex flex-col">
            <h2 className="text-base font-bold text-slate-800 mb-1 md:mb-2">
              Subject Attendance
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 mb-4 md:mb-6">
              Percentage of classes attended per subject
            </p>

            <div className="w-full flex-1 min-h-55 md:min-h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentStats || []}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  barSize={24}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="subject"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                    dy={10}
                    interval={0}
                    tickFormatter={(value) =>
                      value.length > 8 ? `${value.substring(0, 8)}...` : value
                    } // Truncates long names on mobile
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                    {studentStats?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percentage < 75 ? "#f43f5e" : "#6366f1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Warning indicator for low attendance */}
            {studentStats?.some((sub) => sub.percentage < 75) && (
              <div className="mt-4 flex items-start md:items-center gap-2 p-3 bg-rose-50 text-rose-700 text-[10px] md:text-xs font-semibold rounded-lg border border-rose-100">
                <AlertCircle size={14} className="shrink-0 mt-0.5 md:mt-0" />
                <span>
                  Heads up! You have subjects below the 75% threshold.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
