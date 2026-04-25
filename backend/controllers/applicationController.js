const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

exports.applyJob = async (req, res) => {
  const jobId = req.body?.jobId;
  const freelancerId = req.body?.freelancerId;
  const proposal = req.body?.proposal;


  const app = await Application.create({
    jobId,
    freelancerId,
    proposal,
  });

  res.json(app);
};

exports.hireFreelancer = async (req, res) => {
  const applicationId = req.body?.applicationId;
  const jobId = req.body?.jobId;


  try {
    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "accepted";
    await application.save();

    const job = await Job.findById(jobId);
    if (job) {
      job.status = "in-progress";
      job.freelancerId = application.freelancerId;
      await job.save();
    }

    res.json({ message: "Freelancer hired successfully", application, job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ jobId })
      .populate("freelancerId", "name trustScore verified");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFreelancerApplications = async (req, res) => {
  try {
    const { freelancerId } = req.params;
    const applications = await Application.find({ freelancerId })
      .populate("jobId");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};