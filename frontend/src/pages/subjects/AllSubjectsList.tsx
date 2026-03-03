import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useBranchStore } from "../../store/branchStore";
import { useSubjectStore, type SubjectProps } from "../../store/subjectStore";

const AllSubjectsList = () => {
  const { register, handleSubmit, reset } = useForm<SubjectProps>();
  const { branch, fetchBranches } = useBranchStore();
  console.log(branch);

  const { subject, addSubject, deleteSubject, fetchSubjects } =
    useSubjectStore();

  const onSubmit = async (data: SubjectProps) => {
    try {
      await addSubject(data);
      reset();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
  }, []);

  return (
    <div className="flex flex-col items-center rounded-xl pb-4 pt-3 bg-white gap-4 m-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex  items-center gap-4"
      >
        <input
          {...register("name")}
          type="text"
          placeholder="Subject name"
          className="w-full px-4 py-3 
    rounded-2xl 
    border border-gray-300 
    bg-white 
    text-gray-700 
    shadow-sm
    transition-all duration-200
    focus:outline-none 
    focus:ring-2 focus:ring-green-500
    hover:border-green-400"
        />
        <select
          {...register("branch")}
          className="w-full px-4 py-3 
    rounded-2xl 
    border border-gray-300 
    bg-white 
    text-gray-700 
    shadow-sm
    transition-all duration-200
    focus:outline-none 
    focus:ring-2 focus:ring-green-500
    hover:border-green-400"
        >
          <option value="" className="text-gray-400 " aria-readonly>
            Select Branch
          </option>
          {branch.map((bran, idx) => (
            <option key={idx} value={bran.name}>
              {bran.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-700 whitespace-nowrap text-white p-2 rounded-3xl cursor-pointer hover:bg-blue-800 transition-colors duration-300"
          type="submit"
        >
          Add-Subject
        </button>
      </form>
      <div className="font-bold text-2xl flex flex-start w-full ml-5">
        All Subjects
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Subject</th>
            <th className="text-left p-3">Branch</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subject.map((sub, key) => (
            <tr
              key={sub._id}
              className={`border-b ${key % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="p-3">{sub.name}</td>
              <td className="p-3">
                {typeof sub.branch === "string" ? sub.branch : sub.branch.name}
              </td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteSubject(sub._id)}
                  className="bg-red-400 text-white px-3 py-1 rounded-lg"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllSubjectsList;
