import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import { useClassSessionStore } from "../../store/classSessionStore";

export default function TeacherDashboard() {
  // 🔹 STATE FOR NOTES
  const [notes, setNotes] = useState([
    { id: 1, text: "Finalize mid-term grades by Friday evening." },
    { id: 2, text: "Prepare slides for the API routing lecture." },
  ]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = (e: any) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), text: newNote }]);
    setNewNote("");
  };

  const handleDeleteNote = (id: any) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const { classSession, fetchTeacherDashboard } = useClassSessionStore();

  // const day = new Date()
  //   .toLocaleDateString("en-US", { weekday: "long" })
  //   .toUpperCase();

  const day = "FRIDAY"; //!testing purposes

  console.log(day);

  useEffect(() => {
    fetchTeacherDashboard(day);
  }, []);

  const attendanceTrends = [
    //Hardcoded data for now, replace with API data later
    { day: "Mon", attendance: 88 },
    { day: "Tue", attendance: 92 },
    { day: "Wed", attendance: 85 },
    { day: "Thu", attendance: 94 },
    { day: "Fri", attendance: 90 },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8 font-sans text-slate-900">
      {/* 🔹 HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Overview
          </h1>
          <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
            <CalendarDays size={18} className="text-indigo-500" />
            <span>{currentDate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🔹 LEFT/CENTER COLUMN (Classes & Chart) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Today's Schedule Timeline */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="text-indigo-500" size={20} />
              Today's Schedule
            </h2>

            {/* 🔹 SCROLLABLE CONTAINER WITH HIDDEN SCROLLBAR 🔹 */}
            <div className=" max-h-75 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-600 before:to-transparent">
                {classSession.map((cls) => (
                  <div
                    key={cls._id}
                    className=" relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Timeline Dot */}
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                        cls.status === "Completed"
                          ? "bg-emerald-500"
                          : cls.status === "Ongoing"
                            ? "bg-indigo-600 ring-4 ring-indigo-100"
                            : "bg-slate-300"
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
                      className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border-2  ${
                        cls.status === "Completed"
                          ? "bg-emerald-50/40 border-emerald-300 "
                          : cls.status === "Ongoing"
                            ? "bg-indigo-50 border-indigo-300  shadow-sm"
                            : "bg-white border-slate-400 "
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-bold ${cls.status === "Ongoing" ? "text-indigo-700" : "text-slate-500"}`}
                        >
                          {cls.timeSlot}
                        </span>
                        {cls.status === "Ongoing" && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                            Happening Now
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg">
                        {typeof cls.subject === "string"
                          ? cls.subject
                          : cls.subject.name}
                      </h3>
                      <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                        <MapPin size={14} />{" "}
                        {typeof cls.branch === "string"
                          ? cls.branch
                          : cls.branch.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smooth Area Chart (Weekly Trends) */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              Weekly Attendance Trend
            </h2>
            <div className="w-full h-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={attendanceTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorAttendance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 13 }}
                    domain={["dataMin - 5", "dataMax + 5"]}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#4f46e5", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 🔹 RIGHT COLUMN (Notes & Reminders) */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full max-h-175">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Quick Notes</h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {notes.length} Active
              </span>
            </div>

            {/* Notes List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              {notes.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">
                  No notes yet. Add one below!
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className="group bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start justify-between gap-3 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors"
                  >
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {note.text}
                    </p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Input */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
              <form onSubmit={handleAddNote} className="relative">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a reminder..."
                  className="w-full bg-white border border-slate-200 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
