const express = require("express");
const router = express.Router();
const { deposit, releaseOptions, releaseMilestone, generateInvoice, getPaymentMilestones, getPaymentStatus, confirmRelease } = require("../controllers/paymentController");
const { verifyToken, isClient } = require("../middleware/authMiddleware");

router.post("/deposit", verifyToken, isClient, deposit);
router.post("/release-full", verifyToken, isClient, releaseOptions);
router.post("/release-milestone", verifyToken, isClient, releaseMilestone);
router.post("/confirm-release", verifyToken, isClient, confirmRelease);
router.get("/milestones/:jobId", verifyToken, getPaymentMilestones);
router.get("/status/:jobId", verifyToken, getPaymentStatus);
router.get("/invoice/:paymentId", verifyToken, generateInvoice);


module.exports = router;