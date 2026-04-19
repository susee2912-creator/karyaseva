const User = require("../models/User");

const calculateTrustScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Normalise factors
    // 1. Completion Rate (0-100) -> 30%
    const completionRate = user.completedJobs > 0 ? 100 : Math.min(100, user.completedJobs * 10);
    const w1 = 0.30;

    // 2. Average Rating -> 25%
    // Let's assume we pull it from Review model later, for now we will assume average 4.5
    // Trust Score = (0.30 × Completion Rate) + (0.25 × Average Rating / 5 × 100) + ...
    const averageRatingScore = (4.5 / 5) * 100;
    const w2 = 0.25;

    // 3. Verification Level -> 20%
    const verificationScore = user.verified ? 100 : 0;
    const w3 = 0.20;

    // 4. Activity Consistency -> 15%
    const activityScore = 80; // Placeholder
    const w4 = 0.15;

    // 5. Dispute Rate -> 10%
    const disputeScore = 100; // Placeholder (1 - 0) * 100
    const w5 = 0.10;

    const trustScore = 
      (w1 * completionRate) + 
      (w2 * averageRatingScore) + 
      (w3 * verificationScore) + 
      (w4 * activityScore) + 
      (w5 * disputeScore);

    user.trustScore = Math.round(Number(trustScore));
    await user.save();
    
    return user.trustScore;
  } catch (error) {
    console.error("Trust Score calculation failed:", error);
  }
};

module.exports = { calculateTrustScore };
