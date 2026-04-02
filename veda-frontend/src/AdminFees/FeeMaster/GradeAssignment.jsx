import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheck, FiX } from "react-icons/fi";

import config from "../../config";

const API_BASE = `${config.API_BASE_URL}/fees`;

const defaultGrades = ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const format = (val) =>
  val ? `₹${val.toLocaleString()}` : "—";

const GradeFeeAssignment = () => {
  const [year, setYear] = useState("");
  const [years, setYears] = useState([]);
  const [fields, setFields] = useState([]);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const fetchInitialData = async () => {
    try {
      const [yrRes, catRes] = await Promise.all([
        axios.get(`${config.API_BASE_URL}/academic-years`),
        axios.get(`${config.API_BASE_URL}/fee-categories`)
      ]);
      
      const yearsData = yrRes.data || [];
      const catsData = catRes.data || [];
      
      setYears(yearsData);
      setFields(catsData.map(c => c.name));
      
      if (yearsData.length > 0) {
        const active = yearsData.find(y => y.isActive) || yearsData[0];
        setYear(active.label);
      }
    } catch (error) {
      console.log("Error fetching initial data", error);
    }
  };

  const fetchFees = async () => {
    if (!year) return;
    try {
      const res = await axios.get(`${API_BASE}?year=${year}`);
      
      let backendData = Array.isArray(res.data) ? res.data : [];
      
      // Merge backend data with default grades
      const merged = defaultGrades.map(grade => {
        const existing = backendData.find(d => d.grade === grade);
        return existing || { year, grade, fees: {} };
      });
      
      setData(merged);
    } catch (err) {
      console.log("API failed");
      setData(defaultGrades.map(grade => ({ year, grade, fees: {} })));
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFees();
  }, [year, fields]);

  const handleEdit = (rowIndex, field, value) => {
    setEditing({ rowIndex, field });
    setTempValue(value || "");
  };

  // ✅ SAVE (API + safe fallback)
  const handleSave = async () => {
    const { rowIndex, field } = editing;
    const row = data[rowIndex];

    let safeValue = Number(tempValue);

    // 🔒 No negative allowed
    if (safeValue < 0) safeValue = 0;

    try {
      await axios.patch(`${API_BASE}/update`, {
        year,
        grade: row.grade,
        field,
        value: safeValue,
      });
    } catch (err) {
      console.log("API failed, using local update");
    }

    // ✅ Always update UI
    const updated = [...data];
    if (!updated[rowIndex].fees) updated[rowIndex].fees = {};
    
    // If it's a Map from backend, it might look different, but normally it's an object in JS
    if (updated[rowIndex].fees instanceof Map) {
       updated[rowIndex].fees.set(field, safeValue);
    } else {
       updated[rowIndex].fees[field] = safeValue;
    }
    
    setData(updated);

    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue("");
  };

  const getTotal = (row) => {
    if (!row.fees) return 0;
    return fields.reduce((sum, key) => {
      const val = row.fees instanceof Map ? row.fees.get(key) : row.fees[key];
      return sum + (Number(val) || 0);
    }, 0);
  };

  return (
    
    <div className="p-4 bg-white min-h-screen">
        
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Grade Assignment</h2>

        {/* Year Dropdown */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-4 py-2 rounded-lg bg-white shadow-sm"
        >
          {years.map((y) => (
            <option key={y._id} value={y.label}>{y.label}</option>
          ))}
          {years.length === 0 && <option value="">No Active Year</option>}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">GRADE</th>
              {fields.map((f) => (
                <th key={f} className="p-3 capitalize">
                  {f} fee
                </th>
              ))}
              <th className="p-3">TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{row.grade}</td>

                {fields.map((field) => {
                  const isEditing =
                    editing?.rowIndex === rowIndex &&
                    editing?.field === field;

                  return (
                    <td
                      key={field}
                      className="p-3 cursor-pointer"
                      onClick={() => {
                        const currentVal = row.fees instanceof Map ? row.fees.get(field) : row.fees?.[field];
                        !isEditing && handleEdit(rowIndex, field, currentVal);
                      }}
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={tempValue}
                            onChange={(e) => {
                              let val = e.target.value;

                              if (val < 0) val = 0;
                              setTempValue(val);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            className="w-20 border px-2 py-1 rounded"
                          />

                          <FiCheck
                            className="text-green-600 cursor-pointer"
                            onClick={handleSave}
                          />
                          <FiX
                            className="text-red-500 cursor-pointer"
                            onClick={handleCancel}
                          />
                        </div>
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {format(row.fees instanceof Map ? row.fees.get(field) : row.fees?.[field])}
                        </span>
                      )}
                    </td>
                  );
                })}

                <td className="p-3 font-semibold text-blue-700">
                  ₹{getTotal(row).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeFeeAssignment;