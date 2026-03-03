import { useForm } from "react-hook-form";
import { useTeacherStore, type TeacherProps } from "../../store/teacherStore";

const AddTeacher = ({ close }: { close: () => void }) => {
  const { register, handleSubmit, reset } = useForm<TeacherProps>({
    defaultValues: { role: "TEACHER" },
  });
  const addTeacher = useTeacherStore((state) => state.addTeacher);

  const onSubmit = async (data: TeacherProps) => {
    await addTeacher(data);
    reset();
    close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-5">
      <div className="bg-white p-5 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">Add Teacher</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("fullName")}
            placeholder="FullName"
            className="p-2 border w-full rounded-2xl border-black/35"
          />
          <input
            {...register("email")}
            placeholder="Email"
            className="p-2 border w-full rounded-2xl border-black/35"
          />
          <input
            {...register("password")}
            placeholder="password"
            className="p-2 border w-full rounded-2xl border-black/35"
          />
          <input
            {...register("role")}
            readOnly
            placeholder="role"
            className="p-2 border w-full rounded-2xl border-black/35"
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

export default AddTeacher;
