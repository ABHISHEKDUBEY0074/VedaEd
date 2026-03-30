// src/AdminFees/FeeMaster/FeeMaster.jsx
import React, { useState } from "react";
import HelpInfo from "../../components/HelpInfo";

import AcademicYear from "./AcademicYear";
import FeeCategories from "./FeeCategories";
import GradeAssignment from "./GradeAssignment";
import InstallmentPlans from "./InstallmentPlans";
import LateFeePolicies from "./LateFeePolicies";
import Discounts from "./Discounts";
import FinesPenalties from "./FinesPenalties";

export default function FeeMaster() {
  const [activeTab, setActiveTab] = useState("academic-year");

  const renderTab = () => {
    switch (activeTab) {
      case "academic-year":
        return <AcademicYear />;
      case "fee-categories":
        return <FeeCategories />;
      case "grade-assignment":
        return <GradeAssignment />;
      case "installment-plans":
        return <InstallmentPlans />;
      case "late-fee-policies":
        return <LateFeePolicies />;
      case "discounts":
        return <Discounts />;
      case "fines-penalties":
        return <FinesPenalties />;
      default:
        return null;
    }
  };

  return (
    <div className="p-0 m-0">

      {/* Breadcrumb */}
      <div className="text-gray-500 text-sm mb-2 flex items-center gap-1">
        <span>Fees</span>
        <span>&gt;</span>
        <span>Fee Master</span>
      </div>

      {/* Heading + Help */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Fee Master</h2>

        <HelpInfo
          title="Fee Master Help"
          description={`Fee Master allows you to configure all fee-related settings.
          
• Academic Year setup  
• Fee Categories & structure  
• Grade-wise fee assignment  
• Installment & payment rules  
• Late fee policies  
• Discounts & penalties  

Each tab controls a specific fee configuration module.`}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6 text-sm mb-3 text-gray-600 border-b overflow-x-auto">
        {[
          ["academic-year", "Academic Year"],
          ["fee-categories", "Fee Categories"],
          ["grade-assignment", "Grade Assignment"],
          ["installment-plans", "Installment Plans"],
          ["late-fee-policies", "Late Fee Policies"],
          ["discounts", "Discounts"],
          ["fines-penalties", "Fines & Penalties"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`pb-2 whitespace-nowrap ${
              activeTab === key
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}