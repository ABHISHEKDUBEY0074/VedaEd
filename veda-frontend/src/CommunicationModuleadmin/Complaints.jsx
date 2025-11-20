import { useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPhoneCall,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

const statusPillClasses = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const priorityClasses = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-orange-100 text-orange-700",
  Low: "bg-gray-100 text-gray-700",
};

const metrics = [
  {
    label: "Total Complaints",
    value: 42,
    trend: "+8% vs last week",
  },
  {
    label: "Pending",
    value: 9,
    trend: "-3% vs last week",
  },
  {
    label: "Avg. Response Time",
    value: "3h 12m",
    trend: "SLA 4h",
  },
  {
    label: "First Contact Resolution",
    value: "78%",
    trend: "+5% vs target",
  },
];

const mockComplaints = [
  {
    id: "#CMP-2042",
    subject: "Login issue",
    description: "Unable to login from teacher portal",
    status: "Pending",
    priority: "High",
    submittedBy: "Abhishek Sharma",
    submittedOn: "Jan 12, 2025 • 09:14 AM",
    channel: "Teacher App",
  },
  {
    id: "#CMP-2039",
    subject: "Attendance not updating",
    description: "Student attendance not syncing",
    status: "In Progress",
    priority: "Medium",
    submittedBy: "Class 9A Coordinator",
    submittedOn: "Jan 11, 2025 • 03:40 PM",
    channel: "Web Portal",
  },
  {
    id: "#CMP-2031",
    subject: "Fee receipt missing",
    description: "Parent unable to download latest fee receipt",
    status: "Resolved",
    priority: "Low",
    submittedBy: "Parent Support",
    submittedOn: "Jan 10, 2025 • 11:22 AM",
    channel: "Parent App",
  },
];

const tips = [
  "Review pending complaints older than 48 hours.",
  "Use templates for common responses to speed up resolutions.",
  "Tag departments for quicker escalation.",
];

export default function Complaints() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((complaint) => {
      const matchesStatus =
        selectedStatus === "All" || complaint.status === selectedStatus;
      const matchesSearch =
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, selectedStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Wire up with API
  };

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Complaints & Support
            </h2>
            <p className="text-sm text-gray-600">
              Submit new complaints, track progress, and collaborate with the
              support team.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
              <FiDownload size={16} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
              <FiPhoneCall size={16} />
              Contact Support
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-2xl shadow p-5 border border-gray-100"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {metric.value}
            </p>
            <p className="text-xs font-medium text-emerald-600 mt-1">
              {metric.trend}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 xl:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Submit a New Complaint
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="Enter complaint subject..."
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Technical</option>
                <option>Academic</option>
                <option>Operations</option>
                <option>Finance</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Describe the issue in detail..."
              className="w-full p-3 rounded-xl border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Attachments
              </label>
              <input
                type="file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
              </label>
              <div className="flex gap-3">
                {["High", "Medium", "Low"].map((priority) => (
                  <label
                    key={priority}
                    className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-600 hover:border-blue-500"
                  >
                    <input type="radio" name="priority" className="hidden" />
                    {priority}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full md:w-auto"
          >
            Submit Complaint
          </button>
        </form>

        <aside className="bg-blue-50 rounded-2xl p-6 shadow border border-blue-100 space-y-5">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-blue-600" size={24} />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Smart Suggestions
              </h4>
              <p className="text-sm text-gray-600">
                Improve resolution rate with the quick actions below.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <FiAlertTriangle className="mt-0.5 text-blue-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <button className="w-full rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition">
            View Escalation Matrix
          </button>
        </aside>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Complaints
            </h3>
            <p className="text-sm text-gray-500">
              Track the latest submissions and status updates.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search complaints..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["All", "Pending", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
              <FiFilter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    {complaint.id}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {complaint.subject}
                  </p>
                  <p className="text-sm text-gray-600">
                    {complaint.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {complaint.submittedBy} • {complaint.submittedOn} •{" "}
                    {complaint.channel}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPillClasses[complaint.status]}`}
                  >
                    {complaint.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityClasses[complaint.priority]}`}
                  >
                    {complaint.priority} Priority
                  </span>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

