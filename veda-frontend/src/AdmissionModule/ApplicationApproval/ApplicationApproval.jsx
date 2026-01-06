import React, { useState, useEffect } from "react";
import axios from "axios";
import PendingApplications from "./PendingApplications";
import ApprovedApplications from "./ApprovedApplications";
import DisapprovedApplications from "./DisapprovedApplications";
import HelpInfo from "../../components/HelpInfo";

export default function ApplicationApproval() {
  const [activeTab, setActiveTab] = useState("pending");

  // Shared data for all tabs
  // Shared data for all tabs
  const [applications, setApplications] = useState([]);

  // Fetch applications
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admission/application");
      if (res.data.success) {
        const mappedData = res.data.data.map(app => ({
          _id: app._id,
          id: app.applicationId || app._id,
          studentName: app.personalInfo?.name || "N/A",
          parentName: app.parents?.father?.name || app.parents?.mother?.name || "N/A",
          email: app.contactInfo?.email || "N/A",
          phone: app.contactInfo?.phone || "N/A",
          class: app.earlierAcademic?.lastClass || "N/A",
          date: app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : "N/A",
          status: (app.applicationStatus || "Pending").toLowerCase() === "rejected" ? "disapproved" : (app.applicationStatus || "Pending").toLowerCase(),
        }));
        setApplications(mappedData);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  // ✅ Approve function
  const handleApprove = async (id) => {
    try {
      // Find the app to get _id because frontend id might be 'applicationId' string
      const app = applications.find(a => a.id === id);
      const dbId = app?._id || id;
      
      const res = await axios.put(`http://localhost:5000/api/admission/application/${dbId}/status`, { status: "Approved" });
      if (res.data.success) {
        fetchApplications(); // Refresh list
      }
    } catch (err) {
      console.error("Error approving application:", err);
    }
  };

  // ✅ Disapprove function
  const handleDisapprove = async (id, reason) => {
    try {
      const app = applications.find(a => a.id === id);
      const dbId = app?._id || id;

      const res = await axios.put(`http://localhost:5000/api/admission/application/${dbId}/status`, { 
        status: "Rejected",
        remarks: reason 
      });
      if (res.data.success) {
        fetchApplications(); // Refresh list
      }
    } catch (err) {
      console.error("Error disapproving application:", err);
    }
  };

  // ✅ Re-approve function
  const handleReApprove = async (id) => {
     handleApprove(id);
  };

  // Filters
  const pendingList = applications.filter((a) => a.status === "pending");
  const approvedList = applications.filter((a) => a.status === "approved");
  const disapprovedList = applications.filter(
    (a) => a.status === "disapproved"
  );

  return (
    <div className="p-0 m-0 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span> <span>&gt;</span>
        <span className="capitalize">{activeTab} Applications</span>
      </div>

      <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-bold">Admission Approval</h2>
           
            <HelpInfo
  title="Admission Approval Tabs Help"
  description={`4.1 Pending

This tab displays all admission applications that are awaiting review. You can see each applicant's details and take appropriate action.

Columns:
- Student Name: Name of the student who applied.
- Parent Name: Name of the parent or guardian.
- Email: Contact email for communication.
- Phone: Contact phone number.
- Class: The grade level applied for.
- Date: The date when the application was submitted.
- Actions: Buttons or options to approve or disapprove the application.

4.2 Approved

Shows the list of applications that have been reviewed and accepted. These students are approved for admission.

Columns here mirror the Pending tab, providing a summary of approved applications.

4.3 Disapproved

Lists applications that have been reviewed and rejected.

The columns remain the same, helping you keep track of disapproved applications and reasons if available.

4.4 Automation

This tab contains tools and settings to automate the admission approval workflow. You can configure rules to auto-approve or reject applications based on predefined criteria, reducing manual workload and speeding up processing.`}
/>
           </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b">
        {["pending", "approved", "disapproved", "automation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 capitalize transition-all duration-200 ${
              activeTab === tab
                ? "text-blue-600 font-semibold"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-blue-600"></span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "pending" && (
          <PendingApplications
            data={pendingList}
            onApprove={handleApprove}
            onDisapprove={handleDisapprove}
          />
        )}

        {activeTab === "approved" && (
          <ApprovedApplications data={approvedList} />
        )}

        {activeTab === "disapproved" && (
          <DisapprovedApplications
            data={disapprovedList}
            onReApprove={handleReApprove}
          />
        )}

        {activeTab === "automation" && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Automation Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Configure automatic approval or notifications for applications.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Auto-Approve Applications After (Days)
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-200"
                  placeholder="Enter number of days"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
