const Review = require("../models/Review");
const User = require("../models/User");

exports.addReview = async (req, res) => {
  try {
    const jobId = req.body?.jobId;
    const raterId = req.body?.raterId;
    const rateeId = req.body?.rateeId;
    const rating = req.body?.rating;
    const comment = req.body?.comment;


    const review = await Review.create({
      jobId,
      raterId,
      rateeId,
      rating,
      comment
    });

    // Update ratee's trust score and completed jobs count
    const ratee = await User.findById(rateeId);
    if (ratee) {
      // Trust Score Heuristic: Baseline 50, +5 for 4-5 stars, -5 for 1-2 stars
      const scoreChange = (rating >= 4) ? 5 : (rating <= 2) ? -5 : 0;
      ratee.trustScore = Math.max(0, Math.min(100, (ratee.trustScore || 50) + scoreChange));
      ratee.completedJobs = (ratee.completedJobs || 0) + 1;
      await ratee.save();
    }

    res.json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ rateeId: userId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
