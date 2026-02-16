import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";

export default function AdmissionDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/dashboard/master-stats`);
        if (res.data.success) {
          setStats(res.data.stats.admission);
        }
      } catch (err) {
        console.error("Error fetching admission stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading Admission Dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Admission Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admission/enquiry" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Enquiries</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalEnquiries || 0}</p>
          <p className="text-xs text-gray-500 mt-1">General enquiries received</p>
        </Link>

        <Link to="/admission/application" className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider">Total Applications</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalApplications || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted admission forms</p>
        </Link>

        <div className="bg-white p-6 rounded-xl shadow transition">
          <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">Confirmed Admissions</h3>
          <p className="text-3xl font-bold mt-2">{stats?.confirmedAdmissions || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Approved & Completed</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
        <div className="flex gap-4 flex-wrap">
          <Link to="/admission/enquiry" className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium">Manage Enquiries</Link>
          <Link to="/admission/application" className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium">Review Applications</Link>
          <Link to="/admission/vacancy" className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 font-medium">Check Vacant Seats</Link>
          <Link to="/admission-enquiry" className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">Public Enquiry Page</Link>
        </div>
      </div>
    </div>
  );
}
