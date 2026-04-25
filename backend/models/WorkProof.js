const mongoose = require("mongoose");

const workProofSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileHash: { type: String, required: true },
    workContent: { type: String, required: true },
    transactionId: { type: String },
    timestamp: { type: Date, default: Date.now },

  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkProof", workProofSchema);
