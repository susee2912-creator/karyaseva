import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, AlertTriangle } from 'lucide-react';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));

    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setJobs(res.data);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Explore Open Jobs</h1>
          <p className="text-gray-500 mt-1">Find your next big opportunity with secure Smart Escrow.</p>
        </div>
        {user?.role === 'client' && (
          <button 
            onClick={() => navigate('/post-job')}
            className="bg-blue-600 font-medium text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Post a New Job
          </button>
        )}
      </div>

      <div className="flex mb-8">
        <div className="relative w-full max-w-lg">
          <input 
            type="text" 
            placeholder="Search by keyword, skills, etc."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
            No jobs found matching your criteria.
          </div>
        ) : (
          jobs.map((job: any) => (
            <div key={job._id || job.id} onClick={() => navigate(`/jobs/${job._id || job.id}`)} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h2 className="text-xl font-bold text-gray-900 mr-3">{job.title}</h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {job.status.toUpperCase()}
                  </span>
                  {job.riskLevel === 'High' && (
                    <span className="ml-2 flex flex-center text-xs font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 mr-1 inline" /> High Risk
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2 max-w-3xl">{job.description}</p>
                <div className="flex items-center text-sm font-medium text-gray-500 space-x-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">Budget: ₹{job.budget}</span>
                  <span>Posted just now</span>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <button className="text-blue-600 hover:text-blue-800 font-semibold p-2">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobBoard;
