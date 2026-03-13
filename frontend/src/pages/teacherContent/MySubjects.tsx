import { useEffect } from "react";
import { useSubjectStore } from "../../store/subjectStore";

const MySubjects = () => {
  const { subject, teacherSubject } = useSubjectStore();

  useEffect(() => {
    teacherSubject();
  }, []);

  return (
    <>
      <div className="font-bold ml-2 text-2xl flex flex-start w-full">
        All Students
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Branch</th>
            <th className="text-left p-3 ">Subject</th>
          </tr>
        </thead>
        <tbody>
          {subject.map((teach, key) => (
            <tr
              key={teach._id}
              className={`border-b ${key % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="p-3">
                {typeof teach.branch === "string"
                  ? teach.branch
                  : teach.branch?.name}
              </td>
              <td className="p-3">{teach.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MySubjects;
