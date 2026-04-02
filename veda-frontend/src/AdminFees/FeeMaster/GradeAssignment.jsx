import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiCheck, FiX } from "react-icons/fi";

import config from "../../config";

const API_BASE = `${config.API_BASE_URL}/fees`;

const YEARS = ["2024-25", "2023-24"];



const fields = [
  "tuition",
  "transport",
  "lab",
  "library",
  "sports",
  "exam",
  "development",
];

const format = (val) =>
  val ? `₹${val.toLocaleString()}` : "—";

const GradeFeeAssignment = () => {
  const [year, setYear] = useState("2024-25");
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // ✅ Fetch but fallback to dummy
  const fetchFees = async () => {
    try {
      const res = await axios.get(`${API_BASE}?year=${year}`);

      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log("API failed");
      setData([]);
    }
  };

  useEffect(() => {
    fetchFees();
  }, [year]);

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
    updated[rowIndex][field] = safeValue;
    setData(updated);

    setEditing(null);
  };

  const handleCancel = () => {
    setEditing(null);
    setTempValue("");
  };

  const getTotal = (row) => {
    return fields.reduce((sum, key) => sum + (row[key] || 0), 0);
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
          {YEARS.map((y) => (
            <option key={y}>{y}</option>
          ))}
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
                      onClick={() =>
                        !isEditing &&
                        handleEdit(rowIndex, field, row[field])
                      }
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
                          {format(row[field])}
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