const mongoose = require("mongoose");

const gstInvoiceSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GstInvoice", gstInvoiceSchema);
