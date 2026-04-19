const mongoose = require("mongoose");
const OTP = require("./models/OTP");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const otps = await OTP.find({});
    console.log("OTPs stored:", otps);
    process.exit(0);
  });
