import { useEffect } from "react";
import { useCoursesStore } from "../../store/coursesStore";
import ErrorToast from "../../components/ErrorToast";

const MyCourses = () => {
  const {
    courses,
    fetchCourses,
    error,
    success,
    clearError,
    clearSuccess,
    loading,
  } = useCoursesStore();

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-3 md:p-6">
      {/* Title */}
      <div className="font-bold text-xl md:text-2xl mb-4">All Subjects</div>

      {/* -------- MOBILE VIEW (Cards) -------- */}
      <div className="md:hidden flex flex-col gap-4">
        {courses.map((teach) => (
          <div
            key={teach.subject._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="text-lg font-semibold">{teach.subject.name}</div>

            <div className="text-gray-600 mt-2">
              <span className="font-medium">Teacher:</span>{" "}
              {teach.teacher.fullName}
            </div>

            <div className="text-gray-600 break-all">
              <span className="font-medium">Email:</span> {teach.teacher.email}
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
                <th className="text-left px-6 py-4 font-semibold">Subject</th>
                <th className="text-center px-6 py-4 font-semibold">Teacher</th>
                <th className="text-right px-6 py-4 font-semibold">Email</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {courses.map((teach) => (
                <tr
                  key={teach.subject._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {teach.subject.name}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-700">
                    {teach.teacher.fullName}
                  </td>

                  <td className="px-6 py-4 text-right text-gray-600 break-all">
                    {teach.teacher.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

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

export default MyCourses;
