import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CreditCard, ClipboardCheck, ArrowRight, Check } from 'lucide-react';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState('fixed');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handlePost = async () => {
    try {
      await axios.post('http://localhost:5000/api/jobs', 
        { title, description, budget: Number(budget) || 0 }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to post job');
    }
  };

  return (
    <div className="bg-[#F0F4F8] min-h-[calc(100vh-80px)] py-12 px-4 flex justify-center items-start">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg border border-gray-100 max-w-3xl w-full">
        
        <h1 className="text-3xl font-extrabold text-[#1A2B4A] mb-8 text-center tracking-tight">Post a New Job</h1>
        
        {/* Step Indicators */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center w-full max-w-md">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-[#1A2B4A]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 border-2 ${step >= 1 ? 'bg-[#1A2B4A] border-[#1A2B4A] text-white' : 'border-gray-300'}`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest">Details</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-[#1A2B4A]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-[#1A2B4A]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 border-2 ${step >= 2 ? 'bg-[#1A2B4A] border-[#1A2B4A] text-white' : 'border-gray-300 bg-white'}`}>
                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest">Budget</span>
            </div>

            <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-[#1A2B4A]' : 'bg-gray-200'}`}></div>
            
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-[#1A2B4A]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 border-2 ${step >= 3 ? 'bg-[#1A2B4A] border-[#1A2B4A] text-white' : 'border-gray-300 bg-white'}`}>
                3
              </div>
              <span className="text-xs font-extrabold uppercase tracking-widest">Review</span>
            </div>
          </div>
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-bold text-[#1A2B4A] mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Job Title
              </label>
              <input 
                type="text" 
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-4 transition text-[#1A2B4A]"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Build a React Ecommerce Store"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A2B4A] mb-2">Description</label>
              <textarea 
                rows={5}
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-4 transition text-[#1A2B4A]"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Describe the deliverables, timeline, and exact requirements..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1A2B4A] mb-2">Skills Required (Comma separated)</label>
              <input 
                type="text" 
                className="w-full rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-4 transition text-[#1A2B4A]"
                placeholder="React, CSS, Node.js"
              />
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!title || !description}
              className="mt-8 w-full bg-[#F59E0B] text-white hover:bg-[#D97706] font-extrabold py-4 px-6 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Next Step <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-bold text-[#1A2B4A] mb-4 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" /> Budget Type
              </label>
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setBudgetType('fixed')}
                  className={`flex-1 py-4 border-2 rounded-xl font-bold transition ${budgetType === 'fixed' ? 'border-[#1A2B4A] bg-blue-50 text-[#1A2B4A]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  Fixed Price
                </button>
                <button 
                  onClick={() => setBudgetType('milestone')}
                  className={`flex-1 py-4 border-2 rounded-xl font-bold transition ${budgetType === 'milestone' ? 'border-[#1A2B4A] bg-blue-50 text-[#1A2B4A]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  Milestones
                </button>
              </div>

              <label className="block text-sm font-bold text-[#1A2B4A] mb-2">Total Budget (INR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 font-bold text-gray-500">₹</span>
                <input 
                  type="number" 
                  className="w-full pl-10 rounded-lg border border-gray-300 focus:border-[#1A2B4A] focus:ring-2 focus:ring-[#1A2B4A] p-4 transition font-extrabold text-[#1A2B4A] text-xl"
                  value={budget} 
                  onChange={e => setBudget(e.target.value)} 
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 bg-white border border-gray-300 text-[#1A2B4A] hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!budget}
                className="flex-1 bg-[#F59E0B] text-white hover:bg-[#D97706] font-extrabold py-4 px-6 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Review <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="block text-lg font-bold text-[#1A2B4A] mb-4 flex items-center border-b border-gray-100 pb-4">
              <ClipboardCheck className="w-5 h-5 mr-2 text-[#10B981]" /> Review Job Post
            </h3>
            
            <div className="bg-[#F0F4F8] p-6 rounded-xl border border-gray-200">
              <h4 className="text-xl font-extrabold text-[#1A2B4A] mb-2">{title}</h4>
              <div className="flex items-center space-x-4 mb-4 text-sm font-bold">
                <span className="bg-[#1A2B4A] text-white px-3 py-1 rounded-md">{budgetType === 'fixed' ? 'Fixed Price' : 'Milestone'}</span>
                <span className="text-[#F59E0B] text-lg font-extrabold">₹{budget}</span>
              </div>
              <p className="text-gray-600 font-medium whitespace-pre-wrap text-sm leading-relaxed">{description}</p>
            </div>

            <div className="bg-[#FFFBEB] p-4 border border-[#FDE68A] rounded-xl text-sm font-medium text-[#B45309]">
              AI Fraud Detection is active. Your job details will be scanned automatically before hitting the marketplace. Ensure you do not include restricted keywords.
            </div>

            <div className="flex space-x-4 pt-6">
              <button 
                onClick={() => setStep(2)} 
                className="flex-1 bg-white border border-gray-300 text-[#1A2B4A] hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition"
              >
                Go Back
              </button>
              <button 
                onClick={handlePost} 
                className="flex-1 bg-[#1A2B4A] text-white hover:bg-[#111C33] font-extrabold py-4 px-6 rounded-xl shadow-lg transition flex items-center justify-center"
              >
                Post Job Live
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostJob;
