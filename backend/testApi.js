const jwt = require("jsonwebtoken");
require("dotenv").config();

async function run() {
  try {
    const token = jwt.sign({ id: "69c8e144afd438cd65913c51" }, process.env.JWT_SECRET);
    const res = await fetch("http://localhost:5000/api/jobs/all", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("DATA TYPE:", typeof data);
    console.log("IS ARRAY?", Array.isArray(data));
    console.log("FIRST ELEMENT:", JSON.stringify(data[0]));
    console.log("KEYS OF FIRST ELEMENT:", Object.keys(data[0]));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
