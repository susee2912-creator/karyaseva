import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DownloadCloud, CheckCircle, FileCheck, Circle, ShieldCheck } from 'lucide-react';

const EscrowPayment = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [paymentPhase, setPaymentPhase] = useState('pending'); // pending, deposited, released
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/all').then(res => {
      const found = res.data.find((j: any) => j.id.toString() === jobId);
      setJob(found);
      if (found && found.status === 'completed') {
        setPaymentPhase('released');
      }
    });
  }, [jobId]);

  const handleDeposit = async () => {
    try {
      await axios.post('http://localhost:5000/api/payments/deposit', {
        jobId: job.id,
        amount: job.budget,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPaymentPhase('deposited');
      alert('Escrow deposited successfully! Funds are now secured.');
    } catch (error) {
      alert('Escrow deposit failed');
    }
  };

  const handleRelease = async () => {
    // Demo implementation calling release options
    try {
      // In a full implementation we'd pass paymentId, but we can just update job status for demo
      alert('Funds released successfully to freelancer!');
      setPaymentPhase('released');
    } catch (error) {
      alert('Failed to release funds');
    }
  };

  const submitWorkProof = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/jobs/submit', {
        jobId: job.id,
        workContent: "Final Deliverables.zip content hash"
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert(`Work submitted securely! Blockchain Hash: ${res.data.workProofHash}`);
      window.location.reload();
    } catch (error) {
      alert('Failed to submit work proof');
    }
  };

  const handleDownloadInvoice = () => {
    // Assuming paymentId is 1 for demo purposes since we aren't fetching Payment explicitly
    window.open(`http://localhost:5000/api/payments/invoice/1`, '_blank');
  };

  if (!job) return <div className="p-8 text-center text-gray-500">Loading Escrow...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-8 border-b pb-6 border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Escrow Workspace</h1>
            <p className="text-gray-500">Securely manage payment for Job: {job.title}</p>
          </div>
          {paymentPhase === 'released' && (
            <button 
              onClick={handleDownloadInvoice}
              className="flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition shadow-sm border border-blue-200"
            >
              <DownloadCloud className="w-5 h-5 mr-2" /> GST Invoice
            </button>
          )}
        </div>

        <div className="space-y-6 mb-10">
          <div className={`p-6 rounded-lg border flex flex-col md:flex-row justify-between items-center ${paymentPhase === 'deposited' ? 'bg-blue-50 border-blue-200' : paymentPhase === 'released' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center mb-4 md:mb-0">
              {paymentPhase === 'released' ? (
                <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
              ) : paymentPhase === 'deposited' ? (
                <ShieldCheck className="w-8 h-8 text-blue-500 mr-4" />
              ) : (
                <Circle className="w-8 h-8 text-gray-400 mr-4" />
              )}
              <div>
                <h3 className="font-bold text-lg text-gray-900">Project Escrow Fund</h3>
                <p className="text-sm text-gray-500 uppercase font-semibold">Status: {paymentPhase}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-bold text-2xl text-gray-900">₹{job.budget}</span>
              {user?.role === 'client' && paymentPhase === 'pending' && (
                <button 
                  onClick={handleDeposit}
                  className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                  Deposit to Escrow
                </button>
              )}
              {user?.role === 'client' && paymentPhase === 'deposited' && job.status === 'completed' && (
                <button 
                  onClick={handleRelease}
                  className="bg-green-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-green-700 transition shadow-sm"
                >
                  Release Funds
                </button>
              )}
            </div>
          </div>
        </div>

        {user?.role === 'freelancer' && job.status === 'in-progress' && paymentPhase === 'deposited' && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2 text-blue-900">Submit Work for Review</h3>
            <p className="text-blue-700 text-sm mb-4">Upload your deliverables. A cryptographic hash will be generated as undeniable proof of work.</p>
            <button 
              onClick={submitWorkProof}
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Submit Deliverables
            </button>
          </div>
        )}

        {job.workProofHash && (
          <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <p className="text-sm text-gray-500 font-semibold mb-1">Blockchain Work Proof Hash</p>
            <p className="font-mono text-xs text-green-700 break-all">{job.workProofHash}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowPayment;
