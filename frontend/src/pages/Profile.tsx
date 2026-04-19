import React, { useEffect, useState } from 'react';
import { User, Shield, Star, CheckCircle, Briefcase, Award } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  if (!user) return <div className="text-center mt-20 font-bold text-[#1A2B4A]">Loading Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      
      {/* Dark Navy Banner */}
      <div className="bg-[#1A2B4A] rounded-t-2xl shadow-lg p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        
        {user.verified && (
          <div className="absolute top-4 right-4 bg-[#10B981] text-white px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center tracking-wider uppercase">
            <Shield className="w-4 h-4 mr-1.5" /> Verified
          </div>
        )}

        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#1A2B4A] mb-6 md:mb-0 md:mr-8 border-4 border-[#F59E0B] shadow-xl relative z-10">
          <User className="w-16 h-16" />
        </div>
        
        <div className="flex-1 relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">{user.name}</h1>
          <span className="bg-white/10 border border-white/20 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider inline-block mb-4">
            {user.role}
          </span>
          <div className="flex items-center justify-center md:justify-start text-gray-300 font-medium">
            <span>{user.email}</span>
            {user.isEmailVerified && <CheckCircle className="w-4 h-4 ml-2 text-[#10B981]" />}
          </div>
        </div>

        {user.role === 'freelancer' && (
          <div className="mt-8 md:mt-0 bg-[#1A2B4A] border-2 border-[#F59E0B] rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] relative z-10">
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-1 shadow-sm">Trust Score</p>
            <p className="text-3xl font-extrabold text-white">{user.trustScore || 50}</p>
          </div>
        )}
      </div>

      {/* Grid Layout below banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-extrabold text-[#1A2B4A] mb-6 border-b border-gray-100 pb-3 flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#F59E0B]" /> Top Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#F0F4F8] text-[#1A2B4A] px-3 py-1 rounded-md text-sm font-bold">React.js</span>
            <span className="bg-[#F0F4F8] text-[#1A2B4A] px-3 py-1 rounded-md text-sm font-bold">Node.js</span>
            <span className="bg-[#F0F4F8] text-[#1A2B4A] px-3 py-1 rounded-md text-sm font-bold">Smart Contracts</span>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-extrabold text-[#1A2B4A] mb-6 border-b border-gray-100 pb-3 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-[#F59E0B]" /> Statistics
          </h3>
          <div className="flex justify-between items-center text-[#1A2B4A] mb-4">
            <span className="font-bold text-gray-500">Completed Projects</span>
            <span className="font-extrabold text-xl">{user.completedJobs || 0}</span>
          </div>
          <div className="flex justify-between items-center text-[#1A2B4A] mb-4">
            <span className="font-bold text-gray-500">Active Contracts</span>
            <span className="font-extrabold text-xl">1</span>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 list-none">
          <h3 className="text-lg font-extrabold text-[#1A2B4A] mb-6 border-b border-gray-100 pb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-[#F59E0B]" /> Recent Reviews
          </h3>
          <div className="p-4 border border-gray-100 rounded-xl bg-[#F0F4F8] mb-4">
            <div className="flex space-x-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]"/>)}
            </div>
            <p className="text-[#1A2B4A] font-medium text-sm">"Excellent work and very transparent with the blockchain escrow pipeline. Highly recommended!"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
