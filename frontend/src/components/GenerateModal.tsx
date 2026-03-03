import { useState } from "react";
import { useCalendarStore } from "../store/calendarStore";

export default function GenerateModal({ onClose }: { onClose: () => void }) {
  const { generateCalendar, generating } = useCalendarStore();
  const [year, setYear] = useState(new Date().getFullYear());

  const handle = async () => {
    await generateCalendar(year);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Generate Calendar</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs transition-colors"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Fills the database with every day of the selected year. Weekends are
          automatically marked as holidays.
        </p>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Year
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-11 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 text-lg font-medium transition-colors"
              onClick={() => setYear((y) => y - 1)}
            >
              −
            </button>
            <input
              type="number"
              className="flex-1 text-center text-2xl font-bold text-gray-800 border-none outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              min={2000}
              max={2100}
            />
            <button
              className="w-11 h-11 bg-gray-50 hover:bg-gray-100 text-gray-600 text-lg font-medium transition-colors"
              onClick={() => setYear((y) => y + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            disabled={generating}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {generating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              `Generate ${year}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
