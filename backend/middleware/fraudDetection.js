exports.fraudDetection = (req, res, next) => {
  const { title, description, budget } = req.body;
  
  if (!title || !description) return next();

  const scamKeywords = ["free work", "pay outside", "test scam", "test job no pay", "crypto payment only", "wire transfer"];
  const lowerDesc = description.toLowerCase();
  const lowerTitle = title.toLowerCase();

  const isScam = scamKeywords.some(keyword => lowerDesc.includes(keyword) || lowerTitle.includes(keyword));

  if (isScam) {
    return res.status(400).json({ message: "Fraud detected: Suspicious job description. Job posting rejected." });
  }

  // Detect unsually high budget for very short description
  if (budget > 10000 && description.length < 20) {
    return res.status(400).json({ message: "Fraud detected: Unusually high budget for minimal description." });
  }

  next();
};
