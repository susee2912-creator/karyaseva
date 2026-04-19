import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Users, FolderKanban } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch from admin API, but here we can mock it 
    // since we don't have a full admin endpoint created yet. 
    // We will just show the UI structure.
    setLoading(false);
  }, []);

  if (loading) return <div>Loading Admin Panel...</div>;

  return (
    <div className="bg-[#F0F4F8] min-h-[calc(100vh-80px)] py-12 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#1A2B4A] mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Users</p>
            <p className="text-2xl font-extrabold">1,240</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users className="w-6 h-6"/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Active Jobs</p>
            <p className="text-2xl font-extrabold">342</p>
          </div>
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><FolderKanban className="w-6 h-6"/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Fraud Flags</p>
            <p className="text-2xl font-extrabold text-red-600">12</p>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-full"><ShieldAlert className="w-6 h-6"/></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-gray-800">Pending KYC Verifications</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
           System working perfectly. No pending verifications.
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
