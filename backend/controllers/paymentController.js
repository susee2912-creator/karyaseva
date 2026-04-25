const Payment = require("../models/Payment");
const Milestone = require("../models/Milestone");
const Job = require("../models/Job");
const Escrow = require("../models/Escrow");
const GstInvoice = require("../models/GstInvoice");
const WorkProof = require("../models/WorkProof");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");


exports.deposit = async (req, res) => {
  const jobId = req.body?.jobId;
  const amount = req.body?.amount;
  const milestones = req.body?.milestones;


  try {
    const payment = await Payment.create({
      jobId,
      amount,
    });

    // Update Job status to indicate payment is secured
    await Job.updateOne({ _id: jobId }, { status: "in-progress" });

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
  const paymentId = req.body?.paymentId;
  const jobId = req.body?.jobId;
  const clientId = req.body?.clientId;
  const freelancerId = req.body?.freelancerId;

  
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

    // Update Job status to completed
    await Job.updateOne({ _id: jobId }, { status: "completed" });

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

exports.getPaymentMilestones = async (req, res) => {
  try {
    const { jobId } = req.params;
    const payment = await Payment.findOne({ jobId });
    if (!payment) return res.json([]);

    const milestones = await Milestone.find({ paymentId: payment._id });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const payment = await Payment.findOne({ jobId });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fs = require("fs");
const path = require("path");

exports.confirmRelease = async (req, res) => {
  try {
    const jobId = req.body?.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const payment = await Payment.findOne({ jobId });
    if (!payment) return res.status(404).json({ error: "Escrow payment not found" });

    const totalAmount = payment.amount;
    const platformFee = totalAmount * 0.05;
    const netAmount = totalAmount - platformFee;

    // Razorpay Payout Mock/Call
    const transactionId = `pay_out_${Math.random().toString(36).substring(7)}`;

    // Update Payment
    await Payment.updateOne(
      { _id: payment._id },
      { 
        status: "released",
        transactionId,
        platformFee,
        netAmount
      }
    );

    // Update Job
    await Job.updateOne({ _id: jobId }, { status: "completed" });

    // Generate Blockchain Work Proof Hash
    const timestamp = new Date().toISOString();
    let fileContent = "";
    if (job.submission && job.submission.fileUrl) {
      const normalizedPath = job.submission.fileUrl.startsWith("/") ? job.submission.fileUrl.substring(1) : job.submission.fileUrl;
      const filePath = path.join(__dirname, "..", normalizedPath);
      if (fs.existsSync(filePath)) {

        fileContent = fs.readFileSync(filePath, 'utf8');
      }
    }
    
    const workNotes = (job.submission && job.submission.notes) ? job.submission.notes : "Deliverable submitted";

    const dataToHash = fileContent + timestamp + job.clientId + job.freelancerId + transactionId;
    const workProofHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    await WorkProof.create({
      jobId,
      clientId: job.clientId,
      freelancerId: job.freelancerId,
      fileHash: workProofHash,
      workContent: workNotes,
      transactionId,
      timestamp
    });

    await Job.updateOne({ _id: jobId }, { workProofHash });

    // Create GstInvoice Record
    const gstAmount = platformFee * 0.18; // GST on Platform Fee
    await GstInvoice.create({
      jobId,
      clientId: job.clientId,
      freelancerId: job.freelancerId,
      amount: totalAmount,
      gstAmount,
      platformFee,
      pdfUrl: `/api/payments/invoice-download/${jobId}` 
    });

    res.json({ 
      message: `Payment of ₹${netAmount.toFixed(2)} released to freelancer successfully`,
      transactionId,
      workProofHash
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
