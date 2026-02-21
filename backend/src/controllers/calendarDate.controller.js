import { CalendarDate } from "../models/calendarDate.model.js";

const generateCalendar = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year || isNaN(year)) {
      return res.status(400).json({
        message: "Valid year is required",
      });
    }

    // prevent duplicate year generation
    const existing = await CalendarDate.findOne({
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    });

    if (existing) {
      return res.status(400).json({
        message: `Calendar for ${year} already exists`,
      });
    }

    const dates = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      dates.push({
        date: new Date(date),
        day: dayName,

        // mark holidays
        isHoliday: dayName === "Sunday" || dayName === "Saturday",
      });
    }

    await CalendarDate.insertMany(dates);

    return res.status(201).json({
      message: `Calendar ${year} generated successfully`,
      totalDays: dates.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error generating calendar",
      error: error.message,
    });
  }
};

const getCalendar = async (req, res) => {
  try {
    const { year, month } = req.query;

    let filter = {};

    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);

      filter.date = { $gte: start, $lte: end };
    }

    const calendar = await CalendarDate.find(filter).sort({ date: 1 });

    return res.status(200).json({
      message: "Calendar fetched successfully",
      total: calendar.length,
      calendar,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching calendar",
      error: error.message,
    });
  }
};

const toggleCalendarHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const calendarDay = await CalendarDate.findById(id);

    if (!calendarDay) {
      return res.status(404).json({
        message: "Date not found",
      });
    }

    calendarDay.isHoliday = !calendarDay.isHoliday;
    await calendarDay.save();

    return res.status(200).json({
      message: `Holiday ${
        calendarDay.isHoliday ? "marked" : "removed"
      } successfully`,
      data: calendarDay,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating holiday",
      error: error.message,
    });
  }
};

export { generateCalendar, getCalendar, toggleCalendarHoliday };
