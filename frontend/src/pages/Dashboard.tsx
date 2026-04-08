import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ShieldCheck, Target, Plus, UploadCloud, CheckCircle, Lock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [otpInput, setOtpInput] = useState('');
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const dashboardJobs = res.data.filter((j: any) => 
        j.clientId === userData.id || j.freelancerId === userData.id
      );
      setJobs(dashboardJobs);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleVerify = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('idDocument', selectedFile);
    try {
      await axios.post(`http://localhost:5000/api/users/${user.id}/upload-id`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Profile Verified Successfully!');
      const updatedUser = { ...user, verified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      alert('Failed to upload ID document');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/verify-email', {
        userId: user.id || user._id,
        otp: otpInput
      });
      alert('Email Verified Successfully!');
      const updatedUser = { ...user, isEmailVerified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOtpInput('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify email');
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', {
        userId: user.id || user._id
      });
      alert('A new Verification Code has been generated. Check your backend terminal!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  if (!user) return null;

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j: any) => j.status === 'open' || j.status === 'in-progress').length;
  const completedJobs = jobs.filter((j: any) => j.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[max(calc(100vh-64px),400px)] pt-4 pb-0">
      <div className="flex-1 space-y-6">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-extrabold text-[#1A2B4A] mb-2 tracking-tight">Hello, {user.name} 👋</h1>
              <p className="text-gray-500 font-medium text-lg">{user.role === 'client' ? 'Client' : 'Freelancer'} Dashboard</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {user.role === 'freelancer' && (
                <div className="bg-[#FFFBEB] rounded-xl px-6 py-4 min-w-[120px] text-center border border-[#FDE68A]">
                  <p className="text-xs font-bold text-[#D97706] uppercase tracking-widest mb-1">Trust Score</p>
                  <p className="text-3xl font-extrabold text-[#B45309]">{user.trustScore || 50}</p>
                </div>
              )}
              <div className="bg-[#F0F4F8] rounded-xl px-6 py-4 min-w-[120px] text-center border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Jobs</p>
                <p className="text-3xl font-extrabold text-[#1A2B4A]">{totalJobs}</p>
              </div>
              <div className="bg-blue-50 rounded-xl px-6 py-4 min-w-[120px] text-center border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Active</p>
                <p className="text-3xl font-extrabold text-blue-700">{activeJobs}</p>
              </div>
              <div className="bg-green-50 rounded-xl px-6 py-4 min-w-[120px] text-center border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Completed</p>
                <p className="text-3xl font-extrabold text-[#10B981]">{completedJobs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#1A2B4A] flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-[#1A2B4A]" />
                  Your Associated Jobs
                </h2>
                {user.role === 'client' && (
                  <button 
                    onClick={() => navigate('/post-job')}
                    className="bg-[#F59E0B] text-white hover:bg-orange-600 px-5 py-2.5 rounded-full font-bold shadow-sm shadow-orange-100 transition flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5 font-bold" /> Post Job
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 overflow-hidden border-2 border-dashed border-gray-200 rounded-xl bg-[#F0F4F8] h-[300px]">
                    <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
                      <Briefcase className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-[#1A2B4A] font-medium text-center max-w-sm">
                      No active jobs yet. {user.role === 'client' ? 'Post your first job to get started.' : 'Browse the job board to find your first gig!'}
                    </p>
                  </div>
                ) : (
                  jobs.map((job: any) => (
                    <div key={job._id || job.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="font-bold text-lg text-[#1A2B4A] mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 font-medium">
                           <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-[#F59E0B] bg-opacity-10 text-[#F59E0B]' : job.status === 'completed' ? 'bg-[#10B981] bg-opacity-10 text-[#10B981]' : 'bg-blue-50 text-blue-700'}`}>
                            {job.status}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span>Budget: ₹{job.budget}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button onClick={() => navigate(`/jobs/${job._id || job.id}`)} className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition sm:w-auto w-1/2">Details</button>
                        <button onClick={() => navigate(`/escrow/${job._id || job.id}`)} className="bg-[#F0F4F8] hover:bg-gray-200 text-[#1A2B4A] px-4 py-2 rounded-lg text-sm font-bold transition sm:w-auto w-1/2">Escrow</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Verification */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full relative overflow-hidden">
              <h2 className="text-xl font-bold text-[#1A2B4A] flex items-center mb-6 pb-4 border-b border-gray-100">
                <Target className="w-6 h-6 mr-3 text-[#1A2B4A]" />
                Verification Status
              </h2>

              {!user.verified ? (
                <>
                  <div className="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-xl mb-8 flex items-start">
                    <AlertTriangle className="w-5 h-5 text-[#F59E0B] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-[#D97706] mb-1">Verification Required</p>
                      <p className="text-xs text-[#B45309] leading-relaxed">Complete your KYC to unlock premium features and increase your trust score.</p>
                    </div>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="space-y-7 relative mb-10 pl-2">
                    <div className="absolute left-[17px] top-[24px] bottom-[30px] w-0.5 bg-gray-100"></div>
                    
                    {/* Step 1 */}
                    {user.isEmailVerified ? (
                      <div className="flex relative z-10">
                        <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center border-[3px] border-white flex-shrink-0 mr-4 shadow-sm">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="pt-1.5 flex-1">
                          <p className="font-bold text-[#1A2B4A] text-sm">Email Verified</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex relative z-10">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-[3px] border-white flex-shrink-0 mr-4 shadow-sm ring-4 ring-blue-50">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                        <div className="w-full">
                          <p className="font-bold text-[#1A2B4A] text-sm mb-2 pt-1.5">Verify your Email</p>
                          <p className="text-xs text-gray-500 mb-3 block">Enter the 6-digit code sent to your email.</p>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="text" 
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="000000"
                              maxLength={6}
                              className="border border-gray-300 rounded-lg px-3 py-2 w-28 text-center tracking-[0.2em] font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            <button onClick={handleVerifyEmail} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm text-sm transition">Verify</button>
                            <button onClick={handleResendOtp} className="text-blue-600 font-semibold hover:text-blue-800 text-xs px-2">Resend</button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2 */}
                    <div className={`flex relative z-10 transition-opacity duration-300 ${!user.isEmailVerified ? 'opacity-40 pointer-events-none' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white flex-shrink-0 mr-4 shadow-sm ${user.isEmailVerified ? 'bg-blue-600 ring-4 ring-blue-50' : 'bg-gray-300'}`}>
                        <span className="text-white text-xs font-bold">2</span>
                      </div>
                      <div className="w-full">
                        <p className="font-bold text-[#1A2B4A] text-sm mb-3 pt-1">Upload Government ID</p>
                        <div className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 bg-[#F0F4F8] hover:bg-white'}`}>
                          <UploadCloud className={`w-8 h-8 mx-auto mb-3 ${selectedFile ? 'text-blue-500' : 'text-gray-400'}`} />
                          {selectedFile ? (
                            <p className="text-sm font-bold text-blue-700 truncate px-2">{selectedFile.name}</p>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-gray-700 mb-1">Click to choose file</p>
                              <p className="text-xs text-gray-500 font-medium">or drag and drop here</p>
                            </>
                          )}
                          <input 
                            type="file" 
                            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Upload ID"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex relative z-10 opacity-60">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-[3px] border-white flex-shrink-0 mr-4">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div className="pt-1.5">
                        <p className="font-bold text-gray-400 text-sm">Admin Approval</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleVerify}
                    disabled={!selectedFile || !user.isEmailVerified}
                    className="w-full bg-[#F59E0B] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-100 mt-auto"
                  >
                    Upload & Verify ID
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                  <div className="w-24 h-24 bg-[#10B981] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="w-12 h-12 text-[#10B981]" />
                  </div>
                  <h3 className="font-extrabold text-2xl text-[#1A2B4A] mb-2">Profile Verified</h3>
                  <p className="text-gray-500 font-medium max-w-[220px]">Your identity has been securely verified. Trust score boosted!</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-8 mt-4 border-t border-[#1A2B4A] border-opacity-5">
        <p className="text-center text-xs text-gray-400 font-bold tracking-wide">
          KaryaSeva © 2025 · INDIA FIRST · SECURE PAYMENTS · GST COMPLIANT · POWERED BY BLOCKCHAIN
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
