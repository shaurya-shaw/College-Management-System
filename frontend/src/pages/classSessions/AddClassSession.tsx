import { useForm } from "react-hook-form";
import { useBranchStore } from "../../store/branchStore";
import { useEffect } from "react";
import {
  useClassSessionStore,
  type ClassSessionProps,
} from "../../store/classSessionStore";
import { useSubjectStore } from "../../store/subjectStore";
import { useTeacherStore } from "../../store/teacherStore";

const AddClassSession = ({ close }: { close: () => void }) => {
  const { register, handleSubmit, reset } = useForm<ClassSessionProps>();
  const { addClassSession, fetchClassSession } = useClassSessionStore();
  const { branch, fetchBranches } = useBranchStore();
  const { subject, fetchSubjects } = useSubjectStore();
  const { teacher, fetchTeachers } = useTeacherStore();

  const onSubmit = async (data: ClassSessionProps) => {
    await addClassSession(data);
    await fetchClassSession();
    reset();
    close();
  };

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
    fetchBranches();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-5">
      <div className="bg-white p-5 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">Add Class</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
          <select
            {...register("teacher")}
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
              Select Teacher
            </option>
            {teacher.map((teach, idx) => (
              <option key={idx} value={teach.fullName}>
                {teach.fullName}
              </option>
            ))}
          </select>
          <select
            {...register("subject")}
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
              Select Subject
            </option>
            {subject.map((sub, idx) => (
              <option key={idx} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
          <select
            {...register("day")}
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
              Select Day
            </option>
            <option value="MONDAY" className="text-gray-500 ">
              Monday
            </option>
            <option value="TUESDAY" className="text-gray-500 ">
              Tuesday
            </option>
            <option value="WEDNESDAY" className="text-gray-500 ">
              Wednessday
            </option>
            <option value="THURSDAY" className="text-gray-500 ">
              Thursday
            </option>
            <option value="FRIDAY" className="text-gray-500 ">
              Friday
            </option>
            <option value="SATURDAY" className="text-gray-500 ">
              Saturday
            </option>
          </select>
          <select
            {...register("timeSlot")}
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
              Select time
            </option>
            <option value="9:15-10:05" className="text-gray-500 ">
              9:15-10:05
            </option>
            <option value="10:10-11:00" className="text-gray-500">
              10:10-11:00
            </option>
            <option value="11:05-11:55" className="text-gray-500 ">
              11:05-11:55
            </option>
            <option value="12:00-12:50" className="text-gray-500 ">
              12:00-12:50
            </option>
            <option value="1:50-2:40" className="text-gray-500 ">
              1:50-2:40
            </option>
            <option value="2:45-3:35" className="text-gray-500 ">
              2:45-3:35
            </option>
            <option value="3:40-4:30" className="text-gray-500 ">
              3:40-4:30
            </option>
            <option value="4:35-5:25" className="text-gray-500 ">
              4:35-5:25
            </option>
          </select>

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

export default AddClassSession;
