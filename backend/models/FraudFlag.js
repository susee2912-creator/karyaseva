const mongoose = require("mongoose");

const fraudFlagSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: false },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FraudFlag", fraudFlagSchema);
