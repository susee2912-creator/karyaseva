import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RatingReview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/all', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const found = res.data.find((j: any) => (j._id || j.id).toString() === jobId);
      setJob(found);
    }).catch(err => console.error(err));
  }, [jobId]);

  const submitReview = async () => {
    if (!job || !currentUser) return;
    
    setLoading(true);
    try {
      // Determine rateeId: if current user is client, ratee is freelancer, and vice versa.
      const isClient = currentUser.role === 'client';
      const rateeId = isClient ? job.freelancerId : job.clientId;
      const raterId = currentUser._id || currentUser.id;

      await axios.post('http://localhost:5000/api/reviews/add', {
        jobId,
        raterId,
        rateeId,
        rating,
        comment: review
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      alert("Review Submitted! Trust Score updated.");
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-[#1A2B4A] rounded-xl shadow-lg border border-gray-100 p-8">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Rate Your Experience</h1>
        
        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className={`p-2 transition ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}>
              <Star className="w-10 h-10 fill-current" />
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-extrabold text-white mb-2">Write a Review</label>
          <textarea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] transition shadow-sm"
            placeholder="Share details of your experience..."
          />
        </div>

        <button 
          onClick={submitReview}
          disabled={rating === 0 || review.trim() === ''}
          className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-orange-300 text-white font-extrabold py-3.5 px-6 rounded-lg shadow-md transition"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default RatingReview;
