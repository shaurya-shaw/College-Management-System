import { useEffect, useState } from "react";
import { useTeacherStore } from "../../store/teacherStore";
import AddTeacher from "./AddTeacher";
import AllTeachersList from "./AllTeachersList";

const TeacherPage = () => {
  const { teacher, fetchTeachers } = useTeacherStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="pl-3 pr-3">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="
    group
    flex items-center
    bg-amber-400 text-white
    h-10
    rounded-full
    overflow-hidden
    transition-all duration-300
    hover:w-40
    w-10
  "
        >
          <span className="flex items-center justify-center w-10 h-10 shrink-0">
            +
          </span>

          <span
            className="
      whitespace-nowrap
      opacity-0
      group-hover:opacity-100
      transition-opacity duration-300
      pr-4
    "
          >
            Add Teacher
          </span>
        </button>
      </div>
      {isOpen && <AddTeacher close={() => setIsOpen(false)} />}
      <div className="bg-white pt-2 pb-5 rounded-lg shadow-md">
        <AllTeachersList teacher={teacher} />
      </div>
    </div>
  );
};

export default TeacherPage;
