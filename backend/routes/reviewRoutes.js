const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/reviewController");
const { verifyToken, isClient } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, addReview);
router.get("/:userId", verifyToken, getReviews);

module.exports = router;
