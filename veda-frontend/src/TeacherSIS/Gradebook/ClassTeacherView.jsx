import React, { useMemo, useState } from "react";
import { FiDownload, FiSave, FiLock, FiRefreshCcw } from "react-icons/fi";

const SUBJECTS = ["Maths", "Science", "English"];

const gradeFromPercent = (p) => {
  if (p >= 90) return "A+";
  if (p >= 75) return "A";
  if (p >= 60) return "B";
  if (p >= 45) return "C";
  if (p >= 33) return "D";
  return "F";
};

const INITIAL_STUDENTS = [
  {
    roll: 1,
    name: "Aarav",
    remarks: "",
    recheck: false,
    marks: {
      "Unit Test 1": [
        {
          Maths: { theory: 10, practical: 0 },
          Science: { theory: 7, practical: 2 },
          English: { theory: 9, practical: 0 },
        },
        {
          Maths: { theory: 9, practical: 0 },
          Science: { theory: 6, practical: 3 },
          English: { theory: 8, practical: 0 },
        },
      ],
      "Mid Term": [
        {
          Maths: { theory: 65, practical: 15 },
          Science: { theory: 55, practical: 20 },
          English: { theory: 60, practical: 0 },
        },
      ],
      "Final Exam": [
        {
          Maths: { theory: 85, practical: 0 },
          Science: { theory: 70, practical: 25 },
          English: { theory: 90, practical: 0 },
        },
      ],
    },
  },
  {
    roll: 2,
    name: "Diya",
    remarks: "",
    recheck: false,
    marks: {
      "Unit Test 1": [
        {
          Maths: { theory: 8, practical: 0 },
          Science: { theory: 5, practical: 1 },
          English: { theory: 7, practical: 0 },
        },
        {
          Maths: { theory: 7, practical: 0 },
          Science: { theory: 4, practical: 2 },
          English: { theory: 6, practical: 0 },
        },
      ],
      "Mid Term": [
        {
          Maths: { theory: 40, practical: 10 },
          Science: { theory: 35, practical: 12 },
          English: { theory: 42, practical: 0 },
        },
      ],
      "Final Exam": [
        {
          Maths: { theory: 75, practical: 0 },
          Science: { theory: 65, practical: 25 },
          English: { theory: 80, practical: 0 },
        },
      ],
    },
  },
];

export default function ClassTeacherView() {
  const [selectedTerm, setSelectedTerm] = useState("Unit Test 1");
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const [termConfig, setTermConfig] = useState({
    "Unit Test 1": {
      unitsCount: 2,
      units: [
        {
          Maths: { theory: 10, practical: 0 },
          Science: { theory: 8, practical: 2 },
          English: { theory: 10, practical: 0 },
        },
        {
          Maths: { theory: 10, practical: 0 },
          Science: { theory: 7, practical: 3 },
          English: { theory: 10, practical: 0 },
        },
      ],
    },
    "Mid Term": {
      unitsCount: 1,
      units: [
        {
          Maths: { theory: 80, practical: 20 },
          Science: { theory: 70, practical: 30 },
          English: { theory: 80, practical: 0 },
        },
      ],
    },
    "Final Exam": {
      unitsCount: 1,
      units: [
        {
          Maths: { theory: 100, practical: 0 },
          Science: { theory: 70, practical: 30 },
          English: { theory: 100, practical: 0 },
        },
      ],
    },
  });

  const [configLocked, setConfigLocked] = useState({
    "Unit Test 1": false,
    "Mid Term": true,
    "Final Exam": true,
  });

  // Update Units Count only for Unit Test term
  const updateUnitsCount = (term, count) => {
    if (configLocked[term] || term !== "Unit Test 1") return;
    setTermConfig((prev) => {
      const oldUnits = prev[term].units;
      let newUnits = [...oldUnits];
      if (count > oldUnits.length) {
        for (let i = oldUnits.length; i < count; i++) {
          newUnits.push(
            SUBJECTS.reduce((acc, sub) => {
              acc[sub] = { theory: 0, practical: 0 };
              return acc;
            }, {})
          );
        }
      } else if (count < oldUnits.length) {
        newUnits = newUnits.slice(0, count);
      }
      return {
        ...prev,
        [term]: {
          ...prev[term],
          unitsCount: count,
          units: newUnits,
        },
      };
    });
  };

  // Update Unit Config values
  const updateUnitConfig = (term, unitIndex, subject, type, value) => {
    if (configLocked[term]) return;
    setTermConfig((prev) => {
      const termData = prev[term];
      const units = [...termData.units];
      const unit = { ...units[unitIndex] };
      unit[subject] = { ...unit[subject], [type]: Number(value) };
      units[unitIndex] = unit;
      return {
        ...prev,
        [term]: { ...termData, units },
      };
    });
  };

  // Update student marks per unit
  const updateMark = (roll, term, unitIndex, subject, type, value) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.roll !== roll) return s;

        const termMarks = s.marks[term] || [];

        // Ensure array length equals unitsCount
        const unitsMarks = [...termMarks];
        while (unitsMarks.length < termConfig[term].unitsCount) {
          unitsMarks.push(
            SUBJECTS.reduce((acc, sub) => {
              acc[sub] = { theory: 0, practical: 0 };
              return acc;
            }, {})
          );
        }

        const unitMarks = { ...unitsMarks[unitIndex] };
        const subjectMarks = { ...unitMarks[subject] };
        subjectMarks[type] = Number(value);
        unitMarks[subject] = subjectMarks;
        unitsMarks[unitIndex] = unitMarks;

        return {
          ...s,
          marks: { ...s.marks, [term]: unitsMarks },
        };
      })
    );
  };

  const calculatedStudents = useMemo(() => {
    return students.map((s) => {
      let obtained = 0,
        max = 0,
        failedSubjects = [];

      const termData = termConfig[selectedTerm];
      const studentTermMarks = s.marks[selectedTerm] || [];

      SUBJECTS.forEach((sub) => {
        let subObt = 0,
          subMax = 0;

        for (let i = 0; i < termData.unitsCount; i++) {
          const conf = termData.units[i];
          const m = studentTermMarks[i]?.[sub] || { theory: 0, practical: 0 };

          subObt += m.theory + m.practical;
          subMax += conf[sub].theory + conf[sub].practical;
        }

        obtained += subObt;
        max += subMax;

        if (subObt < subMax * 0.33) failedSubjects.push(sub);
      });

      const percent = max ? (obtained / max) * 100 : 0;

      return {
        ...s,
        obtained,
        max,
        percent,
        grade: gradeFromPercent(percent),
        result: failedSubjects.length ? "Fail" : "Pass",
        failedSubjects,
      };
    });
  }, [students, selectedTerm, termConfig]);

  const summary = useMemo(() => {
    let pass = 0,
      fail = 0,
      totalPercent = 0,
      topper = null,
      lowest = null;

    calculatedStudents.forEach((s) => {
      totalPercent += s.percent;
      s.result === "Pass" ? pass++ : fail++;

      if (!topper || s.percent > topper.percent) topper = s;
      if (!lowest || s.percent < lowest.percent) lowest = s;
    });

    return {
      total: calculatedStudents.length,
      pass,
      fail,
      avg: calculatedStudents.length
        ? totalPercent / calculatedStudents.length
        : 0,
      topper,
      lowest,
    };
  }, [calculatedStudents]);

  const failureAnalysis = useMemo(() => {
    const obj = {};
    SUBJECTS.forEach((s) => (obj[s] = 0));

    calculatedStudents.forEach((s) => {
      s.failedSubjects.forEach((sub) => obj[sub]++);
    });

    return obj;
  }, [calculatedStudents]);

  const saveConfig = () => {
    setConfigLocked((prev) => ({ ...prev, [selectedTerm]: true }));
    alert(`Assessment configuration saved for ${selectedTerm}`);
  };

  const toggleLock = () => {
    setConfigLocked((prev) => ({
      ...prev,
      [selectedTerm]: !prev[selectedTerm],
    }));
  };

  return (
    <div className="p-0 m-0  min-h-screen">
      {/* HEADER */}
     

      {/* SUMMARY - simple clean colors, top */}
       <div className="bg-white border rounded mb-4 p-4">
      <div className="grid grid-cols-3 gap-4 ">
        <SummaryCard title="Total Students" value={summary.total} color="bg-gray-300" />
        <SummaryCard title="Passed" value={summary.pass} color="bg-green-300" />
        <SummaryCard title="Failed" value={summary.fail} color="bg-red-300" />
        <SummaryCard title="Class Avg %" value={summary.avg.toFixed(1)} color="bg-indigo-300" />
        <SummaryCard title="Topper" value={summary.topper?.name || "-"} color="bg-yellow-300" />
        <SummaryCard title="Lowest" value={summary.lowest?.name || "-"} color="bg-pink-300" />
      </div></div>
 <div className="mb-4 flex justify-start">
    <select
      value={selectedTerm}
      onChange={(e) => setSelectedTerm(e.target.value)}
      className="border rounded px-4 py-2   font-semibold shadow-sm"
    >
      {Object.keys(termConfig).map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>
  </div>
      {/* CONFIGURATION */}
      <div className="bg-white border mb-4 rounded p-4">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">Assessment Configuration</h3>

    <div className="flex items-center gap-2">
      <button
        onClick={toggleLock}
        className="flex items-center gap-2 px-3 py-1 rounded border"
        title={configLocked[selectedTerm] ? "Unlock Configuration" : "Lock Configuration"}
      >
        {configLocked[selectedTerm] ? (
          <FiLock className="text-gray-500" />
        ) : (
          <FiSave />
        )}
        {configLocked[selectedTerm] ? " Locked" : " Unlocked"}
      </button>

      {!configLocked[selectedTerm] && (
        <button
          onClick={saveConfig}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded"
        >
          <FiSave /> Save
        </button>
      )}
    </div>
  </div>

  {/* ADD MAX MARKS SUMMARY HERE */}
  <div className="text-sm text-gray-700 font-semibold mt-2">
    Max Marks:{" "}
    {(() => {
      let totalTheory = 0;
      let totalPractical = 0;

      termConfig[selectedTerm].units.forEach((unit) => {
        SUBJECTS.forEach((sub) => {
          totalTheory += unit[sub].theory;
          totalPractical += unit[sub].practical;
        });
      });

      const total = totalTheory + totalPractical;
      return `${total} (Theory: ${totalTheory}, Practical: ${totalPractical})`;
    })()}
  </div>

        {/* Show units count selector only for "Unit Test 1" term */}
        {selectedTerm === "Unit Test 1" && (
          <div className="mb-3">
            <label className="font-medium">
              Set number of unit exams for the year:{" "}
              <select
                disabled={configLocked[selectedTerm]}
                value={termConfig[selectedTerm].unitsCount}
                onChange={(e) => updateUnitsCount(selectedTerm, Number(e.target.value))}
                className="border rounded px-2 py-1 ml-2"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Show unit-wise config ONLY when unlocked */}
        {!configLocked[selectedTerm] ? (
  termConfig[selectedTerm].units.map((unit, unitIndex) => (
    <div key={unitIndex} className="mb-4 border rounded p-3 bg-gray-50">
      <h4 className="font-semibold mb-2">
        {selectedTerm === "Unit Test 1" ? `Unit ${unitIndex + 1}` : selectedTerm} Max Marks
      </h4>
         

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Theory Max</th>
                    <th className="border p-2">Practical Max</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((sub) => (
                    <tr key={sub}>
                      <td className="border p-2">{sub}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          disabled={configLocked[selectedTerm]}
                          value={unit[sub].theory}
                          onChange={(e) =>
                            updateUnitConfig(
                              selectedTerm,
                              unitIndex,
                              sub,
                              "theory",
                              e.target.value
                            )
                          }
                          className="border px-2 w-20"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          disabled={configLocked[selectedTerm]}
                          value={unit[sub].practical}
                          onChange={(e) =>
                            updateUnitConfig(
                              selectedTerm,
                              unitIndex,
                              sub,
                              "practical",
                              e.target.value
                            )
                          }
                          className="border px-2 w-20"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          // SHOW MAX MARKS SUMMARY WHEN LOCKED
          <div>
            {termConfig[selectedTerm].units.map((unit, idx) => (
              <div
                key={idx}
                className="mb-2 p-2 bg-gray-100 rounded border flex justify-between"
              >
                <div className="font-semibold">Unit {idx + 1}</div>
                <div className="flex gap-4">
                  {SUBJECTS.map((sub) => (
                    <div key={sub} className="text-sm">
                      <div>{sub}</div>
                      <div>
                        T: {unit[sub].theory} / P: {unit[sub].practical}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STUDENTS TABLE */}
      <div className="bg-white border rounded p-3 mb-4 overflow-auto">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold">Students Marks (Editable)</h3>
          <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded">
            <FiDownload /> Export
          </button>
        </div>

        <table className="w-full text-sm border">
         {/* TABLE HEAD */}
<thead className="bg-gray-100">
  <tr>
    <th className="border p-2" rowSpan={2}>Roll</th>
    <th className="border p-2" rowSpan={2}>Name</th>

    {SUBJECTS.map((sub) => (
      <th key={sub} className="border p-2 text-center">
        <div className="font-semibold">{sub}</div>
        <div className="grid grid-cols-2 text-xs text-gray-600 mt-1">
          <div>Theory</div>
          <div>Practical</div>
        </div>
        <div className="grid grid-cols-2 text-xs text-gray-500">
          <div>{termConfig[selectedTerm].units[0][sub].theory}</div>
          <div>{termConfig[selectedTerm].units[0][sub].practical}</div>
        </div>
      </th>
    ))}

    <th className="border p-2" rowSpan={2}>Total</th>
    <th className="border p-2" rowSpan={2}>%</th>
    <th className="border p-2" rowSpan={2}>Grade</th>
    <th className="border p-2" rowSpan={2}>Result</th>
    <th className="border p-2" rowSpan={2}>Recheck</th>
    <th className="border p-2" rowSpan={2}>Remarks</th>
  </tr>
</thead>

{/* TABLE BODY */}
<tbody>
  {calculatedStudents.map((s) => (
    <tr key={s.roll}>
      <td className="border p-2">{s.roll}</td>
      <td className="border p-2">{s.name}</td>

      {SUBJECTS.map((sub) => (
        <td key={sub} className="border p-1 text-xs">
          {[...Array(termConfig[selectedTerm].unitsCount)].map((_, i) => (
            <div key={i} className="mb-1 grid grid-cols-2 gap-1 items-center">
              <div>
                <input
                  type="number"
                  value={s.marks[selectedTerm]?.[i]?.[sub]?.theory || 0}
                  onChange={(e) =>
                    updateMark(s.roll, selectedTerm, i, sub, "theory", e.target.value)
                  }
                  className="border w-full px-1"
                  max={termConfig[selectedTerm].units[i][sub].theory}
                  placeholder="Theory"
                />
              </div>
              <div>
                {termConfig[selectedTerm].units[i][sub].practical > 0 && (
                  <input
                    type="number"
                    value={s.marks[selectedTerm]?.[i]?.[sub]?.practical || 0}
                    onChange={(e) =>
                      updateMark(s.roll, selectedTerm, i, sub, "practical", e.target.value)
                    }
                    className="border w-full px-1"
                    max={termConfig[selectedTerm].units[i][sub].practical}
                    placeholder="Practical"
                  />
                )}
              </div>
            </div>
          ))}
        </td>
      ))}

      <td className="border p-2">
        {s.obtained}/{s.max}
      </td>
      <td className="border p-2">{s.percent.toFixed(1)}</td>
      <td className="border p-2 font-semibold">{s.grade}</td>
      <td
        className={`border p-2 font-semibold ${
          s.result === "Pass" ? "text-green-600" : "text-red-600"
        }`}
      >
        {s.result}
      </td>

      <td className="border p-2 text-center">
        <FiRefreshCcw
          className={`cursor-pointer ${s.recheck ? "text-red-600" : "text-gray-400"}`}
        />
      </td>

      <td className="border p-1">
        <input
          className="border px-2 w-full"
          placeholder="Remarks"
          value={s.remarks}
          onChange={(e) =>
            setStudents((prev) =>
              prev.map((st) =>
                st.roll === s.roll ? { ...st, remarks: e.target.value } : st
              )
            )
          }
        />
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* FAILURE ANALYSIS */}
      <div className="bg-white border rounded p-3">
        <h3 className="font-semibold mb-2">Failure Analysis</h3>
        <ul className="text-sm space-y-1">
          {Object.entries(failureAnalysis).map(([s, c]) => (
            <li key={s}>
              {s} → {c} students failed
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} text-white border rounded p-3 text-center`}>
      <div className="text-xs opacity-90">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
