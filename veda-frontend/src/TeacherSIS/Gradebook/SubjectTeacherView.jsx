import React, { useMemo, useState, useEffect } from "react";
import { FiDownload, FiLock, FiSave, FiRefreshCw } from "react-icons/fi";
import gradebookAPI from "../../services/gradebookAPI";
import classAPI from "../../services/classAPI";
import { getSubjects } from "../../services/subjectAPI";

/* ====== CLASS TEACHER CONFIG (READ ONLY) ====== */
const CLASS_TEACHER_CONFIG = {
  "Unit Exam": {
    unitsCount: 3,
    units: [
      { defaultMax: { theory: 10, practical: 0 } },
      { defaultMax: { theory: 12, practical: 0 } },
      { defaultMax: { theory: 15, practical: 0 } },
    ],
  },
  "Mid Term": {
    unitsCount: 1,
    units: [{ defaultMax: { theory: 20, practical: 5 } }],
  },
  "Final Exam": {
    unitsCount: 1,
    units: [{ defaultMax: { theory: 30, practical: 0 } }],
  },
};

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

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [students, setStudents] = useState([]);
  const [finalSaved, setFinalSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const academicYear = "2025-26"; // Should come from a global config

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classRes = await classAPI.getAllClasses();
        const subjectRes = await getSubjects();
        
        if (classRes.success) setClasses(classRes.data);
        if (subjectRes.success) setSubjects(subjectRes.data);

        // Set initial selections if available
        if (classRes.data?.[0]) {
          setSelectedClassId(classRes.data[0]._id);
          if (classRes.data[0].sections?.[0]) {
            setSelectedSectionId(classRes.data[0].sections[0]._id);
          }
        }
        if (subjectRes.data?.[0]) {
          setSelectedSubjectId(subjectRes.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch students and marks when filters change
  useEffect(() => {
    if (selectedClassId && selectedSectionId && selectedSubjectId && selectedTerm) {
      fetchStudentsAndMarks();
    }
  }, [selectedClassId, selectedSectionId, setSelectedSubjectId, selectedTerm]);

  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    try {
      // Find class and section names for student fetch (as per our gradebookController)
      const cls = classes.find(c => c._id === selectedClassId);
      const sec = cls?.sections.find(s => s._id === selectedSectionId);

      if (!cls || !sec) return;

      // 1. Fetch Students
      const studentRes = await gradebookAPI.getStudents({ 
        className: cls.name, 
        sectionName: sec.name 
      });

      // 2. Fetch Existing Marks
      const marksRes = await gradebookAPI.getMarks({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: selectedSubjectId,
        academicYear,
        term: selectedTerm
      });

      const studentList = studentRes.students.map(s => {
        // Find marks for this student
        const studentMarkEntry = marksRes.marks?.find(m => m.student?._id === s._id || m.student === s._id);
        
        return {
          _id: s._id,
          roll: s.personalInfo.rollNo,
          name: s.personalInfo.name,
          marks: studentMarkEntry ? studentMarkEntry.marks : [],
          isLocked: studentMarkEntry ? studentMarkEntry.isLocked : false
        };
      });

      setStudents(studentList);
      
      // If any entry is locked, set finalSaved to true to disable editing
      const isAnyLocked = studentList.some(s => s.isLocked);
      setFinalSaved(isAnyLocked);

    } catch (error) {
      console.error("Error fetching students and marks:", error);
    } finally {
      setLoading(false);
    }
  };

  const termConfig = CLASS_TEACHER_CONFIG[selectedTerm];

  // Update marks in local state
  const updateMark = (studentId, unitIndex, type, value) => {
    if (finalSaved) return;
    
    // Get max marks for this exam type and unit
    const conf = termConfig.units[unitIndex]?.defaultMax || { theory: 100, practical: 100 };
    const maxValue = conf[type];
    const safeValue = Math.min(Math.max(Number(value), 0), maxValue);

    setStudents((prev) =>
      prev.map((s) => {
        if (s._id !== studentId) return s;
        const updatedMarks = [...s.marks];
        
        // Ensure unit entry exists
        if (!updatedMarks[unitIndex]) {
          updatedMarks[unitIndex] = { unitIndex, theory: 0, practical: 0 };
        }
        
        updatedMarks[unitIndex][type] = safeValue;
        return { ...s, marks: updatedMarks };
      })
    );
  };

  // Calculated students for display
  const calculatedStudents = useMemo(() => {
    return students.map((s) => {
      let obtained = 0,
        max = 0;
      for (let i = 0; i < termConfig.unitsCount; i++) {
        const conf = termConfig.units[i]?.defaultMax || { theory: 0, practical: 0 };
        const mark = s.marks?.find(m => m.unitIndex === i) || { theory: 0, practical: 0 };
        obtained += (mark.theory || 0) + (mark.practical || 0);
        max += (conf.theory || 0) + (conf.practical || 0);
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
  }, [students, selectedTerm]);

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

  const handleSave = async (lock = false) => {
    setSaving(true);
    try {
      const studentMarks = students.map(s => ({
        studentId: s._id,
        marks: s.marks
      }));

      await gradebookAPI.saveMarks({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: selectedSubjectId,
        academicYear,
        term: selectedTerm,
        studentMarks,
        isLocked: lock
      });

      if (lock) setFinalSaved(true);
      alert(lock ? "Marks Locked & Saved!" : "Marks Saved Successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks");
    } finally {
      setSaving(false);
    }
  };

  const failedStudents = useMemo(() => {
    return calculatedStudents.filter((s) => s.result === "Fail");
  }, [calculatedStudents]);

  const exportCSV = () => {
    let csv = "Roll,Name,Obtained,Max,Percent,Grade,Result\n";
    calculatedStudents.forEach((s) => {
      csv += `${s.roll},${s.name},${s.obtained},${s.max},${s.percent.toFixed(1)},${s.grade},${s.result}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const cls = classes.find(c => c._id === selectedClassId)?.name || "Class";
    a.download = `${cls}-${selectedTerm}.csv`;
    a.click();
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* FILTERS */}
      <div className="bg-white p-4 border rounded mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              const cls = classes.find(c => c._id === e.target.value);
              if (cls?.sections?.[0]) setSelectedSectionId(cls.sections[0]._id);
            }}
            className="border px-3 py-2 rounded"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {classes.find(c => c._id === selectedClassId)?.sections.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Term</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end h-full mt-5">
           <button 
            onClick={fetchStudentsAndMarks}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200"
            title="Refresh Data"
           >
             <FiRefreshCw className={loading ? "animate-spin" : ""} />
           </button>
        </div>

        {finalSaved && (
          <div className="mt-5 flex items-center gap-2 text-red-600 font-semibold bg-red-50 px-3 py-1 rounded">
            <FiLock /> Locked
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="bg-white p-4 border mb-3 rounded">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Students" value={summary.total} color="bg-blue-50 border-blue-200 text-blue-700" />
          <SummaryCard title="Passed" value={summary.pass} color="bg-green-50 border-green-200 text-green-700" />
          <SummaryCard title="Failed" value={summary.fail} color="bg-red-50 border-red-200 text-red-700" />
          <SummaryCard title="Avg %" value={summary.avg} color="bg-yellow-50 border-yellow-200 text-yellow-700" />
        </div>
      </div>

      {/* MARKS TABLE */}
      <div className="bg-white p-4 border rounded overflow-auto shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">
            {selectedTerm} – {subjects.find(s => s._id === selectedSubjectId)?.subjectName}
          </h3>
          <div className="flex gap-2">
            {!finalSaved && (
              <button
                disabled={saving || loading}
                onClick={() => handleSave(false)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                <FiSave /> {saving ? "Saving..." : "Save Draft"}
              </button>
            )}
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              <FiDownload /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading student data...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No students found for this selection.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-3 text-left font-semibold text-gray-600">Roll</th>
                <th className="border p-3 text-left font-semibold text-gray-600">Name</th>
                {[...Array(termConfig.unitsCount)].map((_, i) => (
                  <th key={i} className="border p-3 text-center font-semibold text-gray-600">
                    Exam {termConfig.unitsCount > 1 ? i + 1 : ""}
                  </th>
                ))}
                <th className="border p-3 text-center font-semibold text-gray-600">Total</th>
                <th className="border p-3 text-center font-semibold text-gray-600">%</th>
                <th className="border p-3 text-center font-semibold text-gray-600">Grade</th>
                <th className="border p-3 text-center font-semibold text-gray-600">Result</th>
              </tr>
            </thead>

            <tbody>
              {calculatedStudents.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="border p-3 text-gray-700">{s.roll}</td>
                  <td className="border p-3 font-medium text-gray-800">{s.name}</td>
                  {[...Array(termConfig.unitsCount)].map((_, i) => {
                    const conf = termConfig.units[i]?.defaultMax || { theory: 100, practical: 0 };
                    const mark = s.marks?.find(m => m.unitIndex === i) || { theory: 0, practical: 0 };
                    return (
                      <td key={i} className="border p-3 min-w-[120px]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
                            <span>Theo ({conf.theory})</span>
                            {conf.practical > 0 && <span>Prac ({conf.practical})</span>}
                          </div>
                          <div className="flex gap-2">
                            <input
                              disabled={finalSaved}
                              type="number"
                              value={mark.theory}
                              onChange={(e) => updateMark(s._id, i, "theory", e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                            {conf.practical > 0 && (
                              <input
                                disabled={finalSaved}
                                type="number"
                                value={mark.practical}
                                onChange={(e) => updateMark(s._id, i, "practical", e.target.value)}
                                className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="border p-3 text-center font-bold text-gray-700">{s.obtained}/{s.max}</td>
                  <td className="border p-3 text-center font-semibold text-gray-700">{s.percent.toFixed(1)}%</td>
                  <td className="border p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      s.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                      s.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                      s.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {s.grade}
                    </span>
                  </td>
                  <td className="border p-3 text-center">
                    <span className={`font-bold ${s.result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                      {s.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!finalSaved && students.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              disabled={saving || loading}
              onClick={() => {
                if(window.confirm("Are you sure? Locking will prevent further edits.")) {
                  handleSave(true);
                }
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition shadow-md disabled:opacity-50"
            >
              Final Save & Lock
            </button>
          </div>
        )}
      </div>

      {/* CONSOLIDATED VIEW ON LOCK */}
      {finalSaved && (
        <div className="mt-6 bg-blue-50 p-6 border border-blue-100 rounded-xl">
          <h3 className="font-bold text-blue-800 text-xl mb-3 flex items-center gap-2">
            <FiLock /> Consolidated View
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-900">
            <div className="space-y-1">
              <p><strong>Status:</strong> Final & Verified</p>
              <p><strong>Subject:</strong> {subjects.find(s => s._id === selectedSubjectId)?.subjectName}</p>
              <p><strong>Average Performance:</strong> {summary.avg}%</p>
            </div>
            <div className="space-y-1">
              <p><strong>Total Students:</strong> {summary.total}</p>
              <p><strong>Pass Count:</strong> {summary.pass}</p>
              <p><strong>Fail Count:</strong> {summary.fail}</p>
            </div>
          </div>

          {failedStudents.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <strong className="text-red-700 block mb-1">Students Requiring Remedial Attention:</strong>
              <div className="flex flex-wrap gap-2">
                {failedStudents.map((s) => (
                  <span key={s._id} className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {s.name} (Roll: {s.roll})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} border rounded-xl p-4 text-center shadow-sm`}>
      <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{title}</div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}
