import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const CollectFees = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    class: "Class 1",
    section: "A",
    keyword: "",
  });

  const [students, setStudents] = useState([]);

  // 🔥 Dummy Data (Search ke baad load hoga)
  const dummyData = [
    {
      id: 10024,
      class: "Class 1",
      section: "A",
      name: "Steven Taylor",
      father: "Jason Taylor",
      dob: "08/17/2017",
      mobile: "890567345",
    },
    {
      id: 120020,
      class: "Class 1",
      section: "A",
      name: "Ashwani Kumar",
      father: "Arjun Kumar",
      dob: "09/25/2009",
      mobile: "980678463",
    },
    {
      id: 125005,
      class: "Class 1",
      section: "A",
      name: "Nehal Wadhera",
      father: "Karun wadhera",
      dob: "11/23/2006",
      mobile: "890786784",
    },
  ];

  const handleSearch = () => {
    setStudents(dummyData);
  };

  return (
    <div className="p-0 min-h-screen">
        {/* Breadcrumb */}
              <div className="text-gray-500 text-sm mb-2 flex gap-1">
                <span>Admin Fees</span> &gt; <span>Collect Fees</span>
              </div>
        
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Collect Fees</h2>
            
              </div>
        
              {/* Tabs */}
              <div className="flex gap-6 text-sm mb-4 border-b">
                <button className="pb-2 text-blue-600 font-semibold border-b-2 border-blue-600">
                  Overview
                </button>
              </div>
      {/* 🔹 Select Criteria */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Criteria</h2>

        <div className="grid grid-cols-3 gap-4">
          <select
            className="border p-2 rounded"
            value={filters.class}
            onChange={(e) =>
              setFilters({ ...filters, class: e.target.value })
            }
          >
            <option>Class 1</option>
            <option>Class 2</option>
          </select>

          <select
            className="border p-2 rounded"
            value={filters.section}
            onChange={(e) =>
              setFilters({ ...filters, section: e.target.value })
            }
          >
            <option>A</option>
            <option>B</option>
          </select>

        ** <input
            type="text"
            placeholder="Search By Student Name, Roll Number..."
            className="border p-2 rounded"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiSearch /> Search
          </button>
        </div>
      </div>

      {/* 🔹 Student List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Student List</h2>

        {students.length === 0 ? (
          <p className="text-center text-gray-400">
            No data available in table
          </p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Class</th>
                <th className="p-2">Section</th>
                <th className="p-2">Admission No</th>
                <th className="p-2">Student Name</th>
                <th className="p-2">Father Name</th>
                <th className="p-2">Date Of Birth</th>
                <th className="p-2">Mobile No.</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.class}</td>
                  <td className="p-2">{item.section}</td>
                  <td className="p-2">{item.id}</td>

                  {/* 🔥 clickable name */}
                  <td
                    className="p-2 text-blue-600 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/collect-fees/${item.id}`, {
                        state: item,
                      })
                    }
                  >
                    {item.name}
                  </td>

                  <td className="p-2">{item.father}</td>
                  <td className="p-2">{item.dob}</td>
                  <td className="p-2">{item.mobile}</td>

                  <td className="p-2 text-center">
                  <button
  onClick={() =>
    navigate(`/admin/fees/collect-fees/${item.id}`, {
      state: item,
    })
  }
  className="bg-blue-500 text-white px-3 py-1 rounded"
>
  Collect Fees
</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CollectFees;