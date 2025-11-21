import { useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPhoneCall,
  FiDownload,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import CommunicationAPI from "../communicationAPI";

const statusPillClasses = {
  Submitted: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "Under Review": "bg-purple-100 text-purple-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-gray-100 text-gray-700",
};

const priorityClasses = {
  Urgent: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-700",
};

const metrics = [
  {
    label: "My Complaints",
    value: 8,
    trend: "+2 new this week",
  },
  {
    label: "Awaiting Response",
    value: 3,
    trend: "Avg. wait 4h",
  },
  {
    label: "Resolved",
    value: 15,
    trend: "Last resolution 2h ago",
  },
  {
    label: "In Progress",
    value: 2,
    trend: "Team working on it",
  },
];

const mockComplaints = [
  {
    id: "#TCMP-2045",
    subject: "Classroom projector not working",
    description: "The projector in Room 204 has been malfunctioning for the past 3 days. Unable to display presentations.",
    status: "Under Review",
    priority: "High",
    category: "Infrastructure",
    submittedOn: "Jan 12, 2025 • 10:30 AM",
    department: "IT Support",
  },
  {
    id: "#TCMP-2038",
    subject: "Request for additional teaching materials",
    description: "Need additional lab equipment for Chemistry practical classes. Current equipment is insufficient for 30 students.",
    status: "In Progress",
    priority: "Medium",
    category: "Academic",
    submittedOn: "Jan 11, 2025 • 02:15 PM",
    department: "Academic Affairs",
  },
  {
    id: "#TCMP-2032",
    subject: "Student attendance system issue",
    description: "Unable to mark attendance for Class 9B. System shows error when submitting attendance.",
    status: "Resolved",
    priority: "High",
    category: "Technical",
    submittedOn: "Jan 10, 2025 • 09:00 AM",
    department: "IT Support",
  },
  {
    id: "#TCMP-2025",
    subject: "Request for leave approval",
    description: "Submitted leave application 5 days ago but haven't received approval yet. Need urgent response.",
    status: "Pending",
    priority: "Urgent",
    category: "Administrative",
    submittedOn: "Jan 9, 2025 • 11:45 AM",
    department: "HR",
  },
];

const guidance = [
  "Provide specific details including dates, times, and affected classes or students.",
  "Attach relevant documents or screenshots to support your complaint.",
  "For urgent issues, contact the support helpline for immediate assistance.",
  "Check the status regularly and respond to any follow-up questions promptly.",
];

export default function TeacherComplaints() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "academic",
    description: "",
    priority: "medium",
    attachments: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredComplaints = useMemo(() => {
    return mockComplaints.filter((complaint) => {
      const matchesStatus =
        selectedStatus === "All" || complaint.status === selectedStatus;
      const matchesSearch =
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, selectedStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Get actual teacher ID from auth context
      const teacherId = "teacher123"; // Replace with actual teacher ID
      const complaintData = {
        complainant: teacherId,
        complainantModel: "Teacher",
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      };

      // Handle file upload if attachment exists
      if (formData.attachments) {
        const uploadResult = await CommunicationAPI.uploadAttachment(
          formData.attachments
        );
        complaintData.attachments = [uploadResult.file];
      }

      await CommunicationAPI.createComplaint(complaintData);
      
      // Reset form
      setFormData({
        subject: "",
        category: "academic",
        description: "",
        priority: "medium",
        attachments: null,
      });

      alert("Complaint submitted successfully!");
      // TODO: Refresh complaints list
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Teacher Complaints & Support
            </h2>
            <p className="text-sm text-gray-600">
              Submit complaints, track progress, and get support from the admin team.
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
                name="subject"
                placeholder="Enter complaint subject..."
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="academic">Academic</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="technical">Technical</option>
                <option value="administrative">Administrative</option>
                <option value="staff">Staff Related</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
              className="w-full p-3 rounded-xl border border-gray-300 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Attachments (optional)
              </label>
              <input
                type="file"
                name="attachments"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Priority Level
              </label>
              <div className="flex gap-3">
                {["Urgent", "High", "Medium", "Low"].map((priority) => (
                  <label
                    key={priority}
                    className={`flex-1 cursor-pointer rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${
                      formData.priority.toLowerCase() === priority.toLowerCase()
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-blue-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.toLowerCase()}
                      checked={formData.priority.toLowerCase() === priority.toLowerCase()}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    {priority}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>

        <aside className="bg-blue-50 rounded-2xl p-6 shadow border border-blue-100 space-y-5">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-blue-600" size={24} />
            <div>
              <h4 className="text-lg font-semibold text-gray-800">
                Support Tips
              </h4>
              <p className="text-sm text-gray-600">
                Improve resolution times with the guidance below.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {guidance.map((tip) => (
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
            View Response Policy
          </button>
        </aside>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Your Recent Complaints
            </h3>
            <p className="text-sm text-gray-500">
              Track status updates and responses in real time.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, ID, or category..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Submitted", "Pending", "Under Review", "In Progress", "Resolved"].map(
                (status) => (
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
                )
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
              <FiFilter size={16} />
              Filters
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm mt-2">
                {searchTerm || selectedStatus !== "All"
                  ? "Try adjusting your filters"
                  : "Submit your first complaint to get started"}
              </p>
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium text-gray-500">
                        {complaint.id}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {complaint.category}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {complaint.subject}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {complaint.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {complaint.department} • {complaint.submittedOn}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusPillClasses[complaint.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        priorityClasses[complaint.priority] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {complaint.priority} Priority
                    </span>
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

