const User = require("../models/User");

// Profile Verification - Upload ID Document 
exports.uploadID = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const idDocument = `/uploads/${req.file.filename}`;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.verified = true;
    user.idDocument = idDocument;
    await user.save();

    res.json({ message: "Profile Verified Successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
