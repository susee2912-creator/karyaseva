const Payment = require("../models/Payment");
const Milestone = require("../models/Milestone");
const Job = require("../models/Job");
const PDFDocument = require("pdfkit");

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
  const { paymentId } = req.body;
  
  try {
    await Payment.updateOne(
      { _id: paymentId },
      { status: "released" }
    );
    await Milestone.updateMany(
      { paymentId, status: "pending" },
      { status: "released" }
    );
    res.json({ message: "Full Payment Released" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findById(paymentId).populate("jobId");
    
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const doc = new PDFDocument();
    let filename = `GST_Invoice_${paymentId}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(25).text("KARYASEVA GST INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Payment ID: ${payment._id}`);
    doc.text(`Job ID: ${payment.jobId._id}`);
    doc.text(`Job Title: ${payment.jobId && payment.jobId.title ? payment.jobId.title : "N/A"}`);
    
    const amount = payment.amount;
    const gstRate = 0.18; // 18% GST (CGST + SGST)
    const baseAmount = amount / 1.18;
    const gstAmount = amount - baseAmount;

    doc.moveDown();
    doc.fontSize(14).text(`Base Amount: ₹${baseAmount.toFixed(2)}`);
    doc.text(`GST (18%): ₹${gstAmount.toFixed(2)}`);
    doc.text(`Total Amount Paid: ₹${amount.toFixed(2)}`);

    doc.moveDown().text("India-First Platform | Low Fees & Full Support");
    
    doc.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};