const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const removeSeedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    const seedEmails = ["demo.client@karyaseva.in", "demo.freelancer@karyaseva.in", "newbie@karyaseva.in"];
    
    // 1. Find the seeded users
    const seedUsers = await User.find({ email: { $in: seedEmails } });
    const seedUserIds = seedUsers.map(u => u._id);

    if (seedUserIds.length > 0) {
      // 2. Find jobs connected to these users (either as client or freelancer)
      const jobsToDelete = await Job.find({
        $or: [
          { clientId: { $in: seedUserIds } },
          { freelancerId: { $in: seedUserIds } }
        ]
      });
      const jobIds = jobsToDelete.map(j => j._id);

      // 3. Delete related Applications
      if (jobIds.length > 0) {
        await Application.deleteMany({
          $or: [
            { jobId: { $in: jobIds } },
            { freelancerId: { $in: seedUserIds } }
          ]
        });
        
        // 4. Delete the Jobs
        await Job.deleteMany({ _id: { $in: jobIds } });
      }

      // 5. Finally, delete the Users
      await User.deleteMany({ _id: { $in: seedUserIds } });
    }

    console.log("✅ Seed data successfully removed from the database!");
    process.exit(0);
  } catch (err) {
    console.error("Error removing seed data:", err);
    process.exit(1);
  }
};

removeSeedData();
