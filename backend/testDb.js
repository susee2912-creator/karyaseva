const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("SUCCESS: MONGODB ATLAS CONNECTED (" + mongoose.connection.host + ")");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FAILED TO CONNECT: ", err.message);
    process.exit(1);
  });
