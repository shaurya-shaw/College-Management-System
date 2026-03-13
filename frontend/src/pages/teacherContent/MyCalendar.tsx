import { useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import type { NavigateAction, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCalendarStore } from "../../store/calendarStore";
import type { CalendarDay } from "../../store/calendarStore";
import ErrorToast from "../../components/ErrorToast";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { "en-US": enUS },
});

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function CustomToolbar({
  date,
  onNavigate,
}: {
  date: Date;
  onNavigate: (a: NavigateAction) => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white select-none">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate("PREV")}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 font-bold text-lg transition-colors"
        >
          «
        </button>
        <button
          onClick={() => onNavigate("PREV")}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-xl transition-colors"
        >
          ‹
        </button>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
          {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
        </h2>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate("NEXT")}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-xl transition-colors"
        >
          ›
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 font-bold text-lg transition-colors"
        >
          »
        </button>
      </div>
    </div>
  );
}

// Each day cell — clickable, shows Work/Holiday badge
function DateCellWrapper({
  value,
  children,
  calendarData,
  toggling,
  onToggle,
}: {
  value: Date;
  children: React.ReactNode;
  calendarData: CalendarDay[];
  toggling: string | null;
  onToggle: (id: string) => void;
}) {
  const match = calendarData.find((d) => {
    const dd = new Date(d.date);
    return (
      dd.getFullYear() === value.getFullYear() &&
      dd.getMonth() === value.getMonth() &&
      dd.getDate() === value.getDate()
    );
  });

  const isToday = new Date().toDateString() === value.toDateString();
  const isLoading = match ? toggling === match._id : false;

  // No data for this day — render plain (prev/next month overflow cells)
  if (!match) {
    return <div className="relative h-full w-full">{children}</div>;
  }

  return (
    <div
      className={`
        relative h-full w-full group cursor-pointer transition-colors duration-150
        ${
          isToday
            ? "bg-blue-600"
            : match.isHoliday
              ? "bg-red-50 hover:bg-red-100"
              : "bg-white hover:bg-green-50"
        }
      `}
      onClick={() => !isLoading && onToggle(match._id)}
      title={
        match.isHoliday
          ? "Click to mark as Workday"
          : "Click to mark as Holiday"
      }
    >
      {children}

      {/* Always-visible status badge */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center pointer-events-none">
        {isLoading ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            <span className="w-2.5 h-2.5 border border-gray-400 border-t-transparent rounded-full animate-spin inline-block" />
            saving
          </span>
        ) : (
          <span
            className={`
            text-[10px] font-bold px-2 py-0.5 rounded-full leading-none uppercase tracking-wide
            ${
              isToday
                ? "bg-white/20 text-white"
                : match.isHoliday
                  ? "bg-red-200 text-red-700"
                  : "bg-green-100 text-green-700"
            }
          `}
          >
            {match.isHoliday ? "Holiday" : "Work"}
          </span>
        )}
      </div>

      {/* Hover hint top-right */}
      {!isLoading && (
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span
            className={`
            text-[9px] font-bold px-1.5 py-0.5 rounded leading-none
            ${
              isToday
                ? "bg-white/25 text-white"
                : match.isHoliday
                  ? "bg-red-200 text-red-700"
                  : "bg-gray-200 text-gray-500"
            }
          `}
          >
            {match.isHoliday ? "→ Work" : "→ Off"}
          </span>
        </div>
      )}
    </div>
  );
}

export default function MyCalendar() {
  const {
    calendar,
    loading,
    toggling,
    currentDate,
    error,
    success,
    setCurrentDate,
    fetchCalendar,
    toggleHoliday,
    clearError,
    clearSuccess,
  } = useCalendarStore();

  useEffect(() => {
    fetchCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, []);

  // Auto-dismiss success toast
  useEffect(() => {
    if (success) {
      const t = setTimeout(clearSuccess, 3500);
      return () => clearTimeout(t);
    }
  }, [success]);

  const handleNavigate = useCallback(
    (date: Date, _view: View, _action: NavigateAction) => {
      setCurrentDate(date);
    },
    [],
  );

  const workdays = calendar.filter((d) => !d.isHoliday).length;
  const holidays = calendar.filter((d) => d.isHoliday).length;

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Stats strip */}
      <div className="flex items-center gap-6 px-6 py-2.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="text-sm text-gray-600">
            Workdays:{" "}
            <strong className="text-gray-900">
              {loading ? "…" : workdays}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
          <span className="text-sm text-gray-600">
            Holidays:{" "}
            <strong className="text-gray-900">
              {loading ? "…" : holidays}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          <span className="text-sm text-gray-600">
            Total:{" "}
            <strong className="text-gray-900">
              {loading ? "…" : calendar.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative flex-1 min-h-0">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        <Calendar
          localizer={localizer}
          events={[]}
          date={currentDate}
          view="month"
          onView={() => {}}
          onNavigate={handleNavigate}
          dayPropGetter={() => ({ style: { background: "transparent" } })}
          style={{ height: "100%" }}
          toolbar
          selectable={false}
          components={{
            toolbar: (props) => (
              <CustomToolbar date={props.date} onNavigate={props.onNavigate} />
            ),
            dateCellWrapper: (props) => (
              <DateCellWrapper
                value={props.value as Date}
                calendarData={calendar}
                toggling={toggling}
                onToggle={toggleHoliday}
              >
                {props.children}
              </DateCellWrapper>
            ),
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-6 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-100 border border-green-300 inline-block" />
          Workday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" />
          Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
          Today
        </span>
      </div>

      {/* Toasts */}
      {error && (
        <ErrorToast message={error} type="error" onClose={clearError} />
      )}
      {success && (
        <ErrorToast message={success} type="success" onClose={clearSuccess} />
      )}
    </div>
  );
}
