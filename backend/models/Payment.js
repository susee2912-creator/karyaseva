const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    status: {
      type: String,
      default: "deposited",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    transactionId: { type: String },
    platformFee: { type: Number },
    netAmount: { type: Number },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);