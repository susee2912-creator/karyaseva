const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkUserFraud } = require("../services/fraudService");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      emailOtp: otp,
      emailOtpExpires: Date.now() + 10 * 60 * 1000, // Valid for 10 minutes
    });

    console.log(`\n📧 [EMAIL SIMULATION] Sent to ${email} -> Your Verification Code is: ${otp}\n`);

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
    if (user.emailOtp !== otp) return res.status(400).json({ message: "Invalid verification code" });
    if (Date.now() > user.emailOtpExpires) return res.status(400).json({ message: "Verification code expired" });

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
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

    const newOtp = generateOTP();
    user.emailOtp = newOtp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log(`\n📧 [EMAIL SIMULATION] Resent to ${user.email} -> Your NEW Verification Code is: ${newOtp}\n`);

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