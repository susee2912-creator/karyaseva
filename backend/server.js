const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { connectDB } = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/workspace", (req, res, next) => {
  console.log(`[Workspace Route] ${req.method} ${req.url}`);
  next();
}, require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));


app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Serve static files (uploaded IDs)
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/", (req, res) => {
  res.send("KaryaSeva API Running 🚀");
});