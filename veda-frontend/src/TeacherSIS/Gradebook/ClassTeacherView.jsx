import React, { useMemo, useState, useEffect } from "react";
import { FiDownload, FiSave, FiLock, FiRefreshCcw } from "react-icons/fi";
import gradebookAPI from "../../services/gradebookAPI";
import classAPI from "../../services/classAPI";
import { getSubjects } from "../../services/subjectAPI";

const gradeFromPercent = (p) => {
  if (p >= 90) return "A+";
  if (p >= 75) return "A";
  if (p >= 60) return "B";
  if (p >= 45) return "C";
  if (p >= 33) return "D";
  return "F";
};

export default function ClassTeacherView() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("Unit Exam");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [configLocked, setConfigLocked] = useState(true);

  const academicYear = "2025-26";
  const TERMS = ["Unit Exam", "Mid Term", "Final Exam"];

  // Default Max Marks Config (Ideally should come from backend)
  const [termConfig, setTermConfig] = useState({
    "Unit Exam": {
      unitsCount: 3,
      units: [
        { theory: 10, practical: 0 },
        { theory: 12, practical: 0 },
        { theory: 15, practical: 0 },
      ],
    },
    "Mid Term": {
      unitsCount: 1,
      units: [{ theory: 20, practical: 5 }],
    },
    "Final Exam": {
      unitsCount: 1,
      units: [{ theory: 30, practical: 0 }],
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classRes = await classAPI.getAllClasses();
        const subjectRes = await getSubjects();
        
        if (classRes.success) setClasses(classRes.data);
        if (subjectRes.success) setSubjects(subjectRes.data);

        if (classRes.data?.[0]) {
          setSelectedClassId(classRes.data[0]._id);
          if (classRes.data[0].sections?.[0]) {
            setSelectedSectionId(classRes.data[0].sections[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedSectionId && selectedTerm) {
      fetchConsolidatedMarks();
    }
  }, [selectedClassId, selectedSectionId, selectedTerm]);

  const fetchConsolidatedMarks = async () => {
    setLoading(true);
    try {
      const cls = classes.find(c => c._id === selectedClassId);
      const sec = cls?.sections.find(s => s._id === selectedSectionId);
      if (!cls || !sec) return;

      // 1. Fetch Students
      const studentRes = await gradebookAPI.getStudents({ 
        className: cls.name, 
        sectionName: sec.name 
      });

      // 2. Fetch Marks for all subjects
      const marksRes = await gradebookAPI.getMarks({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        academicYear,
        term: selectedTerm
      });

      // Group marks by student
      const studentList = studentRes.students.map(s => {
        const studentMarks = {};
        subjects.forEach(subj => {
          const entry = marksRes.marks?.find(m => 
            (m.student?._id === s._id || m.student === s._id) && 
            (m.subject?._id === subj._id || m.subject === subj._id)
          );
          studentMarks[subj.subjectName] = entry ? entry.marks : [];
        });

        return {
          _id: s._id,
          roll: s.personalInfo.rollNo,
          name: s.personalInfo.name,
          marks: studentMarks
        };
      });

      setStudents(studentList);
    } catch (error) {
      console.error("Error fetching consolidated marks:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatedStudents = useMemo(() => {
    const currentTermConfig = termConfig[selectedTerm];
    
    return students.map((s) => {
      let totalObtained = 0;
      let totalMax = 0;
      let failedSubjects = [];

      subjects.forEach((subj) => {
        let subObt = 0;
        let subMax = 0;

        for (let i = 0; i < currentTermConfig.unitsCount; i++) {
          const conf = currentTermConfig.units[i] || { theory: 0, practical: 0 };
          const mark = s.marks[subj.subjectName]?.find(m => m.unitIndex === i) || { theory: 0, practical: 0 };
          
          subObt += (mark.theory || 0) + (mark.practical || 0);
          subMax += (conf.theory || 0) + (conf.practical || 0);
        }

        totalObtained += subObt;
        totalMax += subMax;

        if (subMax > 0 && subObt < subMax * 0.33) {
          failedSubjects.push(subj.subjectName);
        }
      });

      const percent = totalMax ? (totalObtained / totalMax) * 100 : 0;

      return {
        ...s,
        obtained: totalObtained,
        max: totalMax,
        percent,
        grade: gradeFromPercent(percent),
        result: failedSubjects.length ? "Fail" : "Pass",
        failedSubjects,
      };
    });
  }, [students, selectedTerm, subjects, termConfig]);

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
      avg: calculatedStudents.length ? totalPercent / calculatedStudents.length : 0,
      topper,
      lowest,
    };
  }, [calculatedStudents]);

  const exportCSV = () => {
    let headers = "Roll,Name";
    subjects.forEach(s => headers += `,${s.subjectName}`);
    headers += ",Total,%,Grade,Result\n";

    let csv = headers;
    calculatedStudents.forEach((s) => {
      let row = `${s.roll},${s.name}`;
      subjects.forEach(subj => {
        let subObt = 0;
        const currentTermConfig = termConfig[selectedTerm];
        for (let i = 0; i < currentTermConfig.unitsCount; i++) {
          const mark = s.marks[subj.subjectName]?.find(m => m.unitIndex === i) || { theory: 0, practical: 0 };
          subObt += (mark.theory || 0) + (mark.practical || 0);
        }
        row += `,${subObt}`;
      });
      row += `,${s.obtained},${s.percent.toFixed(1)},${s.grade},${s.result}\n`;
      csv += row;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const clsName = classes.find(c => c._id === selectedClassId)?.name || "Class";
    a.download = `Consolidated-${clsName}-${selectedTerm}.csv`;
    a.click();
  };

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* FILTERS */}
      <div className="bg-white p-4 border rounded mb-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              const cls = classes.find(c => c._id === e.target.value);
              if (cls?.sections?.[0]) setSelectedSectionId(cls.sections[0]._id);
            }}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
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
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {classes.find(c => c._id === selectedClassId)?.sections.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Term</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchConsolidatedMarks}
          className="mt-5 p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
          title="Refresh Data"
        >
          <FiRefreshCcw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="bg-white border rounded mb-4 p-4 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SummaryCard title="Total Students" value={summary.total} color="bg-blue-600" />
          <SummaryCard title="Passed" value={summary.pass} color="bg-green-600" />
          <SummaryCard title="Failed" value={summary.fail} color="bg-red-600" />
          <SummaryCard title="Class Avg %" value={summary.avg.toFixed(1)} color="bg-indigo-600" />
          <SummaryCard title="Topper" value={summary.topper?.name || "-"} color="bg-yellow-500" />
          <SummaryCard title="Lowest" value={summary.lowest?.name || "-"} color="bg-pink-600" />
        </div>
      </div>

      {/* STUDENTS TABLE */}
      <div className="bg-white border rounded p-4 mb-4 overflow-auto shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Consolidated Performance – {selectedTerm}</h3>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow-sm"
          >
            <FiDownload /> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading academic records...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No records found for the selected criteria.</div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left font-bold text-gray-600">Roll</th>
                <th className="border p-3 text-left font-bold text-gray-600">Name</th>
                {subjects.map((sub) => (
                  <th key={sub._id} className="border p-3 text-center font-bold text-gray-600">
                    {sub.subjectName}
                  </th>
                ))}
                <th className="border p-3 text-center font-bold text-gray-600">Total</th>
                <th className="border p-3 text-center font-bold text-gray-600">%</th>
                <th className="border p-3 text-center font-bold text-gray-600">Grade</th>
                <th className="border p-3 text-center font-bold text-gray-600">Result</th>
              </tr>
            </thead>

            <tbody>
              {calculatedStudents.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition border-b">
                  <td className="border-x p-3 text-gray-600 font-medium">{s.roll}</td>
                  <td className="border-x p-3 font-semibold text-gray-800">{s.name}</td>
                  {subjects.map((subj) => {
                    let subObt = 0;
                    let subMax = 0;
                    const currentTermConfig = termConfig[selectedTerm];
                    for (let i = 0; i < currentTermConfig.unitsCount; i++) {
                      const conf = currentTermConfig.units[i] || { theory: 0, practical: 0 };
                      const mark = s.marks[subj.subjectName]?.find(m => m.unitIndex === i) || { theory: 0, practical: 0 };
                      subObt += (mark.theory || 0) + (mark.practical || 0);
                      subMax += (conf.theory || 0) + (conf.practical || 0);
                    }
                    const isFail = subMax > 0 && subObt < subMax * 0.33;
                    return (
                      <td key={subj._id} className={`border-x p-3 text-center font-medium ${isFail ? 'text-red-500 bg-red-50' : 'text-gray-700'}`}>
                        {subObt}/{subMax}
                      </td>
                    );
                  })}
                  <td className="border-x p-3 text-center font-bold text-indigo-700">{s.obtained}/{s.max}</td>
                  <td className="border-x p-3 text-center font-bold text-gray-800">{s.percent.toFixed(1)}%</td>
                  <td className="border-x p-3 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      s.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                      s.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                      s.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {s.grade}
                    </span>
                  </td>
                  <td className={`border-x p-3 text-center font-bold ${s.result === "Pass" ? "text-green-600" : "text-red-600"}`}>
                    {s.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADDITIONAL ANALYSIS */}
      {!loading && students.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border rounded p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Subject-wise Failure Analysis</h3>
            <div className="space-y-3">
              {subjects.map(subj => {
                const failCount = calculatedStudents.filter(s => s.failedSubjects.includes(subj.subjectName)).length;
                const failPercent = calculatedStudents.length ? (failCount / calculatedStudents.length) * 100 : 0;
                return (
                  <div key={subj._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">{subj.subjectName}</span>
                      <span className="text-red-600 font-bold">{failCount} Students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${failPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border rounded p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Top Performers</h3>
            <div className="space-y-4">
              {calculatedStudents
                .sort((a, b) => b.percent - a.percent)
                .slice(0, 3)
                .map((s, idx) => (
                  <div key={s._id} className="flex items-center gap-4 p-2 rounded hover:bg-gray-50 transition">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white ${
                      idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{s.name}</div>
                      <div className="text-xs text-gray-500">Roll: {s.roll} | Grade: {s.grade}</div>
                    </div>
                    <div className="ml-auto font-black text-indigo-600">{s.percent.toFixed(1)}%</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  return (
    <div className={`${color} text-white border rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition`}>
      <div className="text-[10px] font-black uppercase tracking-tighter opacity-80 mb-1">{title}</div>
      <div className="text-xl font-black truncate">{value}</div>
    </div>
  );
}
