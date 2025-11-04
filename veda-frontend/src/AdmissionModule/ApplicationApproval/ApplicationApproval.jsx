import React, { useState } from "react";
import PendingApplications from "./PendingApplications";
import ApprovedApplications from "./ApprovedApplications";
import DisapprovedApplications from "./DisapprovedApplications";

export default function ApplicationApproval() {
  const [activeTab, setActiveTab] = useState("pending");

  // Shared data for all tabs
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: "Aarav Mehta",
      parentName: "Rohit Mehta",
      email: "rohitmehta@example.com",
      phone: "9876543210",
      class: "8th",
      date: "2025-10-28",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Siya Kapoor",
      parentName: "Neha Kapoor",
      email: "nehakapoor@example.com",
      phone: "9812345678",
      class: "7th",
      date: "2025-10-29",
      status: "pending",
    },
  ]);

  // ✅ Approve function
  const handleApprove = (id) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "approved", approvedOn: new Date().toISOString() }
          : a
      )
    );
  };

  // ✅ Disapprove function
  const handleDisapprove = (id, reason) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "disapproved",
              reason,
              disapprovedOn: new Date().toISOString(),
            }
          : a
      )
    );
  };

  // ✅ Re-approve from disapproved list
  const handleReApprove = (id) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "approved",
              reApprovedOn: new Date().toISOString(),
              reason: "",
            }
          : a
      )
    );
  };

  // Filters
  const pendingList = applications.filter((a) => a.status === "pending");
  const approvedList = applications.filter((a) => a.status === "approved");
  const disapprovedList = applications.filter((a) => a.status === "disapproved");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Admission</span> <span>&gt;</span>
        <span className="capitalize">{activeTab} Applications</span>
      </div>

      <h2 className="text-2xl font-bold mb-6">Application Approval</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300">
        {["pending", "approved", "disapproved"].map((tab) => (
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
      <div className="mt-6">
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
      </div>
    </div>
  );
}
