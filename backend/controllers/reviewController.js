const Review = require("../models/Review");
const User = require("../models/User");

exports.addReview = async (req, res) => {
  try {
    const { jobId, freelancerId, rating, comment } = req.body;

    const review = await Review.create({
      jobId,
      freelancerId,
      rating,
      comment
    });

    // Update freelancer's trust score
    const freelancer = await User.findByPk(freelancerId);
    if (freelancer) {
      const newScore = Math.min(100, freelancer.trustScore + (rating - 3) * 5); // Basic heuristic
      const completedJobs = freelancer.completedJobs + 1;
      await freelancer.update({ trustScore: newScore, completedJobs });
    }

    res.json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const reviews = await Review.findAll({ where: { freelancerId } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
