import React, { useState } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiCircle,
  FiFileText,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export default function StatusTracking() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [openStep, setOpenStep] = useState(null);

  /* 🔹 DUMMY DATABASE (Application Form se aaya hua data) */
  const dummyApplications = {
    "APP-1023": {
      studentName: "Aarav Sharma",
      classApplied: "Class 6",
      academicYear: "2025-26",
      formSubmitted: true,
      steps: [
        {
          label: "Admission Form",
          status: "completed",
          details: "Student basic details, parent info and documents submitted.",
        },
        {
          label: "Application Listed",
          status: "completed",
          details: "Application successfully listed in admin dashboard.",
        },
        {
          label: "Entrance Exam",
          status: "completed",
          details: "Written exam completed. Result: Passed.",
        },
        {
          label: "Interview",
          status: "pending",
          details: "Interview scheduled for next week.",
        },
        {
          label: "Document Verification",
          status: "pending",
          details: "Original documents verification pending.",
        },
        {
          label: "Selected Student",
          status: "upcoming",
          details: "Selection will be based on interview performance.",
        },
        {
          label: "Application Offer",
          status: "upcoming",
          details: "Offer letter will be generated after selection.",
        },
        {
          label: "Fees Confirmation",
          status: "upcoming",
          details: "Fees payment pending.",
        },
      ],
    },
  };

  const handleTrack = () => {
    setError("");
    setApplication(null);
    setOpenStep(null);

    if (!applicationId.trim()) {
      setError("Please enter Application ID");
      return;
    }

    const data = dummyApplications[applicationId.trim()];

    if (!data) {
      setError("Application not found");
      return;
    }

    setApplication({
      applicationId,
      ...data,
    });
  };

  const getIcon = (status) => {
    if (status === "completed")
      return <FiCheckCircle className="text-green-600" size={20} />;
    if (status === "pending")
      return <FiClock className="text-yellow-500" size={20} />;
    return <FiCircle className="text-gray-300" size={20} />;
  };

  /* 📊 PROGRESS CALCULATION */
  const completedCount =
    application?.steps.filter((s) => s.status === "completed").length || 0;
  const progressPercent = application
    ? Math.round((completedCount / application.steps.length) * 100)
    : 0;

  return (
    <div className="p-0 m-0 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6">

        {/* HEADER */}
        <h1 className="text-xl font-semibold mb-6">
          Application Status Tracking
        </h1>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Application ID (e.g. APP-1023)"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
            className="border rounded-md px-3 py-2 w-72"
          />
          <button
            onClick={handleTrack}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
          >
            <FiSearch />
            Track
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {/* RESULT */}
        {application && (
          <>
            {/* STUDENT CARD */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-4">
              <FiFileText size={26} className="text-indigo-600" />
              <div>
                <div className="font-semibold">{application.studentName}</div>
                <div className="text-sm text-gray-600">
                  {application.applicationId} · {application.classApplied} ·{" "}
                  {application.academicYear}
                </div>
              </div>
            </div>

            {/* 📊 PROGRESS BAR */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 🧾 TIMELINE + VIEW DETAILS */}
            <div className="space-y-4">
              {application.steps.map((step, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() =>
                      setOpenStep(openStep === index ? null : index)
                    }
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(step.status)}
                      <span
                        className={`font-medium ${
                          step.status === "completed"
                            ? "text-green-700"
                            : step.status === "pending"
                            ? "text-yellow-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>

                    {openStep === index ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </div>

                  {/* DETAILS */}
                  {openStep === index && (
                    <div className="mt-3 text-sm text-gray-600 pl-7">
                      {step.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
