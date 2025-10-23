import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function AdmissionEnquiry() {
  const [enquiries, setEnquiries] = useState([
    {
      id: 1,
      name: "Charlie Barrett",
      phone: "8905674352",
      source: "Google Ads",
      enquiryDate: "10/27/2025",
      lastFollowUpDate: "",
      nextFollowUpDate: "10/30/2025",
      status: "Active",
      class: "Grade 4A",
      email: "charlie.barrett@email.com",
      address: "123 Main St, City",
      notes: "Interested in science program",
    },
    {
      id: 2,
      name: "David Wilson",
      phone: "9067845634",
      source: "Front Office",
      enquiryDate: "10/22/2025",
      lastFollowUpDate: "",
      nextFollowUpDate: "10/25/2025",
      status: "Active",
      class: "Grade 5B",
      email: "david.wilson@email.com",
      address: "456 Oak Ave, Town",
      notes: "Parent visited school",
    },
    {
      id: 3,
      name: "Darren K. Hubbard",
      phone: "0890567376",
      source: "Admission Campaign",
      enquiryDate: "10/16/2025",
      lastFollowUpDate: "",
      nextFollowUpDate: "10/18/2025",
      status: "Active",
      class: "Grade 3A",
      email: "darren.hubbard@email.com",
      address: "789 Pine Rd, Village",
      notes: "Referred by existing parent",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      phone: "9876543210",
      source: "Website",
      enquiryDate: "10/15/2025",
      lastFollowUpDate: "10/17/2025",
      nextFollowUpDate: "10/20/2025",
      status: "Active",
      class: "Grade 6A",
      email: "sarah.johnson@email.com",
      address: "321 Elm St, City",
      notes: "Online enquiry form",
    },
    {
      id: 5,
      name: "Michael Brown",
      phone: "8765432109",
      source: "Social Media",
      enquiryDate: "10/14/2025",
      lastFollowUpDate: "10/16/2025",
      nextFollowUpDate: "10/19/2025",
      status: "Converted",
      class: "Grade 7B",
      email: "michael.brown@email.com",
      address: "654 Maple Dr, Town",
      notes: "Facebook ad campaign",
    },
  ]);

  const [filters, setFilters] = useState({
    class: "",
    source: "",
    enquiryFromDate: "",
    enquiryToDate: "",
    status: "Active",
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("enquiryDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    class: "",
    enquiryDate: "",
    nextFollowUpDate: "",
    address: "",
    notes: "",
    status: "Active",
  });

  const classes = [
    "Grade 1A",
    "Grade 1B",
    "Grade 2A",
    "Grade 2B",
    "Grade 3A",
    "Grade 3B",
    "Grade 4A",
    "Grade 4B",
    "Grade 5A",
    "Grade 5B",
    "Grade 6A",
    "Grade 6B",
    "Grade 7A",
    "Grade 7B",
    "Grade 8A",
    "Grade 8B",
    "Grade 9A",
    "Grade 9B",
    "Grade 10A",
    "Grade 10B",
  ];
  const sources = [
    "Google Ads",
    "Front Office",
    "Admission Campaign",
    "Website",
    "Social Media",
    "Referral",
    "Newspaper",
    "Radio",
    "Other",
  ];
  const statuses = ["Active", "Converted", "Lost", "On Hold"];

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.includes(searchTerm) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.class || enquiry.class === filters.class) &&
      (!filters.source || enquiry.source === filters.source) &&
      (!filters.status || enquiry.status === filters.status) &&
      (!filters.enquiryFromDate ||
        new Date(enquiry.enquiryDate) >= new Date(filters.enquiryFromDate)) &&
      (!filters.enquiryToDate ||
        new Date(enquiry.enquiryDate) <= new Date(filters.enquiryToDate));

    return matchesSearch && matchesFilters;
  });

  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleAddEnquiry = () => {
    const newEnquiry = {
      id: enquiries.length + 1,
      ...formData,
      enquiryDate:
        formData.enquiryDate || new Date().toLocaleDateString("en-US"),
      lastFollowUpDate: "",
    };
    setEnquiries([...enquiries, newEnquiry]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditEnquiry = () => {
    setEnquiries(
      enquiries.map((enquiry) =>
        enquiry.id === selectedEnquiry.id
          ? { ...enquiry, ...formData }
          : enquiry
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteEnquiry = (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      setEnquiries(enquiries.filter((enquiry) => enquiry.id !== id));
    }
  };

  const handleCall = (phone) => {
    window.open(`tel:${phone}`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      source: "",
      class: "",
      enquiryDate: "",
      nextFollowUpDate: "",
      address: "",
      notes: "",
      status: "Active",
    });
  };

  const openEditModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setFormData(enquiry);
    setShowEditModal(true);
  };

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowViewModal(true);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === sortedEnquiries.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedEnquiries.map((enquiry) => enquiry.id));
    }
  };

  const handleBulkDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedRows.length} enquiries?`
      )
    ) {
      setEnquiries(
        enquiries.filter((enquiry) => !selectedRows.includes(enquiry.id))
      );
      setSelectedRows([]);
      setShowBulkActions(false);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    setEnquiries(
      enquiries.map((enquiry) =>
        selectedRows.includes(enquiry.id)
          ? { ...enquiry, status: newStatus }
          : enquiry
      )
    );
    setSelectedRows([]);
    setShowBulkActions(false);
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "Email",
      "Source",
      "Class",
      "Enquiry Date",
      "Last Follow Up",
      "Next Follow Up",
      "Status",
      "Address",
      "Notes",
    ];
    const csvContent = [
      headers.join(","),
      ...sortedEnquiries.map((enquiry) =>
        [
          enquiry.name,
          enquiry.phone,
          enquiry.email,
          enquiry.source,
          enquiry.class,
          enquiry.enquiryDate,
          enquiry.lastFollowUpDate,
          enquiry.nextFollowUpDate,
          enquiry.status,
          enquiry.address,
          enquiry.notes,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admission_enquiries.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <button className="hover:underline">Receptionist</button>
        <span>&gt;</span>
        <span>Admission Enquiry</span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Admission Enquiry</h2>

      {/* Select Criteria Section */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Select Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={filters.class}
                onChange={(e) =>
                  setFilters({ ...filters, class: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={filters.source}
                onChange={(e) =>
                  setFilters({ ...filters, source: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enquiry From Date *
              </label>
              <input
                type="date"
                value={filters.enquiryFromDate}
                onChange={(e) =>
                  setFilters({ ...filters, enquiryFromDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enquiry To Date *
              </label>
              <input
                type="date"
                value={filters.enquiryToDate}
                onChange={(e) =>
                  setFilters({ ...filters, enquiryToDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    class: "",
                    source: "",
                    enquiryFromDate: "",
                    enquiryToDate: "",
                    status: "Active",
                  })
                }
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admission Enquiry Section */}
      <div className="bg-gray-200 p-6 shadow-sm border border-gray-100">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Admission Enquiry List</h3>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="enquiryDate">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="status">Sort by Status</option>
                  <option value="source">Sort by Source</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedRows.length} enquiry(s) selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkStatusChange("Converted")}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Mark as Converted
                  </button>
                  <button
                    onClick={() => handleBulkStatusChange("Lost")}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Mark as Lost
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setSelectedRows([])}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === sortedEnquiries.length &&
                        sortedEnquiries.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Source</th>
                  <th className="p-2 border">Enquiry Date</th>
                  <th className="p-2 border">Last Follow Up Date</th>
                  <th className="p-2 border">Next Follow Up Date</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedEnquiries.map((enquiry, index) => (
                  <tr
                    key={enquiry.id}
                    className={`text-center hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-pink-50"
                    }`}
                  >
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(enquiry.id)}
                        onChange={() => handleRowSelect(enquiry.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-2 border text-left">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">
                          {enquiry.name[0]}
                        </span>
                        <span>{enquiry.name}</span>
                      </div>
                    </td>
                    <td className="p-2 border">{enquiry.phone}</td>
                    <td className="p-2 border">{enquiry.source}</td>
                    <td className="p-2 border">{enquiry.enquiryDate}</td>
                    <td className="p-2 border">
                      {enquiry.lastFollowUpDate || "-"}
                    </td>
                    <td className="p-2 border">{enquiry.nextFollowUpDate}</td>
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          enquiry.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : enquiry.status === "Converted"
                            ? "bg-blue-100 text-blue-800"
                            : enquiry.status === "Lost"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openViewModal(enquiry)}
                          className="text-blue-500 hover:text-blue-700"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCall(enquiry.phone)}
                          className="text-green-500 hover:text-green-700"
                          title="Call"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(enquiry)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-3">
            <p>
              Showing {sortedEnquiries.length} of {enquiries.length} enquiries
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Add New Admission Enquiry
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEnquiry();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Source</option>
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) =>
                      setFormData({ ...formData, class: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enquiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.enquiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, enquiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Follow Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextFollowUpDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nextFollowUpDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Admission Enquiry</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditEnquiry();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sources.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) =>
                      setFormData({ ...formData, class: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enquiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.enquiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, enquiryDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Follow Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.lastFollowUpDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastFollowUpDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Follow Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextFollowUpDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nextFollowUpDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enquiry Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Source
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.source}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Class
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.class}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      selectedEnquiry.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : selectedEnquiry.status === "Converted"
                        ? "bg-blue-100 text-blue-800"
                        : selectedEnquiry.status === "Lost"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedEnquiry.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enquiry Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.enquiryDate}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Follow Up
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.lastFollowUpDate || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Next Follow Up
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedEnquiry.nextFollowUpDate}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <p className="text-sm text-gray-900">
                  {selectedEnquiry.address}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <p className="text-sm text-gray-900">{selectedEnquiry.notes}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedEnquiry);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
