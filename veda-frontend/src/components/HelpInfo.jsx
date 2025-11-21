import React, { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

export default function HelpInfo({ title, description, steps }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      {/* HELP ICON BUTTON */}
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "22px",
          color: "#333",
        }}
      >
        <FiHelpCircle />
      </button>

      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.25)",
            zIndex: 100,
          }}
        />
      )}

      {/* MODAL */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "460px",
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            zIndex: 101,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Title */}
          <h2
            style={{
              marginBottom: "10px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {title}
          </h2>

          {/* TABS */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              borderBottom: "1px solid #ddd",
              marginBottom: "15px",
              paddingBottom: "8px",
            }}
          >
            <button
              onClick={() => setActiveTab("description")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "15px",
                color: activeTab === "description" ? "#4a90e2" : "#666",
                fontWeight: activeTab === "description" ? "600" : "400",
                borderBottom:
                  activeTab === "description"
                    ? "2px solid #4a90e2"
                    : "2px solid transparent",
                paddingBottom: "4px",
              }}
            >
              Description
            </button>

            <button
              onClick={() => setActiveTab("steps")}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "15px",
                color: activeTab === "steps" ? "#4a90e2" : "#666",
                fontWeight: activeTab === "steps" ? "600" : "400",
                borderBottom:
                  activeTab === "steps"
                    ? "2px solid #4a90e2"
                    : "2px solid transparent",
                paddingBottom: "4px",
              }}
            >
              Steps
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "description" && (
            <p style={{ color: "#555", fontSize: "14px", lineHeight: "20px" }}>
              {description}
            </p>
          )}

          {activeTab === "steps" && (
            <ul
              style={{
                paddingLeft: "20px",
                marginTop: "5px",
              }}
            >
              {steps?.map((s, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "14px",
                    marginBottom: "6px",
                    color: "#444",
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setOpen(false)}
            style={{
              marginTop: "20px",
              padding: "8px 16px",
              background: "#4a90e2",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
