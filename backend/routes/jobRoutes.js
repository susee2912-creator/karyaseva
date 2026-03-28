const express = require("express");
const router = express.Router();
const { postJob, getJobs, submitWork } = require("../controllers/jobController");
const { verifyToken, isClient, isFreelancer } = require("../middleware/authMiddleware");
const { fraudDetection } = require("../middleware/fraudDetection");

router.post("/post", verifyToken, isClient, fraudDetection, postJob);
router.get("/all", verifyToken, getJobs);
router.post("/submit", verifyToken, isFreelancer, submitWork);

module.exports = router;