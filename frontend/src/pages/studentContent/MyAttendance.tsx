import { useEffect } from "react";
import { useAttendanceStore } from "../../store/attendanceStore";
import { CalendarDays, Clock, BookOpen } from "lucide-react";
import ErrorToast from "../../components/ErrorToast";

const MyAttendance = () => {
  const {
    myAttendance,
    fetchMyAttendance,
    loading,
    error,
    clearError,
    success,
    clearSuccess,
  } = useAttendanceStore();

  useEffect(() => {
    fetchMyAttendance();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyle = (isPresent: boolean) =>
    isPresent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-4">
        <CalendarDays />
        My Attendance
      </div>

      {/* -------- MOBILE VIEW -------- */}
      <div className="md:hidden flex flex-col gap-4">
        {myAttendance.map((att) => (
          <div key={att._id} className="bg-white rounded-xl shadow p-4">
            <div className="font-semibold text-lg">
              {att.classSession.subject.name}
            </div>

            <div className="text-gray-500 text-sm">
              {att.classSession.day} • {att.classSession.timeSlot}
            </div>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Clock size={14} />
              {formatDate(att.calendarDate.date)}
            </div>

            <div
              className={`mt-3 px-3 py-1 rounded-full text-sm w-fit ${statusStyle(
                att.isPresent,
              )}`}
            >
              {att.isPresent ? "Present" : "Absent"}
            </div>
          </div>
        ))}
      </div>

      {/* -------- DESKTOP TABLE -------- */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
              <tr>
                <th className="text-left px-6 py-4">Subject</th>
                <th className="text-center px-6 py-4">Day</th>
                <th className="text-center px-6 py-4">Time</th>
                <th className="text-center px-6 py-4">Date</th>
                <th className="text-right px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {myAttendance.map((att) => (
                <tr key={att._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium">
                    <BookOpen size={16} />
                    {att.classSession.subject.name}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {att.classSession.day}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {att.classSession.timeSlot}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {formatDate(att.calendarDate.date)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle(
                        att.isPresent,
                      )}`}
                    >
                      {att.isPresent ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {error && <ErrorToast message={error} onClose={clearError} />}
      {success && <ErrorToast message={success} onClose={clearSuccess} />}
    </div>
  );
};

export default MyAttendance;
