const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkUserFraud } = require("../services/fraudService");
const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Initialize mocked email service
const sendMockEmail = async (to, otp) => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"KaryaSeva Platform" <no-reply@karyaseva.in>',
      to: to,
      subject: "Your KaryaSeva Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1A2B4A;">Welcome to KaryaSeva</h2>
          <p>Your email verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F59E0B; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log(`\n📧 [EMAIL SENT SUCCESSFULLY] -> To view the email, click this link:`);
    console.log(`👉 ${nodemailer.getTestMessageUrl(info)}\n`);
  } catch (err) {
    console.error("Failed to send mock email:", err);
  }
};

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

    // Explicitly print OTP to terminal to bypass any Ethereal blocking issues
    console.log(`\n======================================================`);
    console.log(`🔐 [DEV MODE] auth code for ${email}: ${otp}`);
    console.log(`======================================================\n`);

    // Send Ethereal Mock Email
    await sendMockEmail(email, otp);

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

    // Explicitly print OTP to terminal to bypass any Ethereal blocking issues
    console.log(`\n======================================================`);
    console.log(`🔐 [DEV MODE] RESENT auth code for ${user.email}: ${newOtp}`);
    console.log(`======================================================\n`);

    await sendMockEmail(user.email, newOtp);

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