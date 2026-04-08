const express = require("express");
const router = express.Router();
const { register, login, uploadId, verifyEmail, resendOtp } = require("../controllers/authController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOtp);
router.post("/upload-id", upload.single("idDocument"), uploadId);

module.exports = router;