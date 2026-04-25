import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Briefcase, Filter, ShieldCheck } from 'lucide-react';

const JobBoard = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#F0F4F8] min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#1A2B4A] mb-8">Browse Jobs</h1>
        
        {/* Search and Filter Row */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search for Indian freelancing projects..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] transition bg-gray-50 text-[#1A2B4A] font-medium text-lg placeholder-gray-400"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Filter className="w-5 h-5 text-gray-500" />
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-bold text-[#1A2B4A] bg-white w-full md:w-40 focus:ring-2 focus:ring-[#1A2B4A]">
                <option>All Skills</option>
                <option>React</option>
                <option>Node.js</option>
                <option>Design</option>
              </select>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-bold text-[#1A2B4A] bg-white w-full md:w-40 focus:ring-2 focus:ring-[#1A2B4A]">
                <option>Budget: All</option>
                <option>₹0 - ₹10,000</option>
                <option>₹10,000+</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Risk Level:</span>
              <button className="bg-[#1A2B4A] text-white px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm">All</button>
              <button className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition">Low</button>
              <button className="bg-orange-100 text-[#D97706] hover:bg-orange-200 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition">Medium</button>
              <button className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition">High</button>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B4A] mx-auto"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1A2B4A]">No jobs found</h3>
            <p className="text-gray-500 mt-2">Adjust your filters or be the first to post a job.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job: any) => (
              <div key={job._id || job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full overflow-hidden group">
                <div className="p-6 flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-xl text-[#1A2B4A] group-hover:text-blue-700 transition leading-tight">{job.title}</h3>
                  </div>

                  <div className="flex items-center mb-5 border-b border-gray-100 pb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 border border-gray-200">
                      <Building className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1A2B4A] flex items-center">
                        Unknown Client 
                        <span title="KYC Verified" className="flex items-center ml-1">
                          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5"><MapPin className="w-3 h-3 mr-1" /> India</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
                    {job.description}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">React</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">Node.js</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">Web</span>
                  </div>

                  <div className="flex items-center justify-between mt-auto mb-4 bg-[#F0F4F8] p-3 rounded-lg">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-xl font-extrabold text-[#F59E0B]">₹{job.budget?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-gray-500 mb-1">Deadline</p>
                       <p className="text-xs font-medium text-[#1A2B4A]">In 14 days</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6 px-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                      job.riskLevel === 'Low' ? 'bg-green-100 text-green-700' : 
                      job.riskLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-[#D97706]'
                    }`}>
                      {job.riskLevel} Risk
                    </span>
                    <span className="text-[11px] font-bold text-[#1A2B4A] border border-gray-200 px-2 py-1 rounded bg-white">
                      Trust: 85/100
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/jobs/${job._id || job.id}`)}
                    className="w-full bg-[#F59E0B] text-white hover:bg-[#D97706] text-center font-extrabold py-3.5 rounded-xl shadow-md transition"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
