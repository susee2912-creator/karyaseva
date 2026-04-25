import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ShieldCheck, Target, Plus, UploadCloud, CheckCircle, Lock, AlertTriangle, IndianRupee, PlaySquare, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const matchingId = user ? (user._id || user.id) : null;
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch Jobs
    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const associatedJobs = res.data.filter((j: any) => {
        if (!j) return false;
        return j.clientId === matchingId || j.freelancerId === matchingId;
      });

      if (user.role === 'freelancer') {
        // Also fetch applications for freelancers
        axios.get(`http://localhost:5000/api/applications/freelancer/${matchingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(appRes => {
          // Merge application jobs with associated jobs to avoid duplicates
          const appJobs = appRes.data.map((app: any) => ({
            ...app.jobId,
            applicationStatus: app.status,
            isProposal: true
          }));
          
          const merged = [...associatedJobs];
          appJobs.forEach((aj: any) => {
            if (!merged.find((mj: any) => (mj._id || mj.id) === (aj._id || aj.id))) {
              merged.push(aj);
            }
          });
          setJobs(merged);
        }).catch(err => console.error(err));
      } else {
        setJobs(associatedJobs);
      }
    }).catch(err => {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  }, [navigate, matchingId]);


  if (!user) return null;

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j: any) => j.status === 'open' || j.status === 'in-progress' || j.status === 'under-review').length;
  const completedJobs = jobs.filter((j: any) => j.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto flex flex-col pt-8 pb-12 px-4 sm:px-6">
      
      {/* Dark Navy Welcome Banner */}
      <div className="bg-[#1A2B4A] rounded-xl shadow-lg border border-white/10 p-8 w-full mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Hello, {user.name} 👋</h1>
            <p className="text-gray-400 font-medium text-lg uppercase tracking-wider">{user.role === 'client' ? 'Client Dashboard' : 'Freelancer Dashboard'}</p>
          </div>
          
          <div className="bg-[#1A2B4A] border-2 border-[#F59E0B] rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest mb-1 shadow-sm">Trust Score</p>
            <p className="text-3xl font-extrabold text-white">{user.trustScore || 50}</p>
          </div>
        </div>
      </div>

      {/* Three Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Briefcase className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">{user.role === 'client' ? 'Total Jobs Posted' : 'Total Applications'}</p>
            <p className="text-3xl font-extrabold text-[#1A2B4A]">{totalJobs}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mr-4">
            <PlaySquare className="w-7 h-7 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">{user.role === 'client' ? 'Active Jobs' : 'Active Projects'}</p>
            <p className="text-3xl font-extrabold text-[#1A2B4A]">{activeJobs}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-4">
            {user.role === 'freelancer' ? <IndianRupee className="w-7 h-7 text-[#10B981]" /> : <CheckSquare className="w-7 h-7 text-[#10B981]" />}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">{user.role === 'client' ? 'Completed Jobs' : 'Total Earned'}</p>
            <p className="text-3xl font-extrabold text-[#1A2B4A]">{completedJobs}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Jobs / Proposals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#1A2B4A] flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-[#1A2B4A]" />
                {user.role === 'client' ? 'Your Associated Jobs' : 'My Proposals'}
              </h2>
              {user.role === 'client' ? (
                <button 
                  onClick={() => navigate('/post-job')}
                  className="bg-[#F59E0B] text-white hover:bg-[#D97706] px-5 py-2.5 rounded-full font-bold shadow-md transition flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1.5 font-bold" /> Post Job
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/jobs')}
                  className="text-[#F59E0B] hover:text-[#D97706] font-bold transition flex items-center text-sm"
                >
                  Browse Jobs →
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-[#F0F4F8] h-[300px]">
                  <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                    <Briefcase className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-[#1A2B4A] font-medium text-center">
                    No active jobs yet. {user.role === 'client' ? 'Post your first job to get started.' : 'Browse the job board to find your first gig!'}
                  </p>
                </div>
              ) : (
                jobs.map((job: any) => (
                  <div key={job._id || job.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="font-extrabold text-lg text-[#1A2B4A] mb-1">{job.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 font-medium">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-orange-100 text-orange-700' : job.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {job.status}
                        </span>
                        {job.isProposal && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                            Proposal: {job.applicationStatus}
                          </span>
                        )}
                        <span className="mx-2">•</span>
                        <span>₹{job.budget}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button onClick={() => navigate(`/jobs/${job._id || job.id}`)} className="text-[#1A2B4A] border border-[#1A2B4A] hover:bg-[#1A2B4A] hover:text-white font-bold text-sm px-4 py-2 rounded-lg transition sm:w-auto w-1/2 text-center">Details</button>
                      {(job.clientId === matchingId || job.freelancerId === matchingId) && job.status !== 'open' && (
                        <button onClick={() => navigate(`/escrow/${job._id || job.id}`)} className="bg-[#1A2B4A] hover:bg-[#111C33] text-white px-4 py-2 rounded-lg text-sm font-bold transition sm:w-auto w-1/2 text-center">Escrow</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Verification */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-full">
            <h2 className="text-xl font-bold text-[#1A2B4A] flex items-center mb-6 pb-4 border-b border-gray-100">
              <Target className="w-6 h-6 mr-3 text-[#1A2B4A]" />
              Verification Status
            </h2>

              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-[#10B981]" />
                </div>
                <h3 className="font-extrabold text-2xl text-[#1A2B4A] mb-2">Profile Verified</h3>
                <p className="text-gray-500 font-medium">Your identity has been securely verified. Trust score boosted!</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
