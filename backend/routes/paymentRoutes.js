const express = require("express");
const router = express.Router();
const { deposit, releaseOptions, releaseMilestone, generateInvoice } = require("../controllers/paymentController");
const { verifyToken, isClient } = require("../middleware/authMiddleware");

router.post("/deposit", verifyToken, isClient, deposit);
router.post("/release-full", verifyToken, isClient, releaseOptions);
router.post("/release-milestone", verifyToken, isClient, releaseMilestone);
router.get("/invoice/:paymentId", verifyToken, generateInvoice);

module.exports = router;