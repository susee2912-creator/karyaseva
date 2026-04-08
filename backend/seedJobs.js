const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("./models/Job");
const User = require("./models/User");

dotenv.config();

const jobData = [
  {
    "title": "Frontend Developer Needed",
    "description": "Build responsive UI using React",
    "budget": 5000,
    "skills": ["React", "CSS", "JavaScript"],
    "status": "open",
    "riskLevel": "Low"
  },
  {
    "title": "Backend API Developer",
    "description": "Develop REST APIs using Node.js",
    "budget": 7000,
    "skills": ["Node.js", "Express", "MongoDB"],
    "status": "open",
    "riskLevel": "Low"
  },
  {
    "title": "UI/UX Designer",
    "description": "Design clean and modern interfaces",
    "budget": 4000,
    "skills": ["Figma", "Adobe XD"],
    "status": "open",
    "riskLevel": "Low"
  },
  {
    "title": "Mobile App Developer",
    "description": "Build Android app using Flutter",
    "budget": 8000,
    "skills": ["Flutter", "Dart"],
    "status": "open",
    "riskLevel": "Low"
  }
];

const seedDB = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    // 2. Find or Create a dummy client to satisfy the 'clientId' requirement in your Job Schema
    let dummyClient = await User.findOne({ email: "systemclient@test.com" });
    
    if (!dummyClient) {
      dummyClient = await User.create({
        name: "System Job Poster",
        email: "systemclient@test.com",
        password: "hashedpassword456", // dummy hashed password
        role: "client",
        verified: true,
      });
      console.log("Created System Client user for job associations.");
    }

    // 3. Attach the clientId to all the job entries
    const mappedJobs = jobData.map(job => ({
      ...job,
      clientId: dummyClient._id
    }));

    // 4. Insert data without overwriting existing jobs
    await Job.insertMany(mappedJobs);
    
    console.log("✅ Jobs successfully seeded without modifying existing models!");
    process.exit(0);

  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
};

seedDB();
