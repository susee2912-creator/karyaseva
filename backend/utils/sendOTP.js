const transporter = require("../config/mailer");
const OTP = require("../models/OTP");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, name) => {
  // Static OTP for demo accounts to bypass non-existent domain mail delivery
  const isDemo = email.endsWith("@karyaseva.in");
  const otp = isDemo ? "123456" : generateOTP();

  await OTP.deleteMany({ email });
  await OTP.create({ email, otp });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "KaryaSeva - Email Verification OTP",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1A2B4A; font-size: 24px; margin: 0;">
            Karya<span style="color: #F59E0B;">Seva</span>
          </h1>
          <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">India First Freelancing Platform</p>
        </div>
        <h2 style="color: #1A2B4A; font-size: 18px;">Hello, ${name} 👋</h2>
        <p style="color: #374151; font-size: 14px;">
          Thank you for registering on KaryaSeva. Please use the OTP below to verify your email address.
        </p>
        <div style="background: #F0F4F8; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 8px;">Your OTP Code</p>
          <h1 style="color: #F59E0B; font-size: 42px; letter-spacing: 12px; margin: 0; font-weight: 800;">
            ${otp}
          </h1>
          <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
            This OTP expires in <strong>10 minutes</strong>
          </p>
        </div>
        <p style="color: #374151; font-size: 14px;">
          If you did not register on KaryaSeva, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          KaryaSeva © 2025 · India First · Secure Payments · GST Compliant
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return otp;
};

const verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email, otp });
  if (!record) return false;
  
  await OTP.deleteMany({ email });
  return true;
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  verifyOTP
};
