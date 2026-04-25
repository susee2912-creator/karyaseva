const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkUserFraud } = require("../services/fraudService");
const { sendOTPEmail, verifyOTP } = require("../utils/sendOTP");
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email is already registered." });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      role
    });

    const sentOtp = await sendOTPEmail(email, name);
    
    // Explicitly print OTP to terminal for dev backup
    console.log(`\n======================================================`);
    if (email.endsWith("@karyaseva.in")) {
      console.log(`🎁 [DEMO MODE] FIXED bypass code for ${email}: ${sentOtp}`);
    } else {
      console.log(`🔐 [DEV MODE] REAL auth code for ${email}: ${sentOtp}`);
    }
    console.log(`======================================================\n`);

    // Run background fraud check synchronously for now
    await checkUserFraud(user);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });
    
    const isValid = await verifyOTP(user.email, otp);
    if (!isValid) return res.status(400).json({ message: "Invalid or expired verification code" });

    user.isEmailVerified = true;
    await user.save();

    res.json({ message: "Email successfully verified", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Email already verified" });

    const sentOtp = await sendOTPEmail(user.email, user.name);

    // Explicitly print OTP to terminal for dev backup
    console.log(`\n======================================================`);
    if (user.email.endsWith("@karyaseva.in")) {
      console.log(`🎁 [DEMO MODE] RESENT FIXED bypass code for ${user.email}: ${sentOtp}`);
    } else {
      console.log(`🔐 [DEV MODE] RESENT REAL auth code for ${user.email}: ${sentOtp}`);
    }
    console.log(`======================================================\n`);

    res.json({ message: "New verification code sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Invalid password" });

  if (!user.isEmailVerified) return res.status(403).json({ message: "Please verify your email address.", code: "unverified_email", userId: user._id });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
};

exports.uploadId = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    await User.updateOne(
      { _id: userId },
      { idDocument: req.file.path, verified: true }
    );

    res.json({ message: "ID Uploaded successfully", path: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};