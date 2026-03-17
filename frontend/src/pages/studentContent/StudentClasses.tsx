import { useEffect, useState } from "react";
import { useClassSessionStore } from "../../store/classSessionStore";

const StudentClasses = () => {
  const { fetchStudentSession, classSession } = useClassSessionStore();
  const [day, setDay] = useState("MONDAY");

  useEffect(() => {
    fetchStudentSession(day);
  }, [day]);

  const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  return (
    <>
      {days.map((da: string) => (
        <button
          key={da}
          onClick={() => setDay(da)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border-2 border-gray-400/30 mr-2 mb-4 ${
            day === da
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {da}
        </button>
      ))}
      <div className="p-3 md:p-6">
        {/* Title */}
        <div className="font-bold text-xl md:text-2xl mb-4">All Subjects</div>

        {/* -------- MOBILE VIEW (Cards) -------- */}
        <div className="md:hidden flex flex-col gap-4">
          {classSession.map((teach) => (
            <div key={teach._id} className="bg-blue-100 rounded-xl shadow p-4">
              <div className="text-lg font-semibold">
                {typeof teach.subject === "string"
                  ? teach.subject
                  : teach.subject.name}
              </div>

              <div className="text-gray-600 mt-2">
                <span className="font-medium">Teacher:</span>{" "}
                {typeof teach.teacher === "string"
                  ? teach.teacher
                  : teach.teacher.fullName}
              </div>

              <div className="text-gray-600 break-all">
                <span className="font-medium">Time:</span> {teach.timeSlot}
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
                  <th className="text-left px-6 py-4 font-semibold">Branch</th>
                  <th className="text-center px-6 py-4 font-semibold">
                    Subject
                  </th>
                  <th className="text-right px-6 py-4 font-semibold">
                    Teacher
                  </th>
                  <th className="text-right px-6 py-4 font-semibold">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {classSession.map((teach) => (
                  <tr
                    key={teach._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {typeof teach.branch === "string"
                        ? teach.branch
                        : teach.branch.name}
                    </td>

                    <td className="px-6 py-4 text-center text-gray-700">
                      {typeof teach.subject === "string"
                        ? teach.subject
                        : teach.subject.name}
                    </td>

                    <td className="px-6 py-4 text-right text-gray-600 break-all">
                      {typeof teach.teacher === "string"
                        ? teach.teacher
                        : teach.teacher.fullName}
                    </td>

                    <td className="px-6 py-4 text-right text-gray-600 break-all">
                      {teach.timeSlot}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentClasses;
