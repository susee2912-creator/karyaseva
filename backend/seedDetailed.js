const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    // Remove existing demo data to avoid duplicates on re-run
    await User.deleteMany({ email: { $in: ["demo.client@karyaseva.in", "demo.freelancer@karyaseva.in", "newbie@karyaseva.in"] } });
    
    // Hash common password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 1. Create a Client
    const client = await User.create({
      name: "Acme Corp (Demo Client)",
      email: "demo.client@karyaseva.in",
      password: hashedPassword,
      role: "client",
      verified: true,
    });

    // 2. Create Freelancers
    const freelancer1 = await User.create({
      name: "Priya Sharma",
      email: "demo.freelancer@karyaseva.in",
      password: hashedPassword,
      role: "freelancer",
      trustScore: 85,
      completedJobs: 12,
      verified: true,
    });

    const freelancer2 = await User.create({
      name: "Rahul Verma",
      email: "newbie@karyaseva.in",
      password: hashedPassword,
      role: "freelancer",
      trustScore: 50,
      completedJobs: 0,
      verified: false,
    });

    // 3. Clean up the client's old jobs
    await Job.deleteMany({ clientId: client._id });

    // 4. Insert dummy jobs
    const dummyJobs = [
      {
        title: "E-Commerce Website Development (MERN)",
        description: "Looking for an experienced full-stack developer to build a modern e-commerce platform using MERN stack. Needs payment gateway integration (Razorpay) and a secure admin dashboard.",
        budget: 50000,
        status: "open",
        riskLevel: "Low",
        clientId: client._id,
      },
      {
        title: "Logo Design for local bakery",
        description: "Need a simple, elegant logo for a new bakery startup based in Pune. Must deliver vector files.",
        budget: 2000,
        status: "completed",
        riskLevel: "Low",
        clientId: client._id,
        freelancerId: freelancer1._id,
        workProofHash: "0x89ab12cd34ef56gh78ij90kl12mn34op56qr78st90uv"
      },
      {
        title: "Data Entry - Excel formatting",
        description: "I have 500 rows of raw data that need to be categorized into specific columns. Very simple job but needs attention to detail.",
        budget: 500,
        status: "in-progress",
        riskLevel: "High", // High risk due to suspiciously low payout
        clientId: client._id,
        freelancerId: freelancer2._id,
      },
      {
        title: "React Native Mobile App Crash Fix",
        description: "Our current app is crashing on iOS 16+. We need a developer to identify the issue, fix the memory leak, and push an update to the App Store.",
        budget: 15000,
        status: "open",
        riskLevel: "Low",
        clientId: client._id,
      }
    ];

    const insertedJobs = await Job.insertMany(dummyJobs);

    // 5. Create a proposal mapped to the first open job
    await Application.deleteMany({ jobId: { $in: insertedJobs.map(j => j._id) } });
    
    await Application.create({
      jobId: insertedJobs[0]._id,
      freelancerId: freelancer1._id,
      proposal: "Hi, I have 5 years of experience with the MERN stack and have already built 3 functioning e-commerce platforms. I can deliver this securely within your timeline.",
      status: "pending"
    });

    console.log("\n✅ Database successfully populated with realistic seed data!\n");
    console.log("=== Demo Login Credentials ===");
    console.log(" 👔 Client:     demo.client@karyaseva.in");
    console.log(" 💻 Freelancer: demo.freelancer@karyaseva.in");
    console.log(" 🔑 Password:   password123");
    console.log("==============================\n");
    
    process.exit(0);

  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedDB();
