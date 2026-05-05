import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiEdit, FiEye, FiFileText, FiX } from "react-icons/fi";
import staffAPI from "../services/staffAPI";

const STORAGE_KEY = "veda_teacher_leave_requests_v1";
const INITIAL_CASUAL = 15;
const INITIAL_SICK = 12;

const LEAVE_TYPES = [
  "Casual Leave",
  "Sick Leave",
  "Emergency Leave",
  "Personal Leave",
  "Maternity Leave",
];

const DURATIONS = [
  "Full Day",
  "Multiple Days",
  "Half Day - First Half",
  "Half Day - Second Half",
];

function parseLocalYmd(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function countWeekdaysInclusive(startStr, endStr) {
  const start = parseLocalYmd(startStr);
  const end = parseLocalYmd(endStr);
  if (!start || !end || end < start) return 0;
  let n = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) n++;
    cur.setDate(cur.getDate() + 1);
  }
  return n;
}

function calendarDaysInclusive(startStr, endStr) {
  const start = parseLocalYmd(startStr);
  const end = parseLocalYmd(endStr);
  if (!start || !end) return 0;
  return Math.round((end - start) / 86400000) + 1;
}

function leaveBucket(leaveType) {
  return leaveType === "Sick Leave" ? "sick" : "casual";
}

function leaveUnits(startDate, endDate, duration) {
  if (!startDate || !endDate) return 0;
  if (duration.includes("Half")) return 0.5;
  /* Full Day and Multiple Days both charge by teaching weekdays in range */
  return countWeekdaysInclusive(startDate, endDate);
}

function conflictLabel(startDate, endDate, duration) {
  if (!startDate || !endDate) return "—";
  if (parseLocalYmd(endDate) < parseLocalYmd(startDate)) return "Invalid range";
  if (duration.includes("Half")) return "2 scheduled classes";
  const w = countWeekdaysInclusive(startDate, endDate);
  if (w <= 1) return "No conflict";
  return "Scheduled class conflict";
}

function isMultipleDaysDuration(duration) {
  return duration === "Multiple Days";
}

function formatRangeDisplay(startStr, endStr) {
  const a = parseLocalYmd(startStr);
  const b = parseLocalYmd(endStr);
  if (!a || !b) return "—";
  const opts = { day: "numeric", month: "short", year: "numeric" };
  const left = a.toLocaleDateString("en-IN", opts);
  const right = b.toLocaleDateString("en-IN", opts);
  if (left === right) return left;
  return `${left} to ${right}`;
}

function LeaveDetailCell({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/90 p-3 min-w-0">
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 mt-1 break-words">{value}</p>
    </div>
  );
}

function loadRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map((row) => {
          const { substitute: _s, handover: _h, ...rest } = row;
          const teacherName =
            !rest.teacherName || rest.teacherName === "Teacher User"
              ? teacherDisplayName()
              : rest.teacherName;
          return { ...rest, teacherName };
        });
      }
    }
  } catch {
    /* ignore */
  }
  return defaultSeedRequests();
}

function defaultSeedRequests() {
  const self = teacherDisplayName();
  return [
    {
      id: "LR-9115",
      teacherName: self,
      leaveType: "Emergency Leave",
      duration: "Multiple Days",
      startDate: "2026-05-10",
      endDate: "2026-05-17",
      conflict: "Scheduled class conflict",
      status: "Approved",
      reason: "Urgent family matter.",
      docName: null,
      units: 5,
      bucket: "casual",
      appliedAt: "2026-05-02T09:00:00.000Z",
    },
    {
      id: "LR-9102",
      teacherName: self,
      leaveType: "Casual Leave",
      duration: "Full Day",
      startDate: "2026-05-12",
      endDate: "2026-05-14",
      conflict: "No conflict",
      status: "Pending",
      reason: "Personal work out of station.",
      docName: null,
      units: 3,
      bucket: "casual",
      appliedAt: "2026-05-03T11:20:00.000Z",
    },
    {
      id: "LR-9088",
      teacherName: self,
      leaveType: "Sick Leave",
      duration: "Full Day",
      startDate: "2026-05-18",
      endDate: "2026-05-20",
      conflict: "Scheduled class conflict",
      status: "Pending",
      reason: "Medical rest as advised.",
      docName: "medical-note.pdf",
      units: 3,
      bucket: "sick",
      appliedAt: "2026-04-28T14:00:00.000Z",
    },
    {
      id: "LR-9071",
      teacherName: self,
      leaveType: "Personal Leave",
      duration: "Full Day",
      startDate: "2026-05-08",
      endDate: "2026-05-08",
      conflict: "No conflict",
      status: "Approved",
      reason: "Personal appointment.",
      docName: null,
      units: 1,
      bucket: "casual",
      appliedAt: "2026-05-04T08:30:00.000Z",
    },
    {
      id: "LR-9060",
      teacherName: self,
      leaveType: "Sick Leave",
      duration: "Full Day",
      startDate: "2026-04-10",
      endDate: "2026-04-11",
      conflict: "No conflict",
      status: "Approved",
      reason: "Recovery period.",
      docName: "fit-note.pdf",
      units: 2,
      bucket: "sick",
      appliedAt: "2026-04-08T10:00:00.000Z",
    },
    {
      id: "LR-9055",
      teacherName: self,
      leaveType: "Casual Leave",
      duration: "Half Day - Second Half",
      startDate: "2026-04-20",
      endDate: "2026-04-20",
      conflict: "2 scheduled classes",
      status: "Approved",
      reason: "Bank work.",
      docName: null,
      units: 0.5,
      bucket: "casual",
      appliedAt: "2026-04-18T12:00:00.000Z",
    },
    {
      id: "LR-9040",
      teacherName: self,
      leaveType: "Casual Leave",
      duration: "Full Day",
      startDate: "2026-03-02",
      endDate: "2026-03-02",
      conflict: "No conflict",
      status: "Approved",
      reason: "Conference (archived sample).",
      docName: null,
      units: 1,
      bucket: "casual",
      appliedAt: "2026-02-28T09:00:00.000Z",
    },
  ];
}

function persistRequests(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function nextRequestId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LR-${n}`;
}

function teacherDisplayName() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return (
      u?.name ||
      u?.personalInfo?.name ||
      u?.personalInfo?.fullName ||
      u?.username ||
      u?.email ||
      "Teacher"
    );
  } catch {
    return "Teacher";
  }
}

/** Stored rows may still say "Teacher User"; show current profile name instead. */
function displayTeacherName(stored) {
  if (!stored || stored === "Teacher User") return teacherDisplayName();
  return stored;
}

function isObjectIdLike(value) {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

export default function TeacherLeave() {
  const formTopRef = useRef(null);
  const [requests, setRequests] = useState(() => loadRequests());
  const [teacherStaffId, setTeacherStaffId] = useState("");

  const [leaveType, setLeaveType] = useState("Emergency Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("Half Day - First Half");
  const [editingId, setEditingId] = useState(null);
  const [reason, setReason] = useState("");
  const [docName, setDocName] = useState("");
  const [fileKey, setFileKey] = useState(0);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [viewRow, setViewRow] = useState(null);

  useEffect(() => {
    persistRequests(requests);
  }, [requests]);

  useEffect(() => {
    let isMounted = true;
    const loadTeacherStaffId = async () => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        const localStaffId = u?.staffId || u?.personalInfo?.staffId;
        if (localStaffId && !isObjectIdLike(localStaffId)) {
          if (isMounted) setTeacherStaffId(localStaffId);
          return;
        }
        const refId = u?.refId || u?._id;
        if (!refId) return;
        const res = await staffAPI.getStaffById(refId);
        const apiStaffId = res?.staff?.personalInfo?.staffId;
        if (apiStaffId && !isObjectIdLike(apiStaffId) && isMounted) {
          setTeacherStaffId(apiStaffId);
        }
      } catch {
        /* ignore */
      }
    };
    loadTeacherStaffId();
    return () => {
      isMounted = false;
    };
  }, []);

  const usedByBucket = useMemo(() => {
    const used = { casual: 0, sick: 0 };
    requests
      .filter((r) => r.status === "Approved" || r.status === "Pending")
      .forEach((r) => {
        const b = r.bucket || leaveBucket(r.leaveType);
        const u = typeof r.units === "number" ? r.units : leaveUnits(r.startDate, r.endDate, r.duration);
        used[b] += u;
      });
    return used;
  }, [requests]);

  const casualBalance = Math.max(0, INITIAL_CASUAL - usedByBucket.casual);
  const sickBalance = Math.max(0, INITIAL_SICK - usedByBucket.sick);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "Pending").length,
    [requests]
  );

  const approvedThisMonth = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return requests.filter((r) => {
      if (r.status !== "Approved") return false;
      const d = parseLocalYmd(r.startDate);
      return d && d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }, [requests]);

  const sickDocRequired = useMemo(() => {
    if (leaveType !== "Sick Leave" || !startDate || !endDate) return false;
    return calendarDaysInclusive(startDate, endDate) > 2;
  }, [leaveType, startDate, endDate]);

  const validate = useCallback(() => {
    const errs = [];
    if (!leaveType) errs.push("Select a leave type.");
    if (!startDate || !endDate) errs.push("Start date and end date are required.");
    if (startDate && endDate && endDate < startDate) errs.push("End date cannot be before start date.");
    if (duration.includes("Half") && startDate && endDate && startDate !== endDate) {
      errs.push("Half-day leave must use the same start and end date.");
    }
    if (isMultipleDaysDuration(duration) && calendarDaysInclusive(startDate, endDate) <= 1) {
      errs.push("Multiple Days requires an end date after the start date (at least two calendar days).");
    }
    if (!reason.trim()) errs.push("Reason is required.");
    const sickDays = calendarDaysInclusive(startDate, endDate);
    if (leaveType === "Sick Leave" && sickDays > 2 && !docName) {
      errs.push("Supporting document is required for Sick Leave longer than 2 calendar days.");
    }
    const bucket = leaveBucket(leaveType);
    const units = leaveUnits(startDate, endDate, duration);
    let balanceCredit = 0;
    if (editingId) {
      const old = requests.find((x) => x.id === editingId);
      if (old && old.status === "Pending") {
        const oldBucket = old.bucket || leaveBucket(old.leaveType);
        const oldUnits =
          typeof old.units === "number" ? old.units : leaveUnits(old.startDate, old.endDate, old.duration);
        if (oldBucket === bucket) balanceCredit = oldUnits;
      }
    }
    const avail = (bucket === "sick" ? sickBalance : casualBalance) + balanceCredit;
    if (units > 0 && units > avail + 1e-6) {
      errs.push(
        `Insufficient ${bucket === "sick" ? "sick" : "casual"} leave balance for this request (${units} day(s) needed, ${avail.toFixed(1)} available).`
      );
    }
    return errs;
  }, [
    leaveType,
    startDate,
    endDate,
    duration,
    reason,
    docName,
    sickBalance,
    casualBalance,
    editingId,
    requests,
  ]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setDocName(f ? f.name : "");
  };

  const clearForm = () => {
    setLeaveType("Emergency Leave");
    setStartDate("");
    setEndDate("");
    setDuration("Half Day - First Half");
    setEditingId(null);
    setReason("");
    setDocName("");
    setFileKey((k) => k + 1);
    setFormError("");
    setFormSuccess("");
  };

  const openEdit = (r) => {
    if (r.status !== "Pending") return;
    setEditingId(r.id);
    setLeaveType(r.leaveType);
    setStartDate(r.startDate);
    setEndDate(r.endDate);
    setDuration(r.duration);
    setReason(r.reason || "");
    setDocName(r.docName || "");
    setFileKey((k) => k + 1);
    setFormError("");
    setFormSuccess("");
    setViewRow(null);
    scrollToForm();
  };

  const submit = () => {
    setFormSuccess("");
    const errs = validate();
    if (errs.length) {
      setFormError(errs.join(" "));
      return;
    }
    setFormError("");
    const bucket = leaveBucket(leaveType);
    const units = leaveUnits(startDate, endDate, duration);
    const conflict = conflictLabel(startDate, endDate, duration);

    if (editingId) {
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== editingId) return r;
          const { handover: _h, ...base } = r;
          return {
            ...base,
            leaveType,
            duration,
            startDate,
            endDate,
            conflict,
            reason: reason.trim(),
            docName: docName || null,
            units,
            bucket,
          };
        })
      );
      setEditingId(null);
      setLeaveType("Emergency Leave");
      setStartDate("");
      setEndDate("");
      setDuration("Half Day - First Half");
      setReason("");
      setDocName("");
      setFileKey((k) => k + 1);
      setFormSuccess("Leave request updated successfully.");
      return;
    }

    const row = {
      id: nextRequestId(),
      teacherName: teacherDisplayName(),
      teacherId: teacherStaffId || null,
      leaveType,
      duration,
      startDate,
      endDate,
      conflict,
      status: "Pending",
      reason: reason.trim(),
      docName: docName || null,
      units,
      bucket,
      appliedAt: new Date().toISOString(),
    };
    setRequests((prev) => [row, ...prev]);
    setLeaveType("Emergency Leave");
    setStartDate("");
    setEndDate("");
    setDuration("Half Day - First Half");
    setReason("");
    setDocName("");
    setFileKey((k) => k + 1);
    setFormError("");
    setFormSuccess("Leave request submitted and is pending approval.");
  };

  const scrollToForm = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="p-0 m-0 space-y-4 w-full max-w-full min-w-0">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Casual Leave Balance", value: casualBalance.toFixed(1).replace(/\.0$/, "") },
          { label: "Sick Leave Balance", value: sickBalance.toFixed(1).replace(/\.0$/, "") },
          { label: "Pending Requests", value: String(pendingCount) },
          { label: "Approved This Month", value: String(approvedThisMonth) },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0"
          >
            <p className="text-[11px] sm:text-xs text-gray-500 mb-1 leading-snug">{card.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Apply form */}
      <div
        ref={formTopRef}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 w-full max-w-full min-w-0"
      >
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Apply Teacher Leave
        </h3>

        {editingId && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 text-amber-900 px-3 py-2 text-sm">
            You are updating a pending request. Submit to save changes, or Clear to cancel editing.
          </div>
        )}

        {formError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm break-words">
            {formError}
          </div>
        )}
        {formSuccess && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 text-green-800 px-3 py-2 text-sm break-words">
            {formSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Leave Type<span className="text-red-500"> *</span>
            </label>
            <select
              className="w-full min-w-0 max-w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start Date<span className="text-red-500"> *</span>
            </label>
            <input
              type="date"
              className="w-full min-w-0 max-w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              End Date<span className="text-red-500"> *</span>
            </label>
            <input
              type="date"
              className="w-full min-w-0 max-w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="min-w-0">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Duration<span className="text-red-500"> *</span>
            </label>
            <select
              className="w-full min-w-0 max-w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1 leading-snug">
              Use <span className="font-medium">Multiple Days</span> when leave spans more than one calendar day
              (weekday count is used for balance).
            </p>
          </div>
          <div className="min-w-0 sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Supporting Document
              {sickDocRequired && <span className="text-red-500"> *</span>}
            </label>
            <input
              key={fileKey}
              type="file"
              className="w-full min-w-0 max-w-full text-sm text-gray-600 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700"
              onChange={handleFile}
            />
          </div>
        </div>

        <div className="mb-4 min-w-0">
          <label className="block text-xs font-medium text-gray-600 mb-1 break-words">
            Reason<span className="text-red-500"> *</span>
          </label>
          <textarea
            rows={3}
            className="w-full min-w-0 max-w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Enter leave reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap gap-3 pt-4 mt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={submit}
            className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 sm:py-2 rounded-md text-sm font-medium shadow-sm w-full sm:w-auto min-h-[44px]"
          >
            <FiCheck className="text-lg shrink-0" />
            {editingId ? "Update Leave Request" : "Submit Leave Request"}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="inline-flex justify-center items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 sm:py-2 rounded-md text-sm font-medium border border-gray-300 w-full sm:w-auto min-h-[44px]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Requests: cards (mobile) + table (md+) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 w-full max-w-full min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          My Leave Requests
        </h3>

        {/* Mobile / narrow */}
        <div className="md:hidden space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 text-sm space-y-2 min-w-0"
            >
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 break-words">{r.leaveType}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.duration}</p>
                </div>
                <span
                  className={
                    r.status === "Approved"
                      ? "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800"
                      : "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800"
                  }
                >
                  {r.status}
                </span>
              </div>
              <p className="text-gray-700 break-words">
                <span className="font-medium text-gray-800">Date:</span>{" "}
                {formatRangeDisplay(r.startDate, r.endDate)}
              </p>
              <p className="text-gray-700 break-words">
                <span className="font-medium text-gray-800">Conflict:</span> {r.conflict}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  title="View"
                  onClick={() => setViewRow(r)}
                  className="inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  <FiEye className="text-lg text-gray-600" />
                  View
                </button>
                <button
                  type="button"
                  title="Update"
                  disabled={r.status !== "Pending"}
                  onClick={() => openEdit(r)}
                  className={`inline-flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-md border text-sm font-medium ${
                    r.status === "Pending"
                      ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiEdit className="text-lg" />
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet / desktop */}
        <div className="hidden md:block overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[520px] text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-2 lg:p-3 border border-gray-200 font-semibold">Leave Type</th>
                <th className="p-2 lg:p-3 border border-gray-200 font-semibold whitespace-nowrap">
                  Date
                </th>
                <th className="p-2 lg:p-3 border border-gray-200 font-semibold">Conflict</th>
                <th className="p-2 lg:p-3 border border-gray-200 font-semibold whitespace-nowrap text-center">
                  Status
                </th>
                <th className="p-2 lg:p-3 border border-gray-200 font-semibold whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                  <td className="p-2 lg:p-3 border border-gray-200 text-gray-800 break-words max-w-[200px]">
                    <div className="font-medium">{r.leaveType}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.duration}</div>
                  </td>
                  <td className="p-2 lg:p-3 border border-gray-200 text-gray-700 whitespace-nowrap">
                    {formatRangeDisplay(r.startDate, r.endDate)}
                  </td>
                  <td className="p-2 lg:p-3 border border-gray-200 text-gray-700 break-words max-w-[180px]">
                    {r.conflict}
                  </td>
                  <td className="p-2 lg:p-3 border border-gray-200 whitespace-nowrap text-center">
                    <span
                      className={
                        r.status === "Approved"
                          ? "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800"
                          : "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800"
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-2 lg:p-3 border border-gray-200 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center gap-1">
                      <button
                        type="button"
                        title="View"
                        onClick={() => setViewRow(r)}
                        className="p-2 rounded text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                      >
                        <FiEye className="text-lg" />
                      </button>
                      <button
                        type="button"
                        title="Update"
                        disabled={r.status !== "Pending"}
                        onClick={() => openEdit(r)}
                        className={`p-2 rounded ${
                          r.status === "Pending"
                            ? "text-blue-600 hover:bg-blue-50"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <FiEdit className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {requests.length === 0 && (
          <p className="text-gray-500 text-sm mt-3">No leave requests yet.</p>
        )}
      </div>

      {/* FAB */}
      <button
        type="button"
        onClick={scrollToForm}
        className="fixed z-40 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-lg flex items-center justify-center bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]"
        title="Apply leave"
        aria-label="Scroll to apply leave form"
      >
        <FiFileText className="text-lg sm:text-xl" />
      </button>

      {/* View modal */}
      {viewRow && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white shadow-xl w-full sm:max-w-lg sm:rounded-lg rounded-t-xl border border-gray-200 max-h-[min(92dvh,100vh-2rem)] sm:max-h-[90vh] overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 gap-2 shrink-0">
              <div className="min-w-0 pr-2">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  Leave details
                </h4>
              </div>
              <button
                type="button"
                className="p-2 rounded hover:bg-gray-100 text-gray-600 shrink-0"
                onClick={() => setViewRow(null)}
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-sm text-gray-700 overflow-y-auto min-h-0 break-words">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <LeaveDetailCell
                  label="Teacher"
                  value={
                    <span className="block">
                      <span className="block">{displayTeacherName(viewRow.teacherName)}</span>
                      {((viewRow.teacherId && !isObjectIdLike(viewRow.teacherId)) || teacherStaffId) && (
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {(viewRow.teacherId && !isObjectIdLike(viewRow.teacherId))
                            ? viewRow.teacherId
                            : teacherStaffId}
                        </span>
                      )}
                    </span>
                  }
                />
                <LeaveDetailCell label="Status" value={viewRow.status} />
                <LeaveDetailCell label="Leave type" value={viewRow.leaveType} />
                <LeaveDetailCell
                  label="Date"
                  value={formatRangeDisplay(viewRow.startDate, viewRow.endDate)}
                />
                <LeaveDetailCell label="Conflict" value={viewRow.conflict} />
                <LeaveDetailCell
                  label="Duration"
                  value={
                    typeof viewRow.units === "number"
                      ? `${viewRow.duration} (${String(viewRow.units).replace(/\.0$/, "")} day${
                          viewRow.units === 1 ? "" : "s"
                        } charged)`
                      : viewRow.duration
                  }
                />
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50/90 p-3 min-w-0">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                  Reason
                </p>
                <p className="text-gray-900 mt-1 break-words whitespace-pre-wrap">{viewRow.reason}</p>
              </div>
              {viewRow.docName && (
                <LeaveDetailCell label="Supporting document" value={viewRow.docName} />
              )}
            </div>
            <div className="px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-gray-200 flex justify-stretch sm:justify-end shrink-0">
              <button
                type="button"
                onClick={() => setViewRow(null)}
                className="w-full sm:w-auto min-h-[44px] px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
