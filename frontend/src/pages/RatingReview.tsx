import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingReview = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const submitReview = () => {
    alert("Review Submitted! AI Trust Score will be successfully recalculated.");
    window.location.href = "/dashboard";
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
