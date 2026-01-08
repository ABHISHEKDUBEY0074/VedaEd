import React, { useState, useMemo } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";

export default function VacancySetup() {
  const [form, setForm] = useState({
    academicYear: "",
    className: "",
    totalSeats: "",
    reservedSeats: "",
    startDate: "",
    endDate: "",
  });

  const [vacancies, setVacancies] = useState([]);
  const [filters, setFilters] = useState({
    academicYear: "",
    className: "",
  });

  /* ================= ADD VACANCY ================= */
  const handleAddVacancy = (e) => {
    e.preventDefault();

    if (
      !form.academicYear ||
      !form.className ||
      !form.totalSeats
    ) {
      alert("Please fill required fields");
      return;
    }

    setVacancies([
      ...vacancies,
      {
        ...form,
        id: Date.now(),
        availableSeats:
          Number(form.totalSeats) -
          Number(form.reservedSeats || 0),
      },
    ]);

    setForm({
      academicYear: "",
      className: "",
      totalSeats: "",
      reservedSeats: "",
      startDate: "",
      endDate: "",
    });
  };

  /* ================= FILTER ================= */
  const filteredVacancies = useMemo(() => {
    return vacancies.filter((v) => {
      return (
        (!filters.academicYear ||
          v.academicYear
            .toLowerCase()
            .includes(filters.academicYear.toLowerCase())) &&
        (!filters.className ||
          v.className === filters.className)
      );
    });
  }, [vacancies, filters]);

  return (
    <div className="p-0 min-h-screen">
        <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span>
        <span>&gt;</span>
        <span>Vacancy Setup</span>
      </div>
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold">
          Vacancy Setup
        </h2>
       
      </div>

      {/* ADD VACANCY */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-3">
        <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
          Add Vacancy
        </h3>

        <form
          onSubmit={handleAddVacancy}
          className="grid grid-cols-3 gap-4"
        >
          {/* Academic Year */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Academic Year
            </label>
            <input
              type="text"
              placeholder="e.g. 2025 to 2026"
              value={form.academicYear}
              onChange={(e) =>
                setForm({
                  ...form,
                  academicYear: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Class */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Class
            </label>
            <select
              value={form.className}
              onChange={(e) =>
                setForm({
                  ...form,
                  className: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Class</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
            </select>
          </div>

          {/* Total Seats */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Total Seats
            </label>
            <input
              type="number"
              value={form.totalSeats}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalSeats: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Reserved Seats */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Reserved Seats
            </label>
            <input
              type="number"
              value={form.reservedSeats}
              onChange={(e) =>
                setForm({
                  ...form,
                  reservedSeats: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Application Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              Application End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="col-span-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Save Vacancy
            </button>
          </div>
        </form>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg  shadow-sm border mb-3">
      

        <div className="grid grid-cols-2 mb-3 gap-4">
          <div className="flex flex-col gap-1">
           
            <input
              type="text"
              placeholder="Search academic year"
              value={filters.academicYear}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  academicYear: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
           
            <select
              value={filters.className}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  className: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Classes</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
            </select>
          </div>
        </div>
      

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-3">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Academic Year</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-left">Total Seats</th>
              <th className="p-3 text-left">Reserved</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredVacancies.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No vacancy defined
                </td>
              </tr>
            ) : (
              filteredVacancies.map((v) => (
                <tr
                  key={v.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {v.academicYear}
                  </td>
                  <td className="p-3">{v.className}</td>
                  <td className="p-3">{v.totalSeats}</td>
                  <td className="p-3">
                    {v.reservedSeats || 0}
                  </td>
                  <td className="p-3 font-medium">
                    {v.availableSeats}
                  </td>
                  <td className="p-3">
                    {v.startDate} → {v.endDate}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
