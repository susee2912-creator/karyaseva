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
    const jobId = req.body?.jobId || req.params?.jobId;
    const workContent = req.body?.workContent || "";


    const file = req.file;

    console.log("Submit Work Debug:", { body: req.body, params: req.params, file: file?.originalname });




    if (!file) return res.status(400).json({ error: "Deliverable file is required" });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await Job.updateOne(
      { _id: jobId },
      { 
        status: "under-review",
        submission: {
          fileUrl: `/uploads/deliverables/${file.filename}`,
          fileName: file.originalname,
          notes: workContent,
          status: 'submitted',
          timestamp: new Date()
        }
      }
    );

    res.json({ message: "Work submitted successfully. Waiting for client approval." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reviewWork = async (req, res) => {
  try {
    const jobId = req.body?.jobId;
    const action = req.body?.action;
    const revisionNotes = req.body?.revisionNotes;


    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (action === 'approve') {
      await Job.updateOne(
        { _id: jobId },
        { 
          "submission.status": 'approved',
          // Note: status remains 'under-review' until payment is released? 
          // Or does it go to 'completed' after payment? 
          // Prompt says: "Confirm & Release Payment" -> Update job status to 'completed'
          // So after approval, it stays 'under-review' or a new state like 'approved'?
          // Let's use 'under-review' but submission status 'approved'.
        }
      );
      res.json({ message: "Work approved. Please proceed to release payment." });
    } else if (action === 'revision') {
      await Job.updateOne(
        { _id: jobId },
        { 
          status: 'in-progress',
          "submission.status": 'rejected',
          revisionNotes: revisionNotes
        }
      );
      res.json({ message: "Revision requested. Freelancer has been notified." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};