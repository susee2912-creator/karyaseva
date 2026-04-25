import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  DownloadCloud, 
  CheckCircle, 
  FileCheck, 
  Circle, 
  ShieldCheck, 
  Upload, 
  FileText, 
  ExternalLink, 
  Clock, 
  Link as ChainIcon, 
  Copy, 
  Star,
  AlertCircle,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EscrowPayment = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Submission state
  const [file, setFile] = useState<File | null>(null);
  const [workNotes, setWorkNotes] = useState('');
  
  // Revision state
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Rating state
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Job
      const jobRes = await axios.get('http://localhost:5000/api/jobs/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const foundJob = jobRes.data.find((j: any) => (j._id || j.id).toString() === jobId);
      setJob(foundJob);

      // Fetch Milestones
      const milestoneRes = await axios.get(`http://localhost:5000/api/payments/milestones/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMilestones(milestoneRes.data);

      // Fetch Payment Status
      const paymentRes = await axios.get(`http://localhost:5000/api/payments/status/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayment(paymentRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleDeposit = async () => {
    try {
      await axios.post('http://localhost:5000/api/payments/deposit', {
        jobId: job._id || job.id,
        amount: job.budget,
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert('Escrow deposited successfully! Funds are now secured.');
      fetchData();
    } catch (error) {
      alert('Escrow deposit failed');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitWork = async () => {
    if (!file) return alert('Please upload a deliverable file');
    const id = job._id || job.id;
    if (!id) return alert('Job ID is missing. Please refresh the page.');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workContent', workNotes);

    try {
      const url = `http://localhost:5000/api/jobs/submit`;
      formData.append('jobId', id); // Ensure jobId is sent in the body
      console.log("Submitting work to:", url, "for Job ID:", id);
      await axios.post(url, formData, {




        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Work submitted successfully. Waiting for client approval.');
      fetchData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to submit work';
      alert(`Submission Failed: ${errorMsg}`);
    }
  };


  const handleReview = async (action: 'approve' | 'revision') => {
    try {
      await axios.post('http://localhost:5000/api/jobs/review', {
        jobId: job._id || job.id,
        action,
        revisionNotes: action === 'revision' ? revisionNotes : ''
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      alert(action === 'approve' ? 'Work approved!' : 'Revision requested.');
      setShowRevisionInput(false);
      fetchData();
    } catch (error) {
      alert('Failed to process review');
    }
  };

  const handleConfirmRelease = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/payments/confirm-release', {
        jobId: job._id || job.id
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      alert(res.data.message);
      setShowPaymentModal(false);
      fetchData();
      setShowRatingModal(true);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to release payment';
      alert(`Release Failed: ${errorMsg}`);
    }
  };


  const submitRating = async () => {
    try {
      await axios.post('http://localhost:5000/api/reviews/add', {
        jobId: job._id || job.id,
        raterId: user.id || user._id,
        rateeId: user.role === 'client' ? job.freelancerId : job.clientId,
        rating,
        comment: review
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      alert('Rating submitted successfully!');
      setShowRatingModal(false);
    } catch (error) {
      alert('Failed to submit rating');
    }
  };

  const handleDownloadInvoice = () => {
    if (!job || !payment) return;
    
    const doc = new jsPDF();
    const amount = payment.amount;
    const platformFee = payment.platformFee || (amount * 0.05);
    const netAmount = payment.netAmount || (amount - platformFee);
    const gstAmount = platformFee * 0.18;

    doc.setFontSize(22);
    doc.setTextColor(26, 43, 74);
    doc.text("KaryaSeva GST Invoice", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Invoice No: INV-${payment.transactionId?.substring(0, 8).toUpperCase() || 'N/A'}`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Bill To:", 14, 65);
    doc.setFontSize(12);
    doc.text(`Client: ${job.clientId}`, 14, 73); // Should ideally be client name
    doc.text(`Freelancer: ${job.freelancerId}`, 14, 81);

    autoTable(doc, {
      startY: 90,
      head: [['Service Description', 'Base Amount (INR)', 'Platform Fee (5%)', 'GST (18% on Fee)', 'Net Amount']],
      body: [
        [
          job.title, 
          amount.toFixed(2), 
          platformFee.toFixed(2), 
          gstAmount.toFixed(2), 
          netAmount.toFixed(2)
        ]
      ],
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.text(`Total Paid to Freelancer: INR ${netAmount.toFixed(2)}`, 140, finalY, { align: 'right' });

    doc.save(`KaryaSeva_Invoice_${jobId}.pdf`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Escrow Workspace...</div>;
  if (!job) return <div className="p-8 text-center text-red-500">Job not found</div>;

  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Header */}
        <div className="bg-[#1A2B4A] rounded-t-2xl p-8 text-white flex flex-col md:flex-row justify-between items-center shadow-xl">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-orange-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Secured by KaryaSeva Escrow</span>
            </div>
            <h1 className="text-3xl font-extrabold">{job.title}</h1>
            <p className="text-gray-400 mt-1">Workspace ID: <span className="font-mono text-xs">{jobId}</span></p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Escrow Amount</p>
            <p className="text-4xl font-black text-orange-400">₹{job.budget}</p>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-white p-6 border-x border-gray-100 flex flex-wrap justify-between gap-4">
          <StatusItem 
            active={!!payment} 
            completed={payment?.status === 'deposited' || payment?.status === 'released'} 
            label="Escrow Deposited" 
            icon={<ShieldCheck />} 
          />
          <StatusItem 
            active={!!job.submission} 
            completed={!!job.submission} 
            label="Work Submitted" 
            icon={<Upload />} 
          />
          <StatusItem 
            active={job.submission?.status === 'approved'} 
            completed={job.submission?.status === 'approved'} 
            label="Client Approved" 
            icon={<FileCheck />} 
          />
          <StatusItem 
            active={payment?.status === 'released'} 
            completed={payment?.status === 'released'} 
            label="Payment Released" 
            icon={<CheckCircle />} 
          />
        </div>

        <div className="bg-white p-8 space-y-12 rounded-b-2xl shadow-lg border border-gray-100">
          
          {/* STEP 1: ESCROW DEPOSIT */}
          <Section title="1. Project Escrow Fund" icon={<ShieldCheck className="text-blue-600" />}>
            <div className={`p-6 rounded-xl border-2 ${payment?.status === 'deposited' || payment?.status === 'released' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'} flex justify-between items-center`}>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Current Status</p>
                <p className="text-xl font-bold text-gray-800">
                  {payment?.status === 'released' ? 'Funds Released to Freelancer' : 
                   payment?.status === 'deposited' ? 'Funds Secured in Escrow' : 'Awaiting Deposit'}
                </p>
              </div>
              {isClient && !payment && (
                <button 
                  onClick={handleDeposit}
                  className="bg-[#1A2B4A] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Deposit ₹{job.budget}
                </button>
              )}
              {(payment?.status === 'deposited' || payment?.status === 'released') && (
                <CheckCircle className="w-10 h-10 text-green-500" />
              )}
            </div>
          </Section>

          {/* STEP 2: SUBMIT YOUR WORK (Freelancer Only) */}
          {isFreelancer && (
            <Section title="2. Submit Your Work" icon={<Upload className="text-orange-600" />}>
              {job.submission ? (
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex justify-between items-start">
                  <div className="flex space-x-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <FileCheck className="text-green-500 w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{job.submission.fileName}</p>
                      <p className="text-sm text-gray-500">Submitted on {new Date(job.submission.timestamp).toLocaleString()}</p>
                      <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                        Work Submitted
                      </div>
                    </div>
                  </div>
                  <a 
                    href={`http://localhost:5000${job.submission.fileUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 font-bold hover:underline"
                  >
                    <DownloadCloud className="w-4 h-4 mr-1" /> View Deliverable
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-orange-400 transition-colors bg-gray-50">
                    <input 
                      type="file" 
                      id="fileUpload" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="text-orange-600 w-8 h-8" />
                      </div>
                      <p className="text-lg font-bold text-gray-700">
                        {file ? file.name : "Click to choose file or drag and drop your deliverable"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Accepts all deliverable file types</p>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Work Description</label>
                    <textarea 
                      className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-orange-400 outline-none h-32"
                      placeholder="Describe what you have completed and delivered..."
                      value={workNotes}
                      onChange={(e) => setWorkNotes(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    onClick={submitWork}
                    className="bg-orange-500 text-white w-full py-4 rounded-xl font-black text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200"
                  >
                    Submit Work for Review
                  </button>
                </div>
              )}
            </Section>
          )}

          {/* STEP 3: REVIEW SUBMITTED WORK */}
          <Section title={`${isClient ? '2' : '3'}. Review Submitted Work`} icon={<FileCheck className="text-green-600" />}>
            {isClient ? (
              job.submission ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Submitted by Freelancer</p>
                        <p className="text-xs text-gray-400">{new Date(job.submission.timestamp).toLocaleString()}</p>
                      </div>
                      <a 
                        href={`http://localhost:5000${job.submission.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-green-700 transition"
                      >
                        <DownloadCloud className="w-4 h-4 mr-2" /> Download {job.submission.fileName}
                      </a>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-bold text-gray-700 mb-1">Freelancer Notes:</p>
                      <p className="text-gray-600 italic">"{job.submission.notes}"</p>
                    </div>
                  </div>

                  {job.submission.status === 'submitted' && (
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => handleReview('approve')}
                        className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
                      >
                        Approve & Release Payment
                      </button>
                      <button 
                        onClick={() => setShowRevisionInput(!showRevisionInput)}
                        className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
                      >
                        Request Revision
                      </button>
                    </div>
                  )}

                  {showRevisionInput && (
                    <div className="space-y-3 animate-in slide-in-from-top duration-300">
                      <label className="block text-sm font-bold text-gray-700">Revision Instructions</label>
                      <textarea 
                        className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-400"
                        placeholder="What needs to be changed?"
                        value={revisionNotes}
                        onChange={(e) => setRevisionNotes(e.target.value)}
                      ></textarea>
                      <button 
                        onClick={() => handleReview('revision')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold"
                      >
                        Send Revision Request
                      </button>
                    </div>
                  )}

                  {job.submission.status === 'approved' && (
                    <div className="bg-green-50 p-4 rounded-xl flex items-center text-green-700 font-bold">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      You approved this work. Proceed to release funds below.
                    </div>
                  )}
                </div>
              ) : (
                <LockedSection message="Review will be available once work is submitted." />
              )
            ) : (
              <LockedSection message="Review will be available once work is submitted." />
            )}
          </Section>

          {/* STEP 4: PAYMENT RELEASE & PROOF */}
          {payment?.status === 'released' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <Section title={`${isClient ? '3' : '4'}. Payment Released`} icon={<CheckCircle className="text-green-600" />}>

                <div className="bg-green-600 rounded-2xl p-8 text-white flex justify-between items-center shadow-xl">
                  <div>
                    <p className="text-green-100 text-sm font-bold uppercase tracking-widest">Transaction Successful</p>
                    <p className="text-3xl font-black mt-1">₹{payment.netAmount?.toFixed(2)} Released</p>
                    <p className="text-xs text-green-200 mt-2 font-mono">TXID: {payment.transactionId}</p>
                  </div>
                  <CheckCircle className="w-16 h-16 text-white/20" />
                </div>
              </Section>

              <Section title={`${isClient ? '4' : '5'}. Blockchain Work Proof`} icon={<ChainIcon className="text-indigo-600" />}>

                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-indigo-900 flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-2" /> 
                        Tamper-proof delivery record generated after payment
                      </h4>
                      <div className="mt-4 flex items-center space-x-2">
                        <div className="bg-white border border-indigo-200 p-4 rounded-xl flex-1 font-mono text-sm text-indigo-700 break-all">
                          {job.workProofHash}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(job.workProofHash)}
                          className="bg-white p-4 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition"
                        >
                          <Copy className="w-5 h-5 text-indigo-600" />
                        </button>
                      </div>
                      <p className="text-xs text-indigo-500 mt-3 font-bold">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Verified on Blockchain: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title={`${isClient ? '5' : '6'}. GST Invoice`} icon={<FileText className="text-gray-600" />}>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <FileText className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">GST Invoice & Platform Receipt</p>
                      <p className="text-sm text-gray-500">Includes 18% GST breakdown and platform fees</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDownloadInvoice}
                    className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-black transition"
                  >
                    <DownloadCloud className="w-5 h-5 mr-2" /> Download PDF
                  </button>
                </div>
              </Section>
            </div>
          )}

          {/* Locked Step 4 if not released */}
          {payment?.status !== 'released' && (
            <Section title={`${isClient ? '3' : '4'}. Payment & Proof`} icon={<Circle className="text-gray-300" />}>

              {isClient && job.submission?.status === 'approved' ? (
                <div className="bg-orange-50 border border-orange-100 p-8 rounded-2xl text-center">
                  <p className="text-orange-800 font-bold mb-4 text-lg">Work approved! You can now release the secured funds.</p>
                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-black text-xl hover:bg-orange-600 transition shadow-xl shadow-orange-100"
                  >
                    Release Payment Now
                  </button>
                </div>
              ) : (
                <LockedSection message="Payment will be enabled once you approve the freelancer's work." />
              )}
            </Section>
          )}

        </div>
      </div>

      {/* PAYMENT CONFIRMATION MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-[#1A2B4A] p-6 text-white text-center">
              <h2 className="text-2xl font-black">Release Payment</h2>
              <p className="text-gray-300 text-sm mt-1">Final confirmation of fund transfer</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Project Amount</span>
                  <span className="font-bold">₹{job.budget}</span>
                </div>
                <div className="flex justify-between text-red-500 text-sm">
                  <span>Platform Fee (5%)</span>
                  <span>-₹{(job.budget * 0.05).toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Freelancer Receives</span>
                  <span className="text-3xl font-black text-green-600">₹{(job.budget * 0.95).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="text-blue-600 w-6 h-6 flex-shrink-0" />
                <p className="text-xs text-blue-700">Funds will be transferred via Razorpay Payouts. A blockchain work proof and GST invoice will be generated automatically.</p>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={handleConfirmRelease}
                  className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-black hover:bg-orange-600 transition shadow-lg shadow-orange-100"
                >
                  Confirm & Release
                </button>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RATING MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-6 animate-in zoom-in duration-300">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <Star className="text-orange-500 w-10 h-10 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Project Completed!</h2>
              <p className="text-gray-500 mt-2">How was your experience with this {user.role === 'client' ? 'freelancer' : 'client'}?</p>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button 
                  key={s} 
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-125"
                >
                  <Star className={`w-10 h-10 ${rating >= s ? 'text-orange-500 fill-current' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>
            <textarea 
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-400 h-24"
              placeholder="Write a quick review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <button 
              onClick={submitRating}
              className="w-full bg-[#1A2B4A] text-white py-4 rounded-2xl font-black text-lg hover:bg-black transition"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const Section = ({ title, icon, children }: any) => (
  <div className="space-y-4">
    <h3 className="text-xl font-black text-gray-800 flex items-center">
      <span className="mr-3">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const LockedSection = ({ message }: any) => (
  <div className="bg-gray-50 border border-gray-100 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
    <div className="bg-gray-100 p-4 rounded-full">
      <X className="text-gray-400 w-6 h-6" />
    </div>
    <p className="text-gray-500 font-medium max-w-xs">{message}</p>
  </div>
);

const StatusItem = ({ active, completed, label, icon }: any) => (
  <div className="flex items-center space-x-2">
    <div className={`p-2 rounded-lg ${completed ? 'bg-green-100 text-green-600' : active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
      {React.cloneElement(icon, { className: 'w-4 h-4' })}
    </div>
    <span className={`text-xs font-bold ${completed ? 'text-green-700' : active ? 'text-orange-700' : 'text-gray-400'}`}>
      {label}
    </span>
    {completed && <CheckCircle className="w-3 h-3 text-green-500" />}
  </div>
);

export default EscrowPayment;
