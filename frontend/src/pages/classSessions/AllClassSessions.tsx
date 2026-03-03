import { Trash } from "lucide-react";

import {
  useClassSessionStore,
  type ClassSessionProps,
} from "../../store/classSessionStore";

const AllClassSessions = ({
  classSession,
}: {
  classSession: ClassSessionProps[];
}) => {
  const { DeleteClassSession } = useClassSessionStore();

  const deleteteach = async (id: string) => {
    await DeleteClassSession(id);
  };
  console.log(classSession);

  return (
    <>
      <div className="font-bold ml-2 text-2xl flex flex-start w-full">
        All classes
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Branch</th>
            <th className="text-left p-3 ">Subject</th>
            <th className="text-left p-3 ">Teacher</th>
            <th className="text-left p-3 ">Day</th>
            <th className="text-left p-3 ">timeSlot</th>
            <th className="text-right p-3">Actions</th>
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
                  : teach.branch.name}
              </td>
              <td className="p-3">
                {typeof teach.subject === "string"
                  ? teach.subject
                  : teach.subject.name}
              </td>
              <td className="p-3">
                {typeof teach.teacher === "string"
                  ? teach.teacher
                  : teach.teacher.fullName}
              </td>
              <td className="p-3">{teach.day || "-"}</td>
              <td className="p-3">{teach.timeSlot || "-"}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteteach(teach._id)}
                  className="bg-red-400 text-white px-3 py-1 rounded-lg"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AllClassSessions;
