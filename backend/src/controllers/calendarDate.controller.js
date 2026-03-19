import { CalendarDate } from "../models/calendarDate.model.js";

const generateCalendar = async (req, res) => {
  try {
    const { year } = req.query;

    // 1. Exact original logic: Delete existing dates for the year first
    // We use the +05:30 offset to ensure we delete the correct IST range
    await CalendarDate.deleteMany({
      date: {
        $gte: new Date(`${year}-01-01T00:00:00+05:30`),
        $lte: new Date(`${year}-12-31T23:59:59+05:30`),
      },
    });

    const years = Number(year);

    if (!year || isNaN(year)) {
      return res.status(400).json({
        message: "Valid year is required",
      });
    }

    // 2. Exact original logic: Duplicate check
    const existing = await CalendarDate.findOne({
      date: {
        $gte: new Date(`${years}-01-01T00:00:00+05:30`),
        $lte: new Date(`${years}-12-31T23:59:59+05:30`),
      },
    });

    if (existing) {
      return res.status(400).json({
        message: `Calendar for ${years} already exists`,
      });
    }

    const dates = [];

    // 3. Replaced Date.UTC with IST String constructors
    // This ensures startDate starts at 00:00 IST
    const startDate = new Date(`${years}-01-01T00:00:00+05:30`);
    const endDate = new Date(`${years}-12-31T00:00:00+05:30`);

    for (
      let date = new Date(startDate);
      date <= endDate;
      // .setDate handles the rollover correctly across months
      date.setDate(date.getDate() + 1)
    ) {
      // 4. Force dayName to calculate based on India Timezone
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "Asia/Kolkata",
      });

      dates.push({
        date: new Date(date),
        day: dayName, // Keeps your original casing (e.g., "Sunday")

        // 5. Exact original holiday logic
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
      // Logic preserved: month - 1 for 0-based index
      // Added T00:00:00+05:30 to lock the start to India's midnight
      const start = new Date(`${year}-${month}-01T00:00:00+05:30`);

      // Logic preserved: month, 0 gets the last day of the previous month
      // We construct the end of the month string and lock it to IST
      const endMonth = new Date(year, month, 0).getDate();
      const end = new Date(`${year}-${month}-${endMonth}T23:59:59+05:30`);

      filter.date = { $gte: start, $lte: end };
    }

    // Exact same query and sort
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
