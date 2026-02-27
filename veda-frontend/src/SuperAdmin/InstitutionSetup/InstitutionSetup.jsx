import { useState } from "react";
import StepIdentity from "./StepIdentity";
import StepBranding from "./StepBranding";
import StepDomain from "./StepDomain";
import StepModules from "./StepModules";
import Preview from "./Preview";

const steps = ["Identity", "Branding", "Domain", "Modules"];

export default function InstitutionSetup() {
  const [step, setStep] = useState(0);
 const [data, setData] = useState({
  identity: {},
  branding: {},
  domain: {},
  modules: {
    sis: true,
    transport: true,
    fees: false,
    exams: true,
    hr: true,
    communication: true,
  },
});

  const CurrentStep = [
    StepIdentity,
    StepBranding,
    StepDomain,
    StepModules
  ][step];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT */}
      <div className="w-[65%] bg-white flex flex-col">
        {/* STEPS */}
        <div className="flex border-b">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`px-6 py-3 text-sm ${
                i === step
                  ? "border-b-2 border-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <CurrentStep data={data} setData={setData} />
        </div>

        {/* SAVE BAR */}
        <div className="border-t p-4 flex justify-between bg-white sticky bottom-0">
          <span className="text-sm text-gray-500">
            Changes not published
          </span>
          <div className="space-x-2">
            <button className="px-4 py-2 border rounded">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <Preview data={data} />
    </div>
  );
}