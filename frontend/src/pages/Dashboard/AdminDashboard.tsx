import { useEffect } from "react";
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
  Users,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  CalendarDays,
  Activity,
} from "lucide-react";
import { useDashboardStore } from "../../store/dashboardStore";

export default function AdminDashboard() {
  const { loading, fetchStats, stats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, []);

  // Safe fallback values for data
  const presentCount = stats?.present || 0;
  const absentCount = stats?.absent || 0;
  const totalMarked = presentCount + absentCount;

  // Prevent NaN if totalMarked is 0
  const attendanceRate =
    totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : 0;

  const attendanceData = [
    { name: "Present", value: presentCount },
    { name: "Absent", value: absentCount },
  ];

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8 font-sans text-slate-900 relative">
      {/* 🔹 HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            System Overview
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </h1>
          <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
            <CalendarDays size={18} className="text-indigo-500" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      {/* 🔹 TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Admin Card */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-semibold group-hover:text-indigo-600 transition-colors">
              Total Admins
            </h3>
            <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <ShieldCheck className="w-5 h-5 text-indigo-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
            {1}
          </h2>
        </div>

        {/* Teacher Card */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-purple-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-semibold group-hover:text-purple-600 transition-colors">
              Total Teachers
            </h3>
            <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Users className="w-5 h-5 text-purple-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
            {stats?.totalTeachers || 0}
          </h2>
        </div>

        {/* Student Card */}
        <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 hover:border-blue-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm font-semibold group-hover:text-blue-600 transition-colors">
              Total Students
            </h3>
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <GraduationCap className="w-5 h-5 text-blue-600 group-hover:text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
            {stats?.totalStudents || 0}
          </h2>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART SECTION */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-indigo-500" size={20} />
              Today's Attendance Overview
            </h2>

            {/* Custom Legend */}
            <div className="flex gap-4 text-sm font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="text-slate-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></span>
                <span className="text-slate-600">Absent</span>
              </div>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceData}
                maxBarSize={50}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {/* Custom Gradients for the Bars */}
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={1} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 13 }}
                />

                <Tooltip
                  cursor={{ fill: "#f8fafc", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow:
                      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    color: "#0f172a",
                    fontWeight: "600",
                    padding: "12px 16px",
                  }}
                  itemStyle={{ color: "#475569" }}
                />

                <Bar
                  dataKey="value"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                >
                  {attendanceData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0 ? "url(#colorPresent)" : "url(#colorAbsent)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* EXTRA INFO SIDEBAR */}
        <div className="flex flex-col gap-6">
          <div className="group bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 md:p-8 border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-200/50 p-2 rounded-lg text-emerald-700">
                <TrendingUp size={20} />
              </div>
              <p className="text-emerald-800 font-bold text-sm tracking-wide uppercase">
                Attendance Rate
              </p>
            </div>
            <h2 className="text-5xl font-black text-emerald-600 tracking-tight">
              {attendanceRate}%
            </h2>
            <p className="text-emerald-700/80 text-sm mt-3 font-medium">
              Of total enrolled students processed
            </p>
          </div>

          <div className="group bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 md:p-8 border border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-200/50 p-2 rounded-lg text-blue-700">
                <CheckCircle size={20} />
              </div>
              <p className="text-blue-800 font-bold text-sm tracking-wide uppercase">
                Total Marked Today
              </p>
            </div>
            <h2 className="text-5xl font-black text-blue-600 tracking-tight">
              {totalMarked}
            </h2>
            <p className="text-blue-700/80 text-sm mt-3 font-medium">
              Individual records processed
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 ENHANCED LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 transition-opacity">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-indigo-900 font-semibold animate-pulse">
            Syncing system data...
          </p>
        </div>
      )}
    </div>
  );
}
