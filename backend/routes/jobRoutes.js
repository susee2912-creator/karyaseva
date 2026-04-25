const express = require("express");
const router = express.Router();
const { postJob, getJobs, submitWork, reviewWork } = require("../controllers/jobController");
const { verifyToken, isClient, isFreelancer } = require("../middleware/authMiddleware");
const { fraudDetection } = require("../middleware/fraudDetection");
const upload = require("../utils/upload");

router.post("/:jobId/submit", verifyToken, isFreelancer, upload.single('file'), submitWork);
router.post("/post", verifyToken, isClient, fraudDetection, postJob);
router.get("/all", verifyToken, getJobs);
router.post("/submit", verifyToken, isFreelancer, upload.single('file'), submitWork);
router.post("/review", verifyToken, isClient, reviewWork);



module.exports = router;
