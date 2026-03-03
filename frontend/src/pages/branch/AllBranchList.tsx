import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useBranchStore, type BranchProps } from "../../store/branchStore";

const AllBranchList = () => {
  const { branch, addBranch, deleteBranch, fetchBranches, totalPages } =
    useBranchStore();

  const { register, handleSubmit, reset } = useForm<BranchProps>();
  const [page, setPage] = useState(1);

  const onSubmit = async (data: BranchProps) => {
    try {
      await addBranch(data);
      await fetchBranches(page);
      reset();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchBranches(page);
  }, [page]);

  return (
    <div className="flex flex-col items-center gap-2 m-5 bg-white min-h-2/3 pt-3 pb-4 rounded-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex  items-center gap-2 -mt-5"
      >
        <input
          {...register("name")}
          type="text"
          placeholder="enter branch name"
          className="pl-3 pr-3 p-2 mb-4 border w-80 rounded-2xl bg-gray-100 border-gray-500 mt-5"
        />
        <button
          className="bg-blue-700 text-amber-50 p-2 rounded-3xl cursor-pointer hover:bg-blue-800 transition-colors duration-300"
          type="submit"
        >
          Add-Branch
        </button>
      </form>
      <div className="font-bold text-2xl flex flex-start w-full ml-5">
        All Branches
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white opacity-40 font-light">
            <th className="text-left p-3">Branch Name</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branch.map((bran, idx) => (
            <tr
              key={bran._id}
              className={`border-b ${idx % 2 !== 0 ? "bg-gray-100" : "bg-white"}`}
            >
              <td className="p-3">{bran.name}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteBranch(bran._id)}
                  className="bg-red-400 text-white px-3 py-1 rounded-lg"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-auto mb-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg border transition-all duration-200 ${
              page === i + 1
                ? "bg-blue-300 text-black shadow-md"
                : "hover:bg-blue-200 hover:text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllBranchList;
