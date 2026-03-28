const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

exports.applyJob = async (req, res) => {
  const { jobId, freelancerId, proposal } = req.body;

  const app = await Application.create({
    jobId,
    freelancerId,
    proposal,
  });

  res.json(app);
};

exports.hireFreelancer = async (req, res) => {
  const { applicationId, jobId } = req.body;

  try {
    const application = await Application.findByPk(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "accepted";
    await application.save();

    const job = await Job.findByPk(jobId);
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
    const applications = await Application.findAll({
      where: { jobId },
      include: [{ model: User, attributes: ['id', 'name', 'trustScore', 'verified'] }]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};