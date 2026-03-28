import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, AlertCircle } from 'lucide-react';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in as a client to post a job.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/jobs/post',
        { title, description, budget: Number(budget) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/jobs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post job. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-extrabold text-gray-900">Post a New Job</h1>
        </div>
        <p className="text-gray-500 mb-8">Reach thousands of talented freelancers across India with secure Smart Escrow.</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handlePostJob} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Full Stack React Developer wanted"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
            <textarea
              required
              rows={6}
              placeholder="Describe the project, required skills, and deliverables in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹ INR)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
              <input
                type="number"
                required
                min="50"
                placeholder="10000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">AI-driven risk assessment will evaluate budgets less than ₹500 as high risk.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition disabled:opacity-50"
          >
            Post Job & Fund Escrow Later
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
