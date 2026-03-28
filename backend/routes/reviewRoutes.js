const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");
const { verifyToken, isClient } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, isClient, addReview);
router.get("/:freelancerId", verifyToken, getReviews);

module.exports = router;
