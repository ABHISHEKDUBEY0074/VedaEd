import React from "react";

export default function ParentClasses() {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <p className="text-gray-500 text-sm mb-2">Classes &gt;</p>

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-4">Child’s Classes</h2>

      {/* Placeholder / Future content */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm border text-gray-600">
        <p>Your child's enrolled class details will appear here.</p>
      </div>
    </div>
  );
}
