import { useEffect, useState } from "react";
import { useClassSessionStore } from "../../store/classSessionStore";
import AddClassSession from "./AddClassSession";
import AllClassSessions from "./AllClassSessions";

const ClassSessionPage = () => {
  const { classSession, fetchClassSession, totalPages } =
    useClassSessionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  // fetch list whenever page changes or the modal is closed/opened
  useEffect(() => {
    fetchClassSession(page);
  }, [page, isOpen]);

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
            Add class
          </span>
        </button>
      </div>
      {isOpen && <AddClassSession close={() => setIsOpen(false)} />}
      <div
        className="bg-white pt-2 pb-16 rounded-lg shadow-md h-2/3 relative overflow-auto hide-scrollbar"
        style={
          {
            /* scrollbar styles now handled by CSS class */
          }
        }
      >
        <AllClassSessions classSession={classSession} />
        {/* pagination buttons placed at bottom center of this container; extra bottom padding added above so content isn't hidden */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center bg-white py-2 shadow-lg">
          <div className="flex gap-2">
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
      </div>
    </div>
  );
};

export default ClassSessionPage;
