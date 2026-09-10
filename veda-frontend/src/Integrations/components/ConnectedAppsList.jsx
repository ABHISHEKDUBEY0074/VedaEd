import React from "react";
import {
  FiCheck,
  FiRefreshCw,
  FiTrash2,
  FiExternalLink,
  FiFolder,
  FiAlertTriangle,
  FiClock,
} from "react-icons/fi";

export default function ConnectedAppsList({
  connections = [],
  loading = false,
  onOpenExplorer,
  onDisconnect,
  onRefreshSync,
  onSelectApp,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
        <div className="h-10 bg-gray-100 rounded"></div>
        <div className="h-10 bg-gray-100 rounded"></div>
        <div className="h-10 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
        <FiFolder className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-base font-semibold text-gray-900">No Connected Applications</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Explore the App Marketplace to link Google Drive, Notion, Canva, or other tools to Veda School.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3.5 px-6">Application</th>
              <th className="py-3.5 px-6">Connected Account</th>
              <th className="py-3.5 px-6">Scope / Level</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Last Synced</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {connections.map((conn) => {
              const provider = conn.provider || {};
              const isConnected = conn.status === "CONNECTED";
              const isReauth = conn.status === "REAUTH_REQUIRED";
              const isError = conn.status === "ERROR";

              return (
                <tr key={conn._id} className="hover:bg-gray-50 transition">
                  {/* Provider Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 p-2 flex items-center justify-center shrink-0">
                        {provider.iconUrl ? (
                          <img
                            src={provider.iconUrl}
                            alt={provider.name || conn.providerSlug}
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            {conn.providerSlug.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {provider.name || conn.providerSlug}
                        </div>
                        <div className="text-xs text-gray-500">
                          {provider.category || "Integration"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Connected Account */}
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">
                      {conn.accountName || "Authenticated Account"}
                    </div>
                    {conn.accountEmail && (
                      <div className="text-xs text-gray-500">{conn.accountEmail}</div>
                    )}
                  </td>

                  {/* Scope / Level */}
                  <td className="py-4 px-6">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 capitalize">
                      {conn.connectionLevel || "User"} Level
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {isConnected && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <FiCheck className="w-3.5 h-3.5" /> Active
                      </span>
                    )}
                    {isReauth && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <FiAlertTriangle className="w-3.5 h-3.5" /> Reauth Needed
                      </span>
                    )}
                    {isError && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                        <FiAlertTriangle className="w-3.5 h-3.5" /> Error
                      </span>
                    )}
                  </td>

                  {/* Last Synced */}
                  <td className="py-4 px-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3.5 h-3.5 text-gray-400" />
                      {conn.lastSyncedAt
                        ? new Date(conn.lastSyncedAt).toLocaleString()
                        : conn.connectedAt
                        ? new Date(conn.connectedAt).toLocaleDateString()
                        : "Never"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isConnected && (
                        <button
                          type="button"
                          onClick={() => onOpenExplorer(conn)}
                          title="Open Resource Explorer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition"
                        >
                          <FiFolder className="w-3.5 h-3.5" /> Explore
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onRefreshSync(conn._id)}
                        title="Sync / Refresh Token"
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDisconnect(conn._id, provider.name || conn.providerSlug)}
                        title="Disconnect Integration"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
