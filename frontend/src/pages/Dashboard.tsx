import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Target, Briefcase, Star } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    axios.get('http://localhost:5000/api/jobs/all').then(res => {
      const filtered = res.data.filter((j: any) => 
        userData.role === 'client' ? j.clientId === userData.id : j.freelancerId === userData.id || j.status === 'open'
      );
      // Let's filter to jobs actually relevant to user in dashboard
      const dashboardJobs = res.data.filter((j: any) => 
        j.clientId === userData.id || j.freelancerId === userData.id
      );
      setJobs(dashboardJobs);
    });
  }, [navigate]);

  const handleVerify = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('idDocument', selectedFile);
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${user.id}/upload-id`, formData, {
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

  const handleReview = async (jobId: number, freelancerId: number) => {
    const rating = prompt('Enter a rating for the freelancer (1-5):');
    if (!rating || isNaN(Number(rating))) return;
    const comment = prompt('Enter an optional review comment:');

    try {
      await axios.post('http://localhost:5000/api/reviews/add', {
        jobId, freelancerId, rating: Number(rating), comment
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert('Review submitted successfully! AI Trust Score has been updated.');
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {user.name}</h1>
          <p className="text-gray-500 flex items-center">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            {user.verified && <ShieldCheck className="w-5 h-5 text-green-500 ml-2" />}
          </p>
        </div>
        
        {user.role === 'freelancer' && (
          <div className="text-center bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center space-x-4">
            <div>
              <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide">AI Trust Score</h3>
              <p className="text-xs text-blue-600">Calculated across completions</p>
            </div>
            <div className="text-4xl font-extrabold text-blue-600">{user.trustScore || 50}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
              Your Associated Jobs
            </h2>
            {user.role === 'client' && (
              <button 
                onClick={() => navigate('/post-job')}
                className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md font-medium transition"
              >
                + Post Job
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <p className="text-gray-500">No active or completed jobs found.</p>
            ) : (
              jobs.map((job: any) => (
                <div key={job.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{job.title}</h3>
                    <span className={`flex-shrink-0 ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${job.status === 'open' ? 'bg-yellow-100 text-yellow-800' : job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-3">
                    <button onClick={() => navigate(`/jobs/${job.id}`)} className="text-indigo-600 hover:text-indigo-800 font-medium">View Job →</button>
                    <div className="space-x-2">
                      <button onClick={() => navigate(`/escrow/${job.id}`)} className="text-gray-600 hover:text-gray-800 font-medium">Escrow</button>
                      {user.role === 'client' && job.status === 'completed' && job.freelancerId && (
                        <button 
                          onClick={() => handleReview(job.id, job.freelancerId)}
                          className="text-yellow-600 hover:text-yellow-800 font-medium flex items-center"
                        >
                          <Star className="w-4 h-4 mr-1" /> Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
          <h2 className="text-xl font-bold flex items-center mb-6">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            Verification Status
          </h2>
          {user.verified ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 flex items-start">
              <ShieldCheck className="w-6 h-6 mr-3 mt-0.5" />
              <div>
                <p className="font-bold">Profile Verified</p>
                <p className="text-sm mt-1">Your identity has been securely verified. You gain an instant trust boost and access to high-value escrow jobs.</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 text-yellow-800 p-5 rounded-lg border border-yellow-200">
              <p className="font-bold mb-2 text-lg">Verification Required</p>
              <p className="text-sm mb-4">Complete your KYC to unlock premium features and increase your trust score across the platform.</p>
              
              <div className="space-y-3">
                <input 
                  type="file" 
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-yellow-200 transition"
                />
                <button 
                  onClick={handleVerify}
                  disabled={!selectedFile}
                  className="w-full bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-700 transition disabled:opacity-50 shadow-sm"
                >
                  Upload & Verify ID
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
