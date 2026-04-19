const Payment = require("../models/Payment");
const Milestone = require("../models/Milestone");
const Job = require("../models/Job");
const Escrow = require("../models/Escrow");
const GstInvoice = require("../models/GstInvoice");

exports.deposit = async (req, res) => {
  const { jobId, amount, milestones } = req.body;

  try {
    const payment = await Payment.create({
      jobId,
      amount,
    });

    if (milestones && milestones.length > 0) {
      const milestoneRecords = milestones.map(m => ({
        title: m.title,
        amount: m.amount,
        paymentId: payment._id,
      }));
      await Milestone.insertMany(milestoneRecords);
    }

    res.json({ payment, message: "Escrow deposited successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.releaseMilestone = async (req, res) => {
  const { milestoneId } = req.body;
  try {
    await Milestone.updateOne(
      { _id: milestoneId },
      { status: "released" }
    );
    res.json({ message: "Milestone Released" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.releaseOptions = async (req, res) => {
  const { paymentId, jobId, clientId, freelancerId } = req.body;
  
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    await Payment.updateOne(
      { _id: paymentId },
      { status: "released" }
    );
    await Milestone.updateMany(
      { paymentId, status: "pending" },
      { status: "released" }
    );

    // Create GstInvoice
    const amount = payment.amount;
    const platformFee = amount * 0.05; // 5% fee
    const gstAmount = amount * 0.18; // 18% GST on platform fee or total? Usually on total service, or fee. Assuming 18% on full amount for demo.

    const invoice = await GstInvoice.create({
      jobId,
      clientId,
      freelancerId,
      amount,
      gstAmount,
      platformFee,
      pdfUrl: `/invoice-data/${paymentId}` // Placeholder, actual generation is on frontend via data
    });

    res.json({ message: "Full Payment Released", invoice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findById(paymentId).populate("jobId");
    
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const invoiceData = await GstInvoice.findOne({ amount: payment.amount, jobId: payment.jobId._id }).sort({ createdAt: -1 });

    res.json({ payment, invoiceData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};