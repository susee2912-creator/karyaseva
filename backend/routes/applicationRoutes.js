const express = require("express");
const router = express.Router();
const { applyJob, hireFreelancer, getJobApplications } = require("../controllers/applicationController");
const { verifyToken, isClient, isFreelancer } = require("../middleware/authMiddleware");

router.post("/apply", verifyToken, isFreelancer, applyJob);
router.post("/hire", verifyToken, isClient, hireFreelancer);
router.get("/job/:jobId", verifyToken, isClient, getJobApplications);

module.exports = router;