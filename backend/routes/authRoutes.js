const express = require("express");
const router = express.Router();
const { register, login, uploadId } = require("../controllers/authController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.post("/upload-id", upload.single("idDocument"), uploadId);

module.exports = router;