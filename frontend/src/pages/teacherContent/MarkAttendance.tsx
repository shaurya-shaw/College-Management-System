import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAttendanceStore } from "../../store/attendanceStore";
import { Link } from "react-router-dom";
import ErrorToast from "../../components/ErrorToast";

const MarkAttendance = () => {
  const {
    attendance,
    fetchAttendance,
    markAttendance,
    error,
    success,
    loading,
    clearError,
    clearSuccess,
  } = useAttendanceStore();
  const { classId } = useParams();

  const now = new Date("2026-03-13");

  useEffect(() => {
    if (classId) fetchAttendance(classId);
  }, [classId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Attendance</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        <tbody>
          {attendance.map((student, key) => (
            <tr
              key={student.studentId}
              className={`border-b ${key % 2 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="p-3">{student.fullName}</td>
              <td className="p-3">{student.email}</td>

              <td className="p-3">
                <button
                  onClick={() =>
                    markAttendance(
                      classId!,
                      student.studentId,
                      !student.isPresent,
                      now,
                    )
                  }
                  className={`px-4 py-1 rounded-full text-sm font-medium transition cursor-pointer 
                  ${
                    student.isPresent
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.isPresent ? "Present" : "Absent"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <Link
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
          to={"/teacher/dashboard"}
        >
          Done
        </Link>
      </div>
      {/* Toasts */}
      {error && (
        <ErrorToast message={error} type="error" onClose={clearError} />
      )}
      {success && (
        <ErrorToast message={success} type="success" onClose={clearSuccess} />
      )}
    </div>
  );
};
export default MarkAttendance;
