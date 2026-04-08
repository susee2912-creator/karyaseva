const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    proposal: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);