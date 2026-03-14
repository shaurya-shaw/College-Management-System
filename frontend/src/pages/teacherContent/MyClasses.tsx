import { useEffect, useState } from "react";
import { useClassSessionStore } from "../../store/classSessionStore";
import { Link } from "react-router-dom";

const MyClasses = () => {
  const { fetchTeacherSession, classSession } = useClassSessionStore();
  const [day, setDay] = useState("MONDAY");

  useEffect(() => {
    fetchTeacherSession(day);
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
      <div className="font-bold ml-2 text-2xl flex flex-start w-full">
        All Students
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Branch</th>
            <th className="text-left p-3 ">Subject</th>
            <th className="text-right p-3 ">Timeslot</th>
            <th className="text-right p-3 ">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {classSession.map((teach, key) => (
            <tr
              key={teach._id}
              className={`border-b ${key % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="p-3">
                {typeof teach.branch === "string"
                  ? teach.branch
                  : teach.branch?.name}
              </td>
              <td className="p-3">
                {typeof teach.subject === "string"
                  ? teach.subject
                  : teach.subject?.name}
              </td>
              <td className="p-3 text-right">{teach.timeSlot}</td>
              <td className="p-3 text-right">
                <Link
                  to={`/teacher/attendance/${teach._id}`}
                  className="px-3 py-1 bg-blue-500 text-white  rounded-2xl hover:bg-blue-600"
                >
                  Mark
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MyClasses;
