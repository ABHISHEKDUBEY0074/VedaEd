import { useState, useEffect } from "react";
import StepIdentity from "./StepIdentity";
import StepBranding from "./StepBranding";
import StepDomain from "./StepDomain";
import StepModules from "./StepModules";
import Preview from "./Preview";
import { institutionAPI } from "../../services/institutionAPI";
import Swal from "sweetalert2";

import config from "../../config";

const steps = ["Identity", "Branding", "Domain", "Modules"];

export default function InstitutionSetup() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
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
    contact: {},
  });

  useEffect(() => {
    fetchInstitutionData();
  }, []);

  const fetchInstitutionData = async () => {
    try {
      setLoading(true);
      const res = await institutionAPI.getInstitution();
      if (res.success && res.data) {
        const institution = res.data;
        const baseUrl = `${config.SERVER_URL}/uploads/`;
        
        // Map backend filenames to preview URLs if not already objects
        if (institution.branding) {
           if (institution.branding.logo && typeof institution.branding.logo === 'string') {
               institution.branding.logoPreview = baseUrl + institution.branding.logo;
           }
           if (institution.branding.coverImage && typeof institution.branding.coverImage === 'string') {
               institution.branding.coverImagePreview = baseUrl + institution.branding.coverImage;
           }
        }
        setData(institution);
      }
    } catch (error) {
      console.error("Failed to fetch institution info", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status = "Draft") => {
    try {
      setLoading(true);
      
      // Handle file uploads first if they exist
      const formData = new FormData();
      let hasFiles = false;
      if (data.branding?.logo instanceof File) {
        formData.append("logo", data.branding.logo);
        hasFiles = true;
      }
      if (data.branding?.coverImage instanceof File) {
        formData.append("coverImage", data.branding.coverImage);
        hasFiles = true;
      }

      // First save the JSON data (Cleaned of File objects to avoid large payload)
      const sanitizedData = { ...data, status };
      if (sanitizedData.branding?.logo instanceof File) {
        sanitizedData.branding = { ...sanitizedData.branding, logo: "" };
      }
      if (sanitizedData.branding?.coverImage instanceof File) {
        sanitizedData.branding = { ...sanitizedData.branding, coverImage: "" };
      }

      const res = await institutionAPI.updateInstitution(sanitizedData);
      
      if (res.success && hasFiles) {
        // Then upload files if any
        await institutionAPI.uploadAssets(formData);
      }

      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Setup Saved",
          text: `Institution setup has been saved as ${status}.`,
          timer: 2000,
          showConfirmButton: false
        });
        fetchInstitutionData();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = () => handleSave("Published");

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
            <button 
                onClick={() => handleSave()} 
                disabled={loading}
                className="px-4 py-2 border rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Draft"}
            </button>
            <button 
                onClick={handlePublish}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
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