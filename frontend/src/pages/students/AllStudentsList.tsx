import { Trash } from "lucide-react";
import { useStudentStore, type StudentProps } from "../../store/studentStore";

const AllStudentsList = ({ student }: { student: StudentProps[] }) => {
  const { deleteStudent } = useStudentStore();

  const deleteteach = async (id: string) => {
    await deleteStudent(id);
  };
  console.log(student);

  return (
    <>
      <div className="font-bold ml-2 text-2xl flex flex-start w-full">
        All Students
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3 ">email</th>
            <th className="text-left p-3 ">Branch</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {student.map((teach, key) => (
            <tr
              key={teach._id}
              className={`border-b ${key % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="p-3">{teach.fullName}</td>
              <td className="p-3">{teach.email}</td>
              <td className="p-3">{teach.branch?.name || "-"}</td>
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

export default AllStudentsList;
