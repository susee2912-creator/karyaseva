import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle, FileText, User as UserIcon } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [proposalText, setProposalText] = useState('');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));

    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const found = res.data.find((j: any) => (j._id || j.id).toString() === id);
      setJob(found);
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  }, [id]);

  useEffect(() => {
    if (user?.role === 'client' && job && job.clientId === (user._id || user.id)) {
      axios.get(`http://localhost:5000/api/applications/job/${job._id || job.id}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      })
      .then(res => setApplications(res.data))
      .catch(err => console.error("Error fetching applications:", err));
    }
  }, [user, job]);

  const handleApply = async () => {
    try {
      await axios.post('http://localhost:5000/api/applications/apply', {
        jobId: job._id || job.id,
        freelancerId: user._id || user.id,
        proposal: proposalText
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert('Proposal submitted successfully!');
      setProposalText('');
    } catch (error) {
      alert('Failed to submit proposal');
    }
  };

  const handleHire = async (appId: number) => {
    try {
      await axios.post('http://localhost:5000/api/applications/hire', {
        applicationId: appId,
        jobId: job._id || job.id
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      navigate(`/escrow/${job._id || job.id}`); // Proceed to Escrow deposit page for this job
    } catch (error) {
      alert('Failed to hire freelancer');
    }
  };

  if (!job) return <div className="text-center mt-20 text-xl font-medium text-gray-600">Loading Job Details...</div>;

  return (
    <div className="bg-[#F0F4F8] min-h-[calc(100vh-80px)] py-12 px-4 shadow-inner">
      <div className="max-w-5xl mx-auto rounded-xl shadow-lg border border-gray-100 overflow-hidden bg-white">
        {job.riskLevel === 'High' && (
          <div className="bg-red-50 text-red-700 p-4 flex items-start border-b border-red-100">
            <ShieldAlert className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-extrabold text-sm uppercase tracking-wide">High Risk Job Warning</p>
              <p className="text-sm font-medium">The budget for this job seems unusually low for the platform average. Proceed with caution and ensure Escrow is funded before starting work.</p>
            </div>
          </div>
        )}
        
        <div className="bg-[#1A2B4A] p-8 text-white relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-3">{job.title}</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase ${job.status === 'open' ? 'bg-[#F59E0B] text-white' : 'bg-[#10B981] text-white'}`}>
                {job.status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Fixed Price Budget</p>
               <div className="text-4xl font-extrabold text-[#F59E0B]">₹{job.budget}</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="prose max-w-none text-gray-700 mb-10 pb-8 border-b border-gray-100">
            <h3 className="text-xl font-extrabold mb-4 text-[#1A2B4A] flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-400" /> Project Details
            </h3>
            <p className="whitespace-pre-line leading-relaxed font-medium">{job.description}</p>
          </div>

          <div className="bg-[#F0F4F8] p-8 rounded-xl border border-gray-200">
            <h3 className="font-extrabold text-xl mb-6 text-[#1A2B4A] flex items-center">
              <CheckCircle className="w-6 h-6 text-[#10B981] mr-2" /> Action Dashboard
            </h3>
            
            {!user ? (
              <p className="text-sm font-bold text-gray-500">Please log in to apply or interact with this job.</p>
            ) : user.role === 'freelancer' && job.status === 'open' ? (
              <div className="space-y-4">
                <textarea 
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Write your proposal here..."
                  className="w-full px-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1A2B4A] transition text-sm font-medium"
                  rows={4}
                />
                <button 
                  onClick={handleApply}
                  disabled={!proposalText.trim()}
                  className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-extrabold py-4 px-6 rounded-xl shadow-md transition"
                >
                  Submit Proposal
                </button>
              </div>
            ) : user.role === 'client' && job.clientId === (user._id || user.id) && job.status === 'open' ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#1A2B4A] mb-2 uppercase tracking-wide">Received Proposals ({applications.length})</p>
                {applications.length === 0 && <p className="text-sm text-gray-500 font-medium">No applications yet.</p>}
                {applications.map((app: any) => (
                  <div key={app.id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-3 border-b border-gray-100 pb-2">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                        <span className="font-extrabold text-[#1A2B4A] text-lg">{app.User?.name}</span>
                        <span className="text-xs bg-[#1A2B4A] text-[#F59E0B] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Score: {app.User?.trustScore || 50}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium italic pl-2 border-l-2 border-gray-200">"{app.proposal}"</p>
                    </div>
                    <button 
                      onClick={() => handleHire(app.id)}
                      className="w-full md:w-auto bg-[#10B981] hover:bg-green-600 text-white text-sm font-extrabold py-3 px-6 rounded-xl shadow-md transition ml-0 md:ml-6 mt-4 md:mt-0"
                    >
                      Hire & Escrow
                    </button>
                  </div>
                ))}
              </div>
            ) : job.status === 'in-progress' || job.status === 'completed' ? (
              <div>
                <p className="font-extrabold text-[#1A2B4A] mb-4">Job is currently {job.status}.</p>
                <button 
                  onClick={() => navigate(`/escrow/${job._id || job.id}`)}
                  className="bg-[#1A2B4A] hover:bg-[#111C33] text-white py-3 px-8 rounded-xl font-extrabold transition shadow-md"
                >
                  Go to Escrow Dashboard
                </button>
              </div>
            ) : (
              <p className="text-sm font-medium text-gray-500">No actions available at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
