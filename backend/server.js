const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB, sequelize } = require("./config/db");

// ✅ Import models FIRST
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Payment = require("./models/Payment");
const Milestone = require("./models/Milestone");
const Review = require("./models/Review");

// ✅ Setup relationships
User.hasMany(Job, { foreignKey: "clientId" });
Job.belongsTo(User, { foreignKey: "clientId" });

User.hasMany(Application, { foreignKey: "freelancerId" });
Application.belongsTo(User, { foreignKey: "freelancerId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

Job.hasOne(Payment, { foreignKey: "jobId" });
Payment.belongsTo(Job, { foreignKey: "jobId" });

Payment.hasMany(Milestone, { foreignKey: "paymentId" });
Milestone.belongsTo(Payment, { foreignKey: "paymentId" });

Job.hasMany(Review, { foreignKey: "jobId" });
Review.belongsTo(Job, { foreignKey: "jobId" });

User.hasMany(Review, { foreignKey: "freelancerId" });
Review.belongsTo(User, { foreignKey: "freelancerId" });

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Serve static files (uploaded IDs)
app.use("/uploads", express.static("uploads"));

// ✅ Sync DB AFTER everything
sequelize.sync({ alter: true })
  .then(() => console.log("Tables created"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/", (req, res) => {
  res.send("KaryaSeva API Running 🚀");
});