import { useEffect, useState } from "react";
import { superadminLandingAPI } from "../services/superadminLandingAPI";

export default function Other() {
  const [other, setOther] = useState({
    notes: "",
    maintenanceMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOther = async () => {
      try {
        const response = await superadminLandingAPI.getOther();
        setOther((prev) => ({ ...prev, ...(response?.data || {}) }));
      } catch (error) {
        setMessage(error.message || "Failed to load other settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadOther();
  }, []);

  const onSave = async () => {
    try {
      setIsSaving(true);
      const response = await superadminLandingAPI.updateOther(other);
      setOther((prev) => ({ ...prev, ...(response?.data || {}) }));
      setMessage("Other settings saved");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Failed to save other settings");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold">Other Settings</h2>
      {message ? <p className="text-sm mt-2 text-gray-600">{message}</p> : null}

      <div className="mt-4">
        <label className="text-sm text-gray-600 block mb-1">Notes</label>
        <textarea
          value={other.notes || ""}
          onChange={(event) =>
            setOther((prev) => ({ ...prev, notes: event.target.value }))
          }
          disabled={isLoading}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          checked={Boolean(other.maintenanceMode)}
          onChange={(event) =>
            setOther((prev) => ({
              ...prev,
              maintenanceMode: event.target.checked,
            }))
          }
          disabled={isLoading}
        />
        Enable maintenance mode
      </label>

      <button
        type="button"
        onClick={onSave}
        disabled={isLoading || isSaving}
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Other Settings"}
      </button>
    </div>
  );
}