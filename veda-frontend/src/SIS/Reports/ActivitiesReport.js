import React, { useEffect, useMemo, useState } from "react";
import {
  FiBookOpen,
  FiTrendingUp,
  FiAlertTriangle,
  FiClipboard,
  FiCheckCircle,
  FiUploadCloud,
  FiDownload,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import HelpInfo from "../../components/HelpInfo";

const ACTIVITIES_HELP = `Page Description: Provide leadership with a consolidated view of every co-curricular cluster—participation, risks, approvals, and live initiatives.

1.1 Cluster Snapshot Cards

Tap any card to switch between Athletics, Arts, Clubs, or Outreach. KPIs show participation, programs in flight, and risk alerts.

Sections:
- Participation Pulse: current % of students engaged in that cluster
- Programs Live: total tracks monitored across schools
- Risk Alerts: flagged initiatives needing admin follow-up

1.2 Engagement Intelligence

Two panels break down engagement quality and workflow status.

Sections:
- Engagement Overview: category-wise progress bars (Participation, Impact, Readiness, Reporting)
- Pending Approvals: workflow queue for budgets, schedule changes, or certificates

1.3 Activity Records Log

Add or edit initiatives without leaving the dashboard.

Sections:
- Entry Form: initiative name, owner, focus area, status, participants, last review
- Records Table: searchable snapshot with edit/delete controls
- Participation Counter: total learners impacted in the current cluster`;

const clusterSummaries = [
  {
    id: "sports",
    title: "Athletics & Sports",
    participation: 92,
    programs: 8,
    risks: 1,
    focus: "District Meet Readiness",
  },
  {
    id: "arts",
    title: "Performing & Visual Arts",
    participation: 86,
    programs: 11,
    risks: 0,
    focus: "Winter Showcase Prep",
  },
  {
    id: "clubs",
    title: "Scholastic Clubs",
    participation: 78,
    programs: 9,
    risks: 2,
    focus: "Debate Nationals",
  },
];

const clusterMeta = {
  sports: {
    coordinator: "Dean Athletics",
    focusAreas: ["Infrastructure", "Coach Staffing", "Tournament Prep"],
  },
  arts: {
    coordinator: "Cultural Committee",
    focusAreas: ["Production Design", "Workshops", "Student Exhibition"],
  },
  clubs: {
    coordinator: "Enrichment Office",
    focusAreas: ["Competition Prep", "Mentor Allocation", "Community Outreach"],
  },
};

const clusterEngagement = {
  sports: [
    { dimension: "Participation", percentage: 92 },
    { dimension: "Impact Stories", percentage: 74 },
    { dimension: "Readiness", percentage: 88 },
    { dimension: "Reporting", percentage: 81 },
  ],
  arts: [
    { dimension: "Participation", percentage: 86 },
    { dimension: "Impact Stories", percentage: 90 },
    { dimension: "Readiness", percentage: 79 },
    { dimension: "Reporting", percentage: 84 },
  ],
  clubs: [
    { dimension: "Participation", percentage: 78 },
    { dimension: "Impact Stories", percentage: 72 },
    { dimension: "Readiness", percentage: 82 },
    { dimension: "Reporting", percentage: 76 },
  ],
};

const pendingWorkflows = {
  sports: [
    {
      id: "wf-1",
      title: "Budget approval - Athletics kits",
      due: "Due in 2 days",
      owner: "Finance Desk",
    },
    {
      id: "wf-2",
      title: "Safety audit sign-off - Pool",
      due: "Escalated",
      owner: "Facilities",
    },
  ],
  arts: [
    {
      id: "wf-3",
      title: "Vendor contract - Stage lighting",
      due: "Due tomorrow",
      owner: "Procurement",
    },
    {
      id: "wf-4",
      title: "Parent circular review - Winter showcase",
      due: "Draft ready",
      owner: "Communications",
    },
  ],
  clubs: [
    {
      id: "wf-5",
      title: "Travel approval - Debate nationals",
      due: "Pending Principal",
      owner: "Admin Office",
    },
  ],
};

const seededActivityRecords = {
  sports: [
    {
      id: "sports-1",
      initiative: "Ground readiness audit",
      owner: "Facilities + Sports",
      focusArea: "Infrastructure",
      status: "On Track",
      participants: 120,
      lastReview: "2025-01-14",
      notes: "Phase 1 resurfacing completed",
    },
    {
      id: "sports-2",
      initiative: "Tournament mentorship pods",
      owner: "Coaching Team",
      focusArea: "Tournament Prep",
      status: "At Risk",
      participants: 68,
      lastReview: "2025-01-12",
      notes: "Need backup coach for relay team",
    },
  ],
  arts: [
    {
      id: "arts-1",
      initiative: "Winter showcase rehearsals",
      owner: "Cultural Committee",
      focusArea: "Production Design",
      status: "On Track",
      participants: 94,
      lastReview: "2025-01-15",
      notes: "Lighting vendor onboarded",
    },
  ],
  clubs: [
    {
      id: "clubs-1",
      initiative: "Debate nationals coaching",
      owner: "Enrichment Office",
      focusArea: "Competition Prep",
      status: "On Track",
      participants: 32,
      lastReview: "2025-01-10",
      notes: "Shortlisted for quarter finals",
    },
  ],
};

const emptyRecord = (clusterId) => ({
  initiative: "",
  owner: clusterMeta[clusterId]?.coordinator || "",
  focusArea: clusterMeta[clusterId]?.focusAreas?.[0] || "",
  status: "On Track",
  participants: "",
  lastReview: new Date().toISOString().split("T")[0],
  notes: "",
});

export default function ActivitiesReport() {
  const [selectedCluster, setSelectedCluster] = useState("sports");
  const [activityRecords, setActivityRecords] = useState(seededActivityRecords);
  const [recordForm, setRecordForm] = useState(() => emptyRecord("sports"));
  const [editingId, setEditingId] = useState(null);

  const currentCluster = useMemo(
    () => clusterSummaries.find((cluster) => cluster.id === selectedCluster),
    [selectedCluster]
  );
  const recordsForCluster = activityRecords[selectedCluster] || [];
  const engagementData = clusterEngagement[selectedCluster] || [];
  const pendingItems = pendingWorkflows[selectedCluster] || [];

  useEffect(() => {
    setRecordForm(emptyRecord(selectedCluster));
    setEditingId(null);
  }, [selectedCluster]);

  const totalParticipants = useMemo(
    () =>
      recordsForCluster.reduce(
        (sum, rec) => sum + (Number(rec.participants) || 0),
        0
      ),
    [recordsForCluster]
  );

  const handleRecordSave = () => {
    if (!recordForm.initiative.trim()) {
      alert("Enter initiative name.");
      return;
    }
    if (!recordForm.owner.trim()) {
      alert("Capture the owner/coordinator.");
      return;
    }
    if (!recordForm.focusArea.trim()) {
      alert("Provide a focus area.");
      return;
    }

    const payload = {
      ...recordForm,
      id: editingId || `${selectedCluster}-${Date.now()}`,
      participants: Number(recordForm.participants) || 0,
    };

    setActivityRecords((prev) => {
      const existing = prev[selectedCluster] || [];
      const next = editingId
        ? existing.map((rec) => (rec.id === editingId ? payload : rec))
        : [payload, ...existing];
      return { ...prev, [selectedCluster]: next };
    });
    setRecordForm(emptyRecord(selectedCluster));
    setEditingId(null);
  };

  const handleRecordEdit = (record) => {
    setRecordForm({
      initiative: record.initiative,
      owner: record.owner,
      focusArea: record.focusArea,
      status: record.status,
      participants: String(record.participants ?? ""),
      lastReview: record.lastReview,
      notes: record.notes,
    });
    setEditingId(record.id);
  };

  const handleRecordDelete = (recordId) => {
    if (!window.confirm("Remove this initiative log?")) return;
    setActivityRecords((prev) => {
      const existing = prev[selectedCluster] || [];
      return {
        ...prev,
        [selectedCluster]: existing.filter((rec) => rec.id !== recordId),
      };
    });
    if (editingId === recordId) {
      setRecordForm(emptyRecord(selectedCluster));
      setEditingId(null);
    }
  };

  const resetRecordForm = () => {
    setRecordForm(emptyRecord(selectedCluster));
    setEditingId(null);
  };

  const clusterHighlights = currentCluster
    ? [
        {
          label: "Avg Participation",
          value: `${currentCluster.participation}%`,
          icon: <FiTrendingUp />,
          tone: "text-green-600",
        },
        {
          label: "Programs Live",
          value: currentCluster.programs,
          icon: <FiClipboard />,
          tone: "text-blue-600",
        },
        {
          label: "Risk Items",
          value: currentCluster.risks,
          icon: <FiAlertTriangle />,
          tone: currentCluster.risks ? "text-red-600" : "text-gray-500",
        },
        {
          label: "Focus Theme",
          value: currentCluster.focus,
          icon: <FiCheckCircle />,
          tone: "text-gray-700",
        },
      ]
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Admin SIS &gt; Reports &gt; Activities
          </p>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2 mt-2">
            <FiBookOpen /> Activity Intelligence & Records
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor participation, approvals, and initiative logs across every
            co-curricular cluster from one admin workspace.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HelpInfo title="Activities Help" description={ACTIVITIES_HELP} />
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
              <FiUploadCloud /> Import Log
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-100">
              <FiDownload /> Export Snapshot
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clusterSummaries.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => setSelectedCluster(cluster.id)}
            className={`text-left rounded-2xl border p-5 shadow-sm bg-white transition-all ${
              selectedCluster === cluster.id ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <p className="text-xs uppercase text-gray-400">{cluster.title}</p>
            <p className="text-3xl font-semibold text-gray-800 mt-2">
              {cluster.participation}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Participation • {cluster.programs} programs
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Risks: {cluster.risks}</span>
              <span>Focus: {cluster.focus}</span>
            </div>
          </button>
        ))}
      </section>

      {currentCluster && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {currentCluster.title} Snapshot
              </h3>
              <p className="text-xs text-gray-500">
                Coordinated by {clusterMeta[selectedCluster]?.coordinator}
              </p>
            </div>
            <span className="text-sm text-gray-500">
              Total participants tagged: {totalParticipants}
            </span>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {clusterHighlights.map((metric) => (
              <HighlightCard key={metric.label} {...metric} />
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Engagement Overview</h3>
            <span className="text-xs text-gray-400">Live benchmarks</span>
          </div>
          <div className="space-y-4">
            {engagementData.map((item) => (
              <div key={item.dimension}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.dimension}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Pending Approvals</h3>
            <span className="text-xs text-gray-400">
              {pendingItems.length} workflows
            </span>
          </div>
          <div className="space-y-4">
            {pendingItems.length === 0 ? (
              <p className="text-sm text-gray-500">All workflows cleared.</p>
            ) : (
              pendingItems.map((item) => <PendingItem key={item.id} {...item} />)
            )}
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Initiative Records
            </h3>
            <p className="text-xs text-gray-500">
              {recordsForCluster.length} entries • {totalParticipants} learners
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetRecordForm}
              className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100"
            >
              Reset Form
            </button>
            <button
              onClick={handleRecordSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <FiPlus /> {editingId ? "Update Record" : "Add Record"}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm text-gray-600">
              Initiative Name
              <input
                type="text"
                value={recordForm.initiative}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, initiative: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>

            <label className="text-sm text-gray-600">
              Owner / Coordinator
              <input
                type="text"
                value={recordForm.owner}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, owner: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>

            <label className="text-sm text-gray-600">
              Focus Area
              <input
                type="text"
                value={recordForm.focusArea}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, focusArea: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                list="focus-suggestions"
              />
              <datalist id="focus-suggestions">
                {(clusterMeta[selectedCluster]?.focusAreas || []).map((area) => (
                  <option key={area} value={area} />
                ))}
              </datalist>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-gray-600">
              Status
              <select
                value={recordForm.status}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, status: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <label className="text-sm text-gray-600">
              Participants Covered
              <input
                type="number"
                value={recordForm.participants}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, participants: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
                min="0"
              />
            </label>

            <label className="text-sm text-gray-600">
              Last Review Date
              <input
                type="date"
                value={recordForm.lastReview}
                onChange={(e) =>
                  setRecordForm((p) => ({ ...p, lastReview: e.target.value }))
                }
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </label>
          </div>
        </div>

        <label className="text-sm text-gray-600 block">
          Notes / Next Steps
          <textarea
            value={recordForm.notes}
            onChange={(e) =>
              setRecordForm((p) => ({ ...p, notes: e.target.value }))
            }
            className="mt-1 w-full border rounded-lg px-3 py-2"
            rows={3}
          />
        </label>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Initiative</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Focus</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Participants</th>
                <th className="p-3 text-left">Last Review</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recordsForCluster.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No initiatives logged yet.
                  </td>
                </tr>
              ) : (
                recordsForCluster.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {record.initiative}
                    </td>
                    <td className="p-3 text-gray-600">{record.owner}</td>
                    <td className="p-3 text-gray-600">{record.focusArea}</td>
                    <td className="p-3">
                      <StatusPill status={record.status} />
                    </td>
                    <td className="p-3 text-right">{record.participants}</td>
                    <td className="p-3 text-gray-500">{record.lastReview}</td>
                    <td className="p-3 text-gray-500">{record.notes}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleRecordEdit(record)}
                        className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800"
                        aria-label="Edit record"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => handleRecordDelete(record.id)}
                        className="inline-flex items-center justify-center text-red-500 hover:text-red-700"
                        aria-label="Delete record"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function HighlightCard({ icon, label, value, tone }) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs uppercase text-gray-400">
        <span className="text-base text-gray-500">{icon}</span>
        {label}
      </div>
      <p className={`text-2xl font-semibold ${tone}`}>{value}</p>
    </div>
  );
}

function PendingItem({ title, due, owner }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
      <div className="rounded-full bg-blue-50 text-blue-600 p-2">
        <FiUsers />
      </div>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{owner}</p>
        <p className="text-xs text-blue-600 mt-1">{due}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const tones = {
    "On Track": "bg-green-50 text-green-600",
    "At Risk": "bg-yellow-50 text-yellow-600",
    Delayed: "bg-red-50 text-red-600",
    Completed: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        tones[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

