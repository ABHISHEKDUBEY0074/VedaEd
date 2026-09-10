import React from "react";
import {
  FiX,
  FiCheck,
  FiShield,
  FiExternalLink,
  FiInfo,
  FiAlertCircle,
  FiLock,
  FiPlus,
  FiTrash2,
  FiFolder,
} from "react-icons/fi";

export default function AppDetailsModal({
  provider,
  isOpen,
  onClose,
  onConnect,
  onDisconnect,
  onOpenExplorer,
}) {
  if (!isOpen || !provider) return null;

  const isConnected = provider.connection?.status === "CONNECTED";
  const isConnecting = provider.connection?.status === "CONNECTING";
  const isReauth = provider.connection?.status === "REAUTH_REQUIRED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 p-2.5 flex items-center justify-center shrink-0 shadow-xs">
              {provider.iconUrl ? (
                <img
                  src={provider.iconUrl}
                  alt={provider.name}
                  className="w-9 h-9 object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center text-lg"
                  style={{ backgroundColor: provider.brandColor || "#4F46E5" }}
                >
                  {provider.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{provider.name}</h2>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <FiCheck className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">
                {provider.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              About this integration
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {provider.description}
            </p>
          </div>

          {/* Connected Account Card if active */}
          {isConnected && provider.connection && (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4">
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                Active Connection
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {provider.connection.accountName || "Connected User"}
              </div>
              {provider.connection.accountEmail && (
                <div className="text-xs text-gray-600">
                  {provider.connection.accountEmail}
                </div>
              )}
              <div className="text-[11px] text-emerald-700 mt-2">
                Linked on: {new Date(provider.connection.connectedAt).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Permissions / Scopes (Least-Privilege Disclosure) */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <FiShield className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Permissions & Data Access
              </h3>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
              {provider.defaultScopes?.map((scopeItem, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <FiCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">
                      {scopeItem.description}
                    </span>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {scopeItem.scope}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
              <FiLock className="w-3 h-3 text-gray-400" />
              Veda School only requests the minimum scopes necessary to operate this integration.
            </p>
          </div>

          {/* Embedding & Security Policy Notice */}
          {provider.embeddingPolicyNotice && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
              <FiInfo className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Security & Embedding Policy: </span>
                <span>{provider.embeddingPolicyNotice}</span>
              </div>
            </div>
          )}

          {/* Capabilities */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Supported Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.capabilities?.map((cap) => (
                <span
                  key={cap}
                  className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg capitalize"
                >
                  ✓ {cap.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          {provider.websiteUrl && (
            <a
              href={provider.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
            >
              <FiExternalLink className="w-3.5 h-3.5" /> Publisher Website
            </a>
          )}

          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenExplorer(provider.connection);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <FiFolder className="w-3.5 h-3.5" /> Open Resource Explorer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDisconnect(provider.connection.id || provider.connection._id, provider.name);
                  }}
                  className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                >
                  <FiTrash2 className="w-3.5 h-3.5" /> Disconnect
                </button>
              </>
            ) : isReauth ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConnect(provider);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Reauthorize Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onConnect(provider);
                }}
                disabled={isConnecting}
                className="px-5 py-2.5 bg-gray-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <FiPlus className="w-4 h-4" /> Connect with {provider.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
