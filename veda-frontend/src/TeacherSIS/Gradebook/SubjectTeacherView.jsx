import React, { useMemo, useState } from "react";
import { FiDownload, FiLock } from "react-icons/fi";

/* ================= SUBJECT TEACHER CONTEXT ================= */
const SUBJECT_TEACHER_MAPPING = [
  { class: "8", section: "A", subject: "Maths" },
  { class: "8", section: "A", subject: "Science" },
  { class: "8", section: "A", subject: "English" },
  { class: "9", section: "A", subject: "Science" },
];

/* ====== CLASS TEACHER CONFIG (READ ONLY) ====== */
const CLASS_TEACHER_CONFIG = {
  "Unit Exam": {
    unitsCount: 3,
    units: [
      { Maths: { theory: 10, practical: 0 }, Science: { theory: 8, practical: 2 }, English: { theory: 10, practical: 0 } },
      { Maths: { theory: 12, practical: 0 }, Science: { theory: 7, practical: 3 }, English: { theory: 10, practical: 0 } },
      { Maths: { theory: 15, practical: 0 }, Science: { theory: 10, practical: 5 }, English: { theory: 12, practical: 0 } },
    ],
  },
  "Mid Term": {
    unitsCount: 1,
    units: [
      { Maths: { theory: 20, practical: 5 }, Science: { theory: 15, practical: 5 }, English: { theory: 20, practical: 0 } },
    ],
  },
  "Final Exam": {
    unitsCount: 1,
    units: [
      { Maths: { theory: 30, practical: 0 }, Science: { theory: 25, practical: 5 }, English: { theory: 30, practical: 0 } },
    ],
  },
};

const INITIAL_STUDENTS = [
  { roll: 1, name: "Aarav", marks: {}, remarks: "" },
  { roll: 2, name: "Diya", marks: {}, remarks: "" },
  { roll: 3, name: "Kabir", marks: {}, remarks: "" },
  { roll: 4, name: "Mira", marks: {}, remarks: "" },
  { roll: 5, name: "Rohan", marks: {}, remarks: "" },
  { roll: 6, name: "Sana", marks: {}, remarks: "" },
];

const gradeFromPercent = (p) => {
  if (p >= 90) return "A+";
  if (p >= 75) return "A";
  if (p >= 60) return "B";
  if (p >= 45) return "C";
  if (p >= 33) return "D";
  return "F";
};

export default function SubjectTeacherMarks() {
  const TERMS = Object.keys(CLASS_TEACHER_CONFIG);

  const [selectedClass, setSelectedClass] = useState("8");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [finalSaved, setFinalSaved] = useState(false);

  const termConfig = CLASS_TEACHER_CONFIG[selectedTerm];

  // Available options
  const availableClasses = [...new Set(SUBJECT_TEACHER_MAPPING.map((m) => m.class))];
  const availableSections = SUBJECT_TEACHER_MAPPING.filter((m) => m.class === selectedClass)
    .map((m) => m.section)
    .filter((v, i, a) => a.indexOf(v) === i);
  const availableSubjects = SUBJECT_TEACHER_MAPPING.filter(
    (m) => m.class === selectedClass && m.section === selectedSection
  ).map((m) => m.subject);

  // Update marks
  const updateMark = (roll, unitIndex, type, value) => {
    if (finalSaved) return;
    const conf = termConfig.units[unitIndex][selectedSubject];
    const maxValue = conf[type];
    const safeValue = Math.min(Math.max(Number(value), 0), maxValue);

    setStudents((prev) =>
      prev.map((s) => {
        if (s.roll !== roll) return s;
        const termMarks = s.marks[selectedTerm] || [];
        const updated = [...termMarks];
        updated[unitIndex] = { [selectedSubject]: { theory: 0, practical: 0 } };
        updated[unitIndex][selectedSubject][type] = safeValue;
        return { ...s, marks: { ...s.marks, [selectedTerm]: updated } };
      })
    );
  };

  // Calculated students
  const calculatedStudents = useMemo(() => {
    return students.map((s) => {
      let obtained = 0,
        max = 0;
      for (let i = 0; i < termConfig.unitsCount; i++) {
        const conf = termConfig.units[i][selectedSubject];
        const mark = s.marks[selectedTerm]?.[i]?.[selectedSubject] || { theory: 0, practical: 0 };
        obtained += mark.theory + mark.practical;
        max += conf.theory + conf.practical;
      }
      const percent = max ? (obtained / max) * 100 : 0;
      return {
        ...s,
        obtained,
        max,
        percent,
        grade: gradeFromPercent(percent),
        result: obtained >= max * 0.33 ? "Pass" : "Fail",
      };
    });
  }, [students, selectedSubject, selectedTerm]);

  // Summary
  const summary = useMemo(() => {
    let pass = 0,
      fail = 0,
      avg = 0;
    calculatedStudents.forEach((s) => {
      avg += s.percent;
      s.result === "Pass" ? pass++ : fail++;
    });
    return {
      total: calculatedStudents.length,
      pass,
      fail,
      avg: calculatedStudents.length ? (avg / calculatedStudents.length).toFixed(1) : 0,
    };
  }, [calculatedStudents]);

  // List of failed students
  const failedStudents = useMemo(() => {
    return calculatedStudents.filter((s) => s.result === "Fail");
  }, [calculatedStudents]);

  // Export CSV
  const exportCSV = () => {
    let csv = "Roll,Name,Obtained,Max,Percent,Grade,Result\n";
    calculatedStudents.forEach((s) => {
      csv += `${s.roll},${s.name},${s.obtained},${s.max},${s.percent.toFixed(1)},${s.grade},${s.result}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClass}-${selectedSection}-${selectedSubject}-${selectedTerm}.csv`;
    a.click();
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-4 rounded border mb-4 font-semibold">
        Class {selectedClass} – Section {selectedSection} – {selectedSubject}
        <div className="text-xs text-gray-500">Term: {selectedTerm}</div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 border rounded mb-4 flex gap-4">
        <select
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setFinalSaved(false);
          }}
          className="border px-3 py-2"
        >
          {availableClasses.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={selectedSection}
          onChange={(e) => {
            setSelectedSection(e.target.value);
            setFinalSaved(false);
          }}
          className="border px-3 py-2"
        >
          {availableSections.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            setFinalSaved(false);
          }}
          className="border px-3 py-2"
        >
          {availableSubjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={selectedTerm}
          onChange={(e) => {
            setSelectedTerm(e.target.value);
            setFinalSaved(false);
          }}
          className="border px-3 py-2"
        >
          {TERMS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {finalSaved && (
          <div className="flex items-center gap-2 text-red-600 font-semibold">
            <FiLock /> Locked
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
        <div className="bg-white p-4 border mb-4 rounded overflow-auto">
      <div className="grid grid-cols-4 gap-4 ">
        <SummaryCard title="Students" value={summary.total} color="bg-blue-200" />
        <SummaryCard title="Passed" value={summary.pass} color="bg-green-200" />
        <SummaryCard title="Failed" value={summary.fail} color="bg-red-200" />
        <SummaryCard title="Avg %" value={summary.avg} color="bg-yellow-200" />
      </div>
</div>
      {/* MARKS TABLE */}
      <div className="bg-white p-4 border rounded overflow-auto">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">{selectedTerm} – {selectedSubject}</h3>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            <FiDownload /> Export
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Roll</th>
              <th className="border p-2">Name</th>
              {[...Array(termConfig.unitsCount)].map((_, i) => (
                <th key={i} className="border p-2">Exam {i + 1}</th>
              ))}
              <th className="border p-2">Total</th>
              <th className="border p-2">%</th>
              <th className="border p-2">Grade</th>
              <th className="border p-2">Result</th>
            </tr>
          </thead>

          <tbody>
            {calculatedStudents.map((s) => (
              <tr key={s.roll}>
                <td className="border p-2">{s.roll}</td>
                <td className="border p-2">{s.name}</td>
                {[...Array(termConfig.unitsCount)].map((_, i) => {
                  const conf = termConfig.units[i][selectedSubject];
                  const mark = s.marks[selectedTerm]?.[i]?.[selectedSubject] || { theory: 0, practical: 0 };
                  return (
                    <td key={i} className="border p-2">
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                        T {conf.theory} / P {conf.practical}
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        <input
                          disabled={finalSaved}
                          type="number"
                          value={mark.theory}
                          onChange={(e) => updateMark(s.roll, i, "theory", e.target.value)}
                          className="border px-1"
                        />
                        {conf.practical > 0 && (
                          <input
                            disabled={finalSaved}
                            type="number"
                            value={mark.practical}
                            onChange={(e) => updateMark(s.roll, i, "practical", e.target.value)}
                            className="border px-1"
                          />
                        )}
                      </div>
                    </td>
                  );
                })}
                <td className="border p-2">{s.obtained}/{s.max}</td>
                <td className="border p-2">{s.percent.toFixed(1)}</td>
                <td className="border p-2">{s.grade}</td>
                <td className="border p-2">{s.result}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!finalSaved && (
          <button
            onClick={() => setFinalSaved(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Final Save & Lock
          </button>
        )}
      </div>

      {/* CLASS TEACHER VIEW */}
      {finalSaved && (
        <div className="mt-6 bg-white p-4 border rounded">
          <h3 className="font-semibold mb-2">Class Teacher – Consolidated Subject View</h3>
          <div className="text-sm mb-2">
            Subject: {selectedSubject} | Avg %: {summary.avg} | Pass: {summary.pass} | Fail: {summary.fail}
          </div>

          {/* LIST OF FAILURES */}
          {failedStudents.length > 0 && (
            <div className="text-sm text-red-600">
              <strong>Failed Students:</strong> {failedStudents.map((s) => s.name).join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} border rounded p-3 text-center`}>
      <div className="text-xs text-gray-700">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
