const MS_DAY = 86400000;

const startOfLocalDay = (d) => {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth(), x.getDate());
};

const dateKey = (d) => {
  const s = startOfLocalDay(d);
  const y = s.getFullYear();
  const m = String(s.getMonth() + 1).padStart(2, "0");
  const day = String(s.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getLeaveCycleRange = (referenceDate, cycleStartMonth = 1) => {
  const d = startOfLocalDay(referenceDate);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const cycleStartYear = month >= cycleStartMonth ? year : year - 1;
  const start = new Date(cycleStartYear, cycleStartMonth - 1, 1);
  const nextCycleStart = new Date(cycleStartYear + 1, cycleStartMonth - 1, 1);
  const end = new Date(nextCycleStart.getTime() - MS_DAY);
  return { start, end };
};

const leaveFullyInsideCycle = (fromDate, toDate, cycleStart, cycleEnd) => {
  const a = startOfLocalDay(fromDate).getTime();
  const b = startOfLocalDay(toDate).getTime();
  return a >= cycleStart.getTime() && b <= cycleEnd.getTime();
};

const isStrictlyBeforeToday = (d) => startOfLocalDay(d).getTime() < startOfLocalDay(new Date()).getTime();

const countEffectiveLeave = (parsedFrom, parsedTo, duration, policy, holidayKeys) => {
  const holidays = holidayKeys instanceof Set ? holidayKeys : new Set(holidayKeys || []);
  const isHalf = String(duration || "").includes("Half");

  if (isHalf) {
    const day = startOfLocalDay(parsedFrom);
    if (startOfLocalDay(parsedTo).getTime() !== day.getTime()) {
      return { effective: 0, attendanceDates: [] };
    }
    const dow = day.getDay();
    if (policy.excludeSundays && dow === 0) {
      return { effective: 0, attendanceDates: [] };
    }
    const key = dateKey(day);
    if (policy.excludeHolidays && holidays.has(key)) {
      return { effective: 0, attendanceDates: [] };
    }
    return {
      effective: 0.5,
      attendanceDates: [{ date: new Date(day), status: "Half Day", fraction: 0.5 }],
    };
  }

  let effective = 0;
  const attendanceDates = [];
  let cur = startOfLocalDay(parsedFrom);
  const end = startOfLocalDay(parsedTo);
  while (cur <= end) {
    const dow = cur.getDay();
    const key = dateKey(cur);
    const skipSunday = policy.excludeSundays && dow === 0;
    const skipHol = policy.excludeHolidays && holidays.has(key);
    if (!skipSunday && !skipHol) {
      effective += 1;
      attendanceDates.push({ date: new Date(cur), status: "Leave", fraction: 1 });
    }
    cur = new Date(cur.getTime() + MS_DAY);
  }
  return { effective, attendanceDates };
};

const rangesOverlap = (f1, t1, f2, t2) => {
  const a1 = startOfLocalDay(f1).getTime();
  const b1 = startOfLocalDay(t1).getTime();
  const a2 = startOfLocalDay(f2).getTime();
  const b2 = startOfLocalDay(t2).getTime();
  return a1 <= b2 && a2 <= b1;
};

const sortLeavesByApplyDate = (rows) => [...rows].sort((a, b) => new Date(a.applyDate) - new Date(b.applyDate));

const allocatePaidUnpaid = (sortedRows, policy) => {
  let paidPoolUsed = 0;
  const allocation = new Map();
  for (const L of sortedRows) {
    const E = L.effectiveDays;
    const room = Math.max(0, policy.paidLeaveLimit - paidPoolUsed);
    let paidDays;
    let unpaidDays;
    if (policy.autoConvertExtraToUnpaid) {
      paidDays = Math.min(E, room);
      unpaidDays = E - paidDays;
    } else {
      if (E > room + 1e-9) {
        return {
          error: "Paid leave limit exceeded for this cycle. Enable auto-convert to unpaid or reduce leave days.",
          allocation: null,
          failedId: L.id,
        };
      }
      paidDays = E;
      unpaidDays = 0;
    }
    paidPoolUsed += paidDays;
    allocation.set(L.id, { paidDays, unpaidDays });
  }
  return { error: null, allocation, failedId: null };
};

const sumEffective = (rows) => rows.reduce((s, r) => s + (Number(r.effectiveDays) || 0), 0);

const attendanceNoteForLeave = (leaveId) => `staffLeave:${String(leaveId)}`;

module.exports = {
  startOfLocalDay,
  dateKey,
  getLeaveCycleRange,
  leaveFullyInsideCycle,
  isStrictlyBeforeToday,
  countEffectiveLeave,
  rangesOverlap,
  sortLeavesByApplyDate,
  allocatePaidUnpaid,
  sumEffective,
  attendanceNoteForLeave,
};
