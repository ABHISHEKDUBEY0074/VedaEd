import React, { useState, useEffect } from "react";
import { FiHelpCircle } from "react-icons/fi";

// Helper function to parse description into sections
function parseDescription(description) {
  if (!description) return [];

  const sections = [];
  const lines = description.split("\n");
  let currentSection = null;
  let currentContent = [];
  let inSectionsBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a section header (e.g., "2.1 All Students Tab", "2.2 Manage Login Tab")
    if (line.match(/^\d+\.\d+\s+.*Tab/)) {
      // Save previous section if exists
      if (currentSection) {
        sections.push({
          title: currentSection.title,
          content: currentContent.join("\n").trim(),
        });
      }
      // Start new section
      const sectionTitle = line.replace(/^\d+\.\d+\s+/, "").trim();
      currentSection = { title: sectionTitle };
      currentContent = [];
      inSectionsBlock = false;
    }
    // Check for "Sections:" heading
    else if (line.toLowerCase() === "sections:") {
      inSectionsBlock = true;
      if (currentSection) {
        currentContent.push("\n**Sections:**");
      }
    }
    // Regular content line
    else if (line) {
      if (currentSection) {
        currentContent.push(line);
      }
    }
  }

  // Add last section
  if (currentSection) {
    sections.push({
      title: currentSection.title,
      content: currentContent.join("\n").trim(),
    });
  }

  // If no sections found, return the whole description as one section
  if (sections.length === 0) {
    return [
      {
        title: "Description",
        content: description,
      },
    ];
  }

  return sections;
}

// Card component for each section
function HelpCard({
  title,
  content,
  defaultExpanded = false,
  forceExpanded = false,
  onToggle,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded || forceExpanded);

  useEffect(() => {
    if (forceExpanded) {
      setExpanded(true);
    }
  }, [forceExpanded]);

  // Check if content is long enough to need expansion
  const needsExpansion = content.length > 300;
  const displayContent =
    expanded || !needsExpansion ? content : content.substring(0, 300) + "...";

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onToggle) onToggle(newExpanded);
  };

  return (
    <div
      style={{
        border: "1px solid #e6e9f0",
        borderRadius: "8px",
        padding: "14px",
        marginBottom: "12px",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Card Title */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#1c2c4a",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      {/* Card Content */}
      <div
        style={{
          maxHeight: expanded ? "none" : needsExpansion ? "120px" : "none",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <p
          style={{
            color: "#555",
            fontSize: "13px",
            lineHeight: "18px",
            whiteSpace: "pre-line",
            margin: 0,
          }}
        >
          {displayContent}
        </p>
        {!expanded && needsExpansion && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30px",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 90%)",
            }}
          />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {needsExpansion && (
        <button
          onClick={handleToggle}
          style={{
            marginTop: "8px",
            background: "none",
            border: "none",
            color: "#4a90e2",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
            padding: 0,
          }}
        >
          {expanded ? "Show Less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function HelpInfo({ title, description, steps }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [expanded, setExpanded] = useState(false);
  const sections = parseDescription(description);
  const [expandedCards, setExpandedCards] = useState(new Set());

  useEffect(() => {
    setExpanded(false);
    setExpandedCards(new Set());
    setForceExpandAll(false);
  }, [activeTab]);

  const [forceExpandAll, setForceExpandAll] = useState(false);

  const expandAll = () => {
    const allIndices = new Set(sections.map((_, i) => i));
    setExpandedCards(allIndices);
    setExpanded(true);
    setForceExpandAll(true);
  };

  const handleCardToggle = (index, isExpanded) => {
    const newSet = new Set(expandedCards);
    if (isExpanded) {
      newSet.add(index);
    } else {
      newSet.delete(index);
    }
    setExpandedCards(newSet);
  };

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
      {/* SIDE DRAWER MODAL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? "0" : "-500px",
          width: "420px",
          height: "100vh",
          background: "#fff",
          borderLeft: "1px solid #ddd",
          padding: "20px",
          zIndex: 101,
          boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
          transition: "right 0.3s ease",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "12px",
              right: "14px",
              background: "none",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#888",
            }}
          >
            ×
          </button>
        )}

        {/* Title */}
        <h2
          style={{
            marginBottom: "10px",
            fontSize: "20px",
            fontWeight: "600",
            color: "#1c2c4a",
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

        {/* CONTENT AREA */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginBottom: "16px",
          }}
        >
          {/* DESCRIPTION CONTENT - CARDS */}
          {activeTab === "description" && (
            <div>
              {sections.length > 0 ? (
                sections.map((section, index) => (
                  <HelpCard
                    key={index}
                    title={section.title}
                    content={section.content}
                    defaultExpanded={expandedCards.has(index) || index === 0}
                    forceExpanded={forceExpandAll}
                    onToggle={(isExpanded) =>
                      handleCardToggle(index, isExpanded)
                    }
                  />
                ))
              ) : (
                <div
                  style={{
                    maxHeight: expanded ? "none" : "220px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      lineHeight: "20px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {description}
                  </p>
                  {!expanded && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "40px",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 80%)",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEPS CONTENT */}
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
        </div>

        {/* FOOTER BUTTON */}
        <button
          onClick={expandAll}
          style={{
            padding: "8px 16px",
            background: "transparent",
            color: "#4a90e2",
            border: "1px solid #4a90e2",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            alignSelf: "flex-start",
            marginTop: "12px",
          }}
        >
          View All
        </button>
      </div>
    </>
  );
}
