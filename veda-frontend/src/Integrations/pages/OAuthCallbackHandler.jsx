import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

export default function OAuthCallbackHandler() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || searchParams.get("error_description");
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: "VEDA_OAUTH_FAILURE", error }, "*");
        setTimeout(() => window.close(), 1500);
      }
    } else if (code && state) {
      // Backend handles code exchange via server callback URL,
      // but in case client-side routing is used:
      if (window.opener) {
        window.opener.postMessage({ type: "VEDA_OAUTH_SUCCESS", code, state }, "*");
        setTimeout(() => window.close(), 1200);
      }
    }
  }, [error, code, state]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-sm w-full text-center">
        {error ? (
          <>
            <FiAlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Connection Failed</h2>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200"
            >
              Close Window
            </button>
          </>
        ) : (
          <>
            <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-900 mb-1">Connected Successfully</h2>
            <p className="text-xs text-gray-500 mb-4">Completing connection with Veda School...</p>
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 font-medium">
              <FiLoader className="w-4 h-4 animate-spin" /> Finalizing...
            </div>
          </>
        )}
      </div>
    </div>
  );
}
