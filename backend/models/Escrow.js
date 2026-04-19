const mongoose = require("mongoose");

const escrowSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    totalAmount: { type: Number, required: true },
    heldAmount: { type: Number, required: true, default: 0 },
    releasedAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["pending", "deposited", "released", "disputed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Escrow", escrowSchema);
