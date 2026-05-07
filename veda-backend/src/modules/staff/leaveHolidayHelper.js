const CalendarEvent = require("../calendar/calendarModel");
const { startOfLocalDay, dateKey } = require("./leaveCalculation");

const expandEventToDateKeys = (startDate, endDate) => {
  const keys = [];
  let cur = startOfLocalDay(startDate);
  const end = startOfLocalDay(endDate);
  const MS_DAY = 86400000;
  while (cur <= end) {
    keys.push(dateKey(cur));
    cur = new Date(cur.getTime() + MS_DAY);
  }
  return keys;
};

const loadHolidayDateKeySet = async (fromDate, toDate, excludeHolidays) => {
  if (!excludeHolidays) return new Set();
  const start = startOfLocalDay(fromDate);
  const end = startOfLocalDay(toDate);
  const events = await CalendarEvent.find({
    eventType: /^holiday$/i,
    startDate: { $lte: end },
    endDate: { $gte: start },
  })
    .select("startDate endDate eventType")
    .lean();

  const set = new Set();
  for (const ev of events) {
    for (const k of expandEventToDateKeys(ev.startDate, ev.endDate)) {
      set.add(k);
    }
  }
  return set;
};

module.exports = { loadHolidayDateKeySet, expandEventToDateKeys };
