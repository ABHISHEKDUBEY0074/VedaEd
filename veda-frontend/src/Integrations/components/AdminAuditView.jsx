import React, { useState, useEffect } from "react";
import {
  FiShield,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiToggleLeft,
  FiToggleRight,
  FiRefreshCw,
  FiLock,
} from "react-icons/fi";
import integrationAPI from "../../services/integrationAPI";
import Swal from "sweetalert2";

export default function AdminAuditView() {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingSlug, setTogglingSlug] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, provRes, logsRes] = await Promise.all([
        integrationAPI.getAdminStats(),
        integrationAPI.getAdminProviders(),
        integrationAPI.getAdminAuditLogs({ limit: 25 }),
      ]);
      setStats(statsRes.data.data);
      setProviders(provRes.data.data || []);
      setLogs(logsRes.data.data || []);
    } catch (err) {
      console.error("Failed to load admin audit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleProvider = async (provider) => {
    try {
      setTogglingSlug(provider.slug);
      const newStatus = !provider.isEnabled;
      await integrationAPI.updateAdminProvider(provider.slug, {
        isEnabled: newStatus,
      });

      setProviders((prev) =>
        prev.map((p) => (p.slug === provider.slug ? { ...p, isEnabled: newStatus } : p))
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `${provider.name} ${newStatus ? "Enabled" : "Disabled"}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setTogglingSlug(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-3 gap-6">
          <div className="h-24 bg-white rounded-xl border border-gray-200"></div>
          <div className="h-24 bg-white rounded-xl border border-gray-200"></div>
          <div className="h-24 bg-white rounded-xl border border-gray-200"></div>
        </div>
        <div className="h-64 bg-white rounded-xl border border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.activeConnections || 0}
            </div>
            <div className="text-xs font-medium text-gray-500">Active Connections</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiActivity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.importedCount || 0}
            </div>
            <div className="text-xs font-medium text-gray-500">Imported Resources</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {providers.filter((p) => p.isEnabled).length} / {providers.length}
            </div>
            <div className="text-xs font-medium text-gray-500">Enabled Providers</div>
          </div>
        </div>
      </div>

      {/* Provider Availability Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Third-Party App Availability
            </h3>
            <p className="text-xs text-gray-500">
              Enable or disable apps available to teachers, students, and staff.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg transition"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div
              key={p.slug}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center">
                  {p.iconUrl ? (
                    <img src={p.iconUrl} alt={p.name} className="w-5 h-5 object-contain" />
                  ) : (
                    <span className="font-bold text-xs">{p.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{p.name}</div>
                  <div className="text-[11px] text-gray-500">{p.category}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleProvider(p)}
                disabled={togglingSlug === p.slug}
                className="text-2xl focus:outline-none transition"
              >
                {p.isEnabled ? (
                  <FiToggleRight className="text-indigo-600 w-8 h-8" />
                ) : (
                  <FiToggleLeft className="text-gray-300 w-8 h-8" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Security Audit Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiLock className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-gray-900">
              Security & Integration Audit Trail
            </h3>
          </div>
          <span className="text-xs text-gray-400">Tokens sanitized & masked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5">Provider</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No integration audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-5 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-5 font-semibold text-gray-900 capitalize">
                      {log.providerSlug}
                    </td>
                    <td className="py-3 px-5 font-mono text-[11px] text-gray-700">
                      {log.action}
                    </td>
                    <td className="py-3 px-5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          log.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : log.status === "FAILURE"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-gray-600">
                      {log.userId?.name || log.userId?.email || "System"}
                    </td>
                    <td className="py-3 px-5 text-gray-400 font-mono">
                      {log.ipAddress || "Internal"}
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
