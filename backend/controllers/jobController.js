const Job = require("../models/Job");
const WorkProof = require("../models/WorkProof");

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
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Hash the work content + timestamp + clientID + freelancerID
    const timestamp = new Date().toISOString();
    const dataToHash = workContent + timestamp + job.clientId + req.user.id;
    const workProofHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    await Job.updateOne(
      { _id: jobId },
      { status: "under-review", workProofHash } // Wait for client review
    );

    const workProof = await WorkProof.create({
      jobId,
      clientId: job.clientId,
      freelancerId: req.user.id,
      fileHash: workProofHash,
      workContent,
    });

    res.json({ message: "Work submitted securely. Waiting for client review.", workProofHash, workProof });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};