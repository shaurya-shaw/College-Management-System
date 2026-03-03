import { useEffect, useState } from "react";
import { useStudentStore } from "../../store/studentStore";
import AddStudent from "./AddStudent";
import AllStudentsList from "./AllStudentsList";

const StudentPage = () => {
  const { student, fetchStudents } = useStudentStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [setIsOpen]);

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
            Add Student
          </span>
        </button>
      </div>
      {isOpen && <AddStudent close={() => setIsOpen(false)} />}
      <div className="bg-white pt-2 pb-5 rounded-lg shadow-md">
        <AllStudentsList student={student} />
      </div>
    </div>
  );
};

export default StudentPage;
