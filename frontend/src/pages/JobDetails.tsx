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

    axios.get('http://localhost:5000/api/jobs/all').then(res => {
      const found = res.data.find((j: any) => j.id.toString() === id);
      setJob(found);
    });
  }, [id]);

  useEffect(() => {
    if (user?.role === 'client' && job?.clientId === user.id) {
      axios.get(`http://localhost:5000/api/applications/job/${job.id}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      })
      .then(res => setApplications(res.data))
      .catch(err => console.error("Error fetching applications:", err));
    }
  }, [user, job]);

  const handleApply = async () => {
    try {
      await axios.post('http://localhost:5000/api/applications/apply', {
        jobId: job.id,
        freelancerId: user.id,
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
        jobId: job.id
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      navigate(`/escrow/${job.id}`); // Proceed to Escrow deposit page for this job
    } catch (error) {
      alert('Failed to hire freelancer');
    }
  };

  if (!job) return <div className="text-center mt-20 text-xl font-medium text-gray-600">Loading Job Details...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {job.riskLevel === 'High' && (
          <div className="bg-red-50 text-red-700 p-4 flex items-start border-b border-red-100">
            <ShieldAlert className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">High Risk Job Warning</p>
              <p className="text-sm">The budget for this job seems unusually low for the platform average. Proceed with caution and ensure Escrow is funded before starting work.</p>
            </div>
          </div>
        )}
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {job.status}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">₹{job.budget}</div>
              <div className="text-gray-500 font-medium text-sm mt-1">Fixed Price</div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 mb-10 border-t border-b border-gray-100 py-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Project Description</h3>
            <p className="whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> Action Dashboard
            </h3>
            
            {!user ? (
              <p className="text-sm font-medium text-gray-600">Please log in to apply or interact with this job.</p>
            ) : user.role === 'freelancer' && job.status === 'open' ? (
              <div className="space-y-4">
                <textarea 
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Write your proposal here..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <button 
                  onClick={handleApply}
                  disabled={!proposalText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition w-full sm:w-auto"
                >
                  Submit Proposal
                </button>
              </div>
            ) : user.role === 'client' && job.clientId === user.id && job.status === 'open' ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Proposals ({applications.length})</p>
                {applications.length === 0 && <p className="text-sm text-gray-500">No applications yet.</p>}
                {applications.map((app: any) => (
                  <div key={app.id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                        <span className="font-bold">{app.User?.name}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Trust:{app.User?.trustScore || 50}</span>
                      </div>
                      <p className="text-sm text-gray-600 italic">"{app.proposal}"</p>
                    </div>
                    <button 
                      onClick={() => handleHire(app.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded shadow-sm transition ml-0 md:ml-4"
                    >
                      Hire & Escrow
                    </button>
                  </div>
                ))}
              </div>
            ) : job.status === 'in-progress' || job.status === 'completed' ? (
              <div>
                <p className="font-semibold text-gray-800 mb-3">Job is currently {job.status}.</p>
                <button 
                  onClick={() => navigate(`/escrow/${job.id}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition shadow-sm"
                >
                  Go to Escrow Dashboard
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No actions available at this time.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
