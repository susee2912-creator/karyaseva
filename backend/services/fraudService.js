const FraudFlag = require("../models/FraudFlag");
const User = require("../models/User");

const checkUserFraud = async (user) => {
  try {
    let score = 0;
    
    // Very dummy logic for heuristic fraud checking
    if (user.email && user.email.includes("test")) score += 50;
    if (user.name && user.name.length < 3) score += 20;

    if (score > 60) {
      await FraudFlag.create({
        userId: user._id,
        reason: "Suspicious registration details detected.",
        status: "open"
      });
      console.log(`[Fraud Detection] Flagged newly registered user: ${user.email}`);
    }
  } catch (error) {
    console.error("Fraud detection failed:", error);
  }
};

const checkJobFraud = async (job, client) => {
  try {
    let score = 0;
    
    // 1. Account age (newer = higher risk)
    const ageInDays = (Date.now() - new Date(client.createdAt).getTime()) / (1000 * 3600 * 24);
    if (ageInDays < 2) score += 30;

    // 2. Budget anomaly
    if (job.budget > 1000000 || job.budget < 50) score += 40;

    // 3. Description checks
    if (job.description.length < 20) score += 20;

    if (score > 60) {
      await FraudFlag.create({
        jobId: job._id,
        userId: client._id,
        reason: "Suspicious job posting detected based on account age and budget anomaly.",
        status: "open"
      });
      console.log(`[Fraud Detection] Flagged job: ${job.title}`);
    }
  } catch (error) {
    console.error("Fraud detection failed:", error);
  }
};

module.exports = { checkUserFraud, checkJobFraud };
