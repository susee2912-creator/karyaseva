const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: {
      type: String,
      default: "open",
    },
    riskLevel: {
      type: String,
      default: "Low",
    },
    workProofHash: {
      type: String,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submission: {
      fileUrl: String,
      fileName: String,
      notes: String,
      status: { type: String, enum: ['submitted', 'approved', 'rejected'], default: 'submitted' },
      timestamp: Date
    },
    revisionNotes: { type: String }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);