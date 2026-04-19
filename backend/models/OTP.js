const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  created_at: { type: Date, default: Date.now, expires: 600 } // 600 seconds = 10 minutes
});

module.exports = mongoose.model("OTP", otpSchema);
