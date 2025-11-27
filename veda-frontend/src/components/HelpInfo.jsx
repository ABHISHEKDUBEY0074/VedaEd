import React, { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";

function parseDescription(description) {
  if (!description) return [];
  const out = [];
  const lines = description.split("\n");

  let title = null;
  let body = [];

  lines.forEach((line) => {
    line = line.trim();

    if (/^\d+\.\d+\s+/.test(line)) {
      if (title) {
        out.push({
          title,
          content: body.join("\n").trim(),
        });
      }

      title = line.replace(/^\d+\.\d+\s+/, "").trim();
      body = [];
    } else if (line.length) {
      body.push(line);
    }
  });

  if (title) {
    out.push({ title, content: body.join("\n").trim() });
  }

  return out;
}

// 🟦 UPDATED HELPCARD — subheading + highlight support
function HelpCard({ content, expanded, onToggle, subheading }) {
  const long = content.length > 250;
  const visible =
    expanded || !long ? content : content.substring(0, 250) + "...";

  return (
    <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50">
      {/* SUBHEADING INSIDE CARD (blue highlight) */}
      {subheading && (
        <div className="text-[14px] font-semibold text-blue-600 mb-2">
          {subheading}
        </div>
      )}

      <div className="relative overflow-hidden">
        <p className="text-gray-600 text-[13px] leading-5 whitespace-pre-line">
          {visible}
        </p>

        {!expanded && long && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white"></div>
        )}
      </div>

      {long && (
        <button
          onClick={onToggle}
          className="mt-2 text-blue-500 text-[13px] hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function HelpInfo({ title, description, steps }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("description");

  const sections = parseDescription(description);

  const toggleCard = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  // 🟩 NEW — VIEW ALL FUNCTION
  const expandAll = () => {
    const obj = {};
    obj[999] = true; // page description
    sections.slice(1).forEach((_, i) => (obj[i] = true));
    setExpanded(obj);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open help information"
        className="text-gray-700 text-[22px] rounded-full p-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      >
        <FiHelpCircle />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-[90]"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl z-[100] transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-3 text-gray-500 text-2xl"
        >
          ×
        </button>

        <h2 className="text-[20px] font-semibold text-[#1c2c4a] mt-4 mb-3 ml-3">
          {title}
        </h2>

        <div className="flex gap-6 border-b border-gray-200 px-3 mb-3">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 text-[15px] ${
              activeTab === "description"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("steps")}
            className={`pb-2 text-[15px] ${
              activeTab === "steps"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
          >
            Steps
          </button>
        </div>

        <div className="h-[calc(100%-120px)] overflow-y-auto px-3 pb-5">
          {activeTab === "description" && (
            <>
              <h3 className="text-[16px] font-semibold text-[#1c2c4a] mb-2">
                {title}
              </h3>

              <HelpCard
                content={"Page Description:\n" + (sections[0]?.content || "")}
                expanded={expanded[999]}
                onToggle={() => toggleCard(999)}
                subheading={"Main Page Description"} // 🟦 example highlight
              />

              {sections.slice(1).map((sec, i) => (
                <div key={i} className="mt-5">
                  <h3 className="text-[16px] font-semibold text-[#1c2c4a] mb-2">
                    {sec.title}
                  </h3>

                  <HelpCard
                    content={sec.content}
                    expanded={expanded[i]}
                    onToggle={() => toggleCard(i)}
                    subheading={sec.title + " - Details"} // 🟦 highlight inside card
                  />
                </div>
              ))}

              {/* 🟩 VIEW ALL BUTTON */}
              <div className="w-full flex justify-center mt-6">
                <button
                  onClick={expandAll}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  View All
                </button>
              </div>
            </>
          )}

          {activeTab === "steps" && (
            <ul className="list-disc pl-6 space-y-2 text-[14px] text-gray-700">
              {steps?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
