import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DownloadCloud, CheckCircle, FileCheck, Circle, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EscrowPayment = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [paymentPhase, setPaymentPhase] = useState('pending'); // pending, deposited, released
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const found = res.data.find((j: any) => (j._id || j.id).toString() === jobId);
      setJob(found);
      if (found && found.status === 'completed') {
        setPaymentPhase('released');
      }
    }).catch(err => {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }, [jobId]);

  const handleDeposit = async () => {
    try {
      await axios.post('http://localhost:5000/api/payments/deposit', {
        jobId: job._id || job.id,
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
      // Assuming payment already happened and we just tell backend to release.
      // We will pretend paymentId is the jobId for this demo or fetch it.
      await axios.post('http://localhost:5000/api/payments/release-options', {
        paymentId: job._id || job.id, // Mocked payment ID
        jobId: job._id || job.id,
        clientId: job.clientId,
        freelancerId: job.freelancerId
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      alert('Funds released successfully to freelancer!');
      setPaymentPhase('released');
    } catch (error) {
      alert('Failed to release funds');
    }
  };

  const submitWorkProof = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/jobs/submit', {
        jobId: job._id || job.id,
        workContent: "Final Deliverables.zip content hash"
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert(`Work submitted securely! Blockchain Hash: ${res.data.workProofHash}`);
      window.location.reload();
    } catch (error) {
      alert('Failed to submit work proof');
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      // Mocked payment ID fetch
      const res = await axios.get(`http://localhost:5000/api/payments/invoice/${job._id || job.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
      
      const { payment, invoiceData } = res.data;
      
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("KaryaSeva GST Invoice", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 40);
      doc.text(`Job: ${job.title}`, 14, 50);

      const amount = job.budget;
      const gstRate = 0.18;
      const baseAmount = amount / (1 + gstRate);
      const gstAmount = amount - baseAmount;

      autoTable(doc, {
        startY: 60,
        head: [['Description', 'Amount (INR)']],
        body: [
          ['Consulting Services / Freelance Work', baseAmount.toFixed(2)],
          ['CGST (9%)', (gstAmount / 2).toFixed(2)],
          ['SGST (9%)', (gstAmount / 2).toFixed(2)],
          ['Platform Fee', (amount * 0.05).toFixed(2)],
        ],
        foot: [['Total Charged', amount.toFixed(2)]],
      });

      doc.save(`KaryaSeva_Invoice_${job._id || job.id}.pdf`);
    } catch (err) {
      alert('Could not fetch invoice data.');
    }
  };

  if (!job) return <div className="p-8 text-center text-gray-500">Loading Escrow...</div>;

  return (
    <div className="bg-[#F0F4F8] min-h-[calc(100vh-80px)] py-12 px-4 shadow-inner">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Banner Section */}
        <div className="bg-[#1A2B4A] p-8 text-white relative">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2">Smart Escrow Workspace</h1>
              <p className="text-gray-400 font-medium tracking-wide">Job Timeline: <span className="text-white font-bold">{job.title}</span></p>
            </div>
            {paymentPhase === 'released' && (
              <button 
                onClick={handleDownloadInvoice}
                className="flex items-center text-[#1A2B4A] bg-[#F59E0B] hover:bg-[#D97706] hover:text-white px-5 py-2.5 rounded-lg font-extrabold transition shadow-md"
              >
                <DownloadCloud className="w-5 h-5 mr-2" /> Download GST Invoice
              </button>
            )}
            {paymentPhase !== 'released' && (
              <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <ShieldCheck className="w-8 h-8 text-[#10B981]" />
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className={`p-8 rounded-xl border-2 flex flex-col md:flex-row justify-between items-center ${paymentPhase === 'deposited' ? 'bg-blue-50 border-blue-200' : paymentPhase === 'released' ? 'bg-[#ECFDF5] border-[#10B981]' : 'bg-[#F0F4F8] border-gray-200'}`}>
            <div className="flex items-center mb-4 md:mb-0">
              {paymentPhase === 'released' ? (
                <CheckCircle className="w-10 h-10 text-[#10B981] mr-4 shadow-sm" />
              ) : paymentPhase === 'deposited' ? (
                <ShieldCheck className="w-10 h-10 text-blue-500 mr-4 shadow-sm" />
              ) : (
                <Circle className="w-10 h-10 text-gray-400 mr-4 shadow-sm" />
              )}
              <div>
                <h3 className="font-extrabold text-xl text-[#1A2B4A]">Project Escrow Fund</h3>
                <p className="text-xs text-gray-500 uppercase font-extrabold tracking-widest mt-1">Status: {paymentPhase}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-3">
              <span className="font-extrabold text-3xl text-[#F59E0B]">₹{job.budget}</span>
              {user?.role === 'client' && paymentPhase === 'pending' && (
                <button 
                  onClick={handleDeposit}
                  className="bg-[#1A2B4A] text-white font-extrabold px-8 py-3.5 rounded-xl hover:bg-[#111C33] transition shadow-md w-full md:w-auto"
                >
                  Deposit to Escrow
                </button>
              )}
              {user?.role === 'client' && paymentPhase === 'deposited' && job.status === 'completed' && (
                <button 
                  onClick={handleRelease}
                  className="bg-[#10B981] text-white font-extrabold px-8 py-3.5 rounded-xl hover:bg-[#059669] transition shadow-md"
                >
                  Release Funds
                </button>
              )}
            </div>
          </div>
        </div>

        {user?.role === 'freelancer' && job.status === 'in-progress' && paymentPhase === 'deposited' && (
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-8 rounded-xl text-center mt-6 shadow-sm">
            <h3 className="font-extrabold text-xl mb-2 text-[#D97706]">Submit Work for Review</h3>
            <p className="text-[#B45309] font-medium text-sm mb-6">Upload your deliverables. A cryptographic hash will be generated as undeniable proof of work.</p>
            <button 
              onClick={submitWorkProof}
              className="bg-[#1A2B4A] text-white font-extrabold py-3.5 px-8 rounded-xl hover:bg-[#111C33] transition shadow-md"
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
