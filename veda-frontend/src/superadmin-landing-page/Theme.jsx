import { useEffect, useState } from "react";
import { superadminLandingAPI } from "../services/superadminLandingAPI";

const defaultTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#22c55e",
  accentColor: "#f59e0b",
  fontFamily: "Inter",
  darkMode: false,
  customCss: "",
};

export default function Theme() {
  const [theme, setTheme] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await superadminLandingAPI.getTheme();
        setTheme((prev) => ({ ...prev, ...(response?.data || {}) }));
      } catch (error) {
        setMessage(error.message || "Failed to load theme");
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTheme((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSave = async () => {
    try {
      setIsSaving(true);
      const response = await superadminLandingAPI.updateTheme(theme);
      setTheme((prev) => ({ ...prev, ...(response?.data || {}) }));
      setMessage("Theme settings saved");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage(error.message || "Failed to save theme");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-lg font-semibold">Theme Settings</h2>
      {message ? <p className="text-sm mt-2 text-gray-600">{message}</p> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Primary Color</span>
          <input
            type="color"
            name="primaryColor"
            value={theme.primaryColor}
            onChange={onChange}
            disabled={isLoading}
            className="w-16 h-10 p-1 border rounded"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Secondary Color</span>
          <input
            type="color"
            name="secondaryColor"
            value={theme.secondaryColor}
            onChange={onChange}
            disabled={isLoading}
            className="w-16 h-10 p-1 border rounded"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Accent Color</span>
          <input
            type="color"
            name="accentColor"
            value={theme.accentColor}
            onChange={onChange}
            disabled={isLoading}
            className="w-16 h-10 p-1 border rounded"
          />
        </label>

        <label className="text-sm">
          <span className="block text-gray-600 mb-1">Font Family</span>
          <input
            type="text"
            name="fontFamily"
            value={theme.fontFamily}
            onChange={onChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          name="darkMode"
          checked={Boolean(theme.darkMode)}
          onChange={onChange}
          disabled={isLoading}
        />
        Enable dark mode
      </label>

      <div className="mt-4">
        <label className="text-sm text-gray-600 block mb-1">Custom CSS</label>
        <textarea
          name="customCss"
          value={theme.customCss}
          onChange={onChange}
          disabled={isLoading}
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={isLoading || isSaving}
        className="mt-4 px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}