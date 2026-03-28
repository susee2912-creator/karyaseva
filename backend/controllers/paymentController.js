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
        paymentId: payment.id,
      }));
      await Milestone.bulkCreate(milestoneRecords);
    }

    res.json({ payment, message: "Escrow deposited successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.releaseMilestone = async (req, res) => {
  const { milestoneId } = req.body;
  try {
    await Milestone.update(
      { status: "released" },
      { where: { id: milestoneId } }
    );
    res.json({ message: "Milestone Released" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.releaseOptions = async (req, res) => {
  const { paymentId } = req.body;
  
  try {
    await Payment.update(
      { status: "released" },
      { where: { id: paymentId } }
    );
    await Milestone.update(
      { status: "released" },
      { where: { paymentId, status: "pending" } }
    );
    res.json({ message: "Full Payment Released" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await Payment.findByPk(paymentId, { include: [Job] });
    
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const doc = new PDFDocument();
    let filename = `GST_Invoice_${paymentId}.pdf`;
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(25).text("KARYASEVA GST INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Payment ID: ${payment.id}`);
    doc.text(`Job ID: ${payment.jobId}`);
    doc.text(`Job Title: ${payment.Job ? payment.Job.title : "N/A"}`);
    
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