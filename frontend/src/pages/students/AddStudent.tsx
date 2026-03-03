import { useForm } from "react-hook-form";
import { useStudentStore, type StudentProps } from "../../store/studentStore";
import { useBranchStore } from "../../store/branchStore";
import { useEffect } from "react";

const AddStudent = ({ close }: { close: () => void }) => {
  const { register, handleSubmit, reset } = useForm<StudentProps>({
    defaultValues: { role: "STUDENT" },
  });
  const addStudent = useStudentStore((state) => state.addStudent);
  const { branch, fetchBranches } = useBranchStore();
  console.log(branch);

  const onSubmit = async (data: StudentProps) => {
    await addStudent(data);
    reset();
    close();
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-5">
      <div className="bg-white p-5 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">Add Student</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("fullName")}
            placeholder="FullName"
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
          <input
            {...register("email")}
            placeholder="Email"
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
          <input
            {...register("password")}
            placeholder="password"
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
            <option value="" className="text-gray-500 " aria-readonly>
              Select Branch
            </option>
            {branch.map((bran, idx) => (
              <option key={idx} value={bran.name}>
                {bran.name}
              </option>
            ))}
          </select>
          <input
            {...register("role")}
            readOnly
            placeholder="role"
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

          <button
            className="bg-green-400  p-2 rounded-2xl pr-3 pl-3 w-1/3 text-white hover:bg-green-500 transition-colors duration-300"
            type="submit"
          >
            Add
          </button>
        </form>

        <button onClick={close} className="mt-3 text-red-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
