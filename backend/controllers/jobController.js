const Job = require("../models/Job");

const calculateRisk = (budget) => {
  if (budget < 500) return "High";
  if (budget < 2000) return "Medium";
  return "Low";
};

exports.postJob = async (req, res) => {
  const { title, description, budget } = req.body;
  const clientId = req.body.clientId || req.user._id || req.user.id;

  // AI-based Fake Job / Fraud Detection Heuristic
  const suspiciousKeywords = ['test', 'dummy', 'fake', 'asdf', 'scam', 'free work'];
  const textToCheck = `${title} ${description}`.toLowerCase();
  const isSuspicious = suspiciousKeywords.some(kw => textToCheck.includes(kw));

  if (isSuspicious || budget < 50) {
    return res.status(400).json({ error: "Job flagged by AI Fraud Detection system." });
  }

  const job = await Job.create({
    title,
    description,
    budget,
    clientId,
    riskLevel: calculateRisk(budget),
  });

  res.json(job);
};

exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

const crypto = require("crypto");

exports.submitWork = async (req, res) => {
  try {
    const { jobId, workContent } = req.body;
    
    // Hash the work content (acting as a blockchain-like proof)
    const workProofHash = crypto.createHash('sha256').update(workContent).digest('hex');

    await Job.updateOne(
      { _id: jobId },
      { status: "completed", workProofHash }
    );

    res.json({ message: "Work submitted successfully", workProofHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};